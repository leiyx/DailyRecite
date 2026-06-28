import { createClient, type Client } from "@libsql/client";
import type { Post, User } from "./types";

let client: Client | null = null;

async function getDb(): Promise<Client> {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || "file:data/posts.db";
    client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    await client.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL DEFAULT '',
        article TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      )
    `);
  }
  return client;
}

// ─── Users ───

export async function getUserCount(): Promise<number> {
  const db = await getDb();
  const result = await db.execute("SELECT COUNT(*) as count FROM users");
  return (result.rows[0] as unknown as { count: number }).count;
}

export async function getUserByUsername(
  username: string
): Promise<(User & { password_hash: string }) | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT id, username, password_hash, created_at FROM users WHERE username = ?",
    args: [username],
  });
  return result.rows[0] as unknown as (User & { password_hash: string }) | undefined;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT id, username, created_at FROM users WHERE id = ?",
    args: [id],
  });
  return result.rows[0] as unknown as User | undefined;
}

export async function createUser(
  username: string,
  passwordHash: string
): Promise<User> {
  const db = await getDb();
  const result = await db.execute({
    sql: "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    args: [username, passwordHash],
  });
  const userId = Number(result.lastInsertRowid);
  return (await getUserById(userId))!;
}

export async function updateUserPassword(
  id: number,
  passwordHash: string
): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "UPDATE users SET password_hash = ? WHERE id = ?",
    args: [passwordHash, id],
  });
}

export async function getUserPasswordHash(
  id: number
): Promise<string | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT password_hash FROM users WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0] as unknown as { password_hash: string } | undefined;
  return row?.password_hash;
}

// ─── Posts ───

export async function getPosts(): Promise<Post[]> {
  const db = await getDb();
  const result = await db.execute("SELECT * FROM posts ORDER BY date DESC");
  return result.rows as unknown as Post[];
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT * FROM posts WHERE id = ?",
    args: [id],
  });
  return result.rows[0] as unknown as Post | undefined;
}

export async function createPost(post: {
  date: string;
  title: string;
  article: string;
  notes: string;
}): Promise<Post> {
  const db = await getDb();
  const result = await db.execute({
    sql: "INSERT INTO posts (date, title, article, notes) VALUES (?, ?, ?, ?)",
    args: [post.date, post.title, post.article, post.notes],
  });
  const id = Number(result.lastInsertRowid);
  return (await getPostById(id))!;
}

export async function updatePost(
  id: number,
  post: { date?: string; title?: string; article?: string; notes?: string }
): Promise<Post | undefined> {
  const existing = await getPostById(id);
  if (!existing) return undefined;

  const updated = { ...existing, ...post, id };
  const db = await getDb();
  await db.execute({
    sql: `UPDATE posts
          SET date = ?, title = ?, article = ?, notes = ?,
              updated_at = datetime('now', 'localtime')
          WHERE id = ?`,
    args: [updated.date, updated.title, updated.article, updated.notes, id],
  });
  return getPostById(id);
}

export async function deletePost(id: number): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({
    sql: "DELETE FROM posts WHERE id = ?",
    args: [id],
  });
  return result.rowsAffected > 0;
}
