import Database from "better-sqlite3";
import path from "path";
import type { Post, User } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "posts.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL DEFAULT '',
        article TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );
    `);
  }
  return db;
}

// ─── Users ───

export function getUserCount(): number {
  const stmt = getDb().prepare("SELECT COUNT(*) as count FROM users");
  return (stmt.get() as { count: number }).count;
}

export function getUserByUsername(username: string): (User & { password_hash: string }) | undefined {
  const stmt = getDb().prepare(
    "SELECT id, username, password_hash, created_at FROM users WHERE username = ?"
  );
  return stmt.get(username) as (User & { password_hash: string }) | undefined;
}

export function getUserById(id: number): User | undefined {
  const stmt = getDb().prepare("SELECT id, username, created_at FROM users WHERE id = ?");
  return stmt.get(id) as User | undefined;
}

export function createUser(username: string, passwordHash: string): User {
  const stmt = getDb().prepare(
    "INSERT INTO users (username, password_hash) VALUES (@username, @passwordHash)"
  );
  const info = stmt.run({ username, passwordHash });
  return getUserById(info.lastInsertRowid as number)!;
}

export function updateUserPassword(id: number, passwordHash: string): void {
  const stmt = getDb().prepare("UPDATE users SET password_hash = ? WHERE id = ?");
  stmt.run(passwordHash, id);
}

export function getUserPasswordHash(id: number): string | undefined {
  const stmt = getDb().prepare("SELECT password_hash FROM users WHERE id = ?");
  const row = stmt.get(id) as { password_hash: string } | undefined;
  return row?.password_hash;
}

export function getPosts(): Post[] {
  const stmt = getDb().prepare(
    "SELECT * FROM posts ORDER BY date DESC"
  );
  return stmt.all() as Post[];
}

export function getPostById(id: number): Post | undefined {
  const stmt = getDb().prepare("SELECT * FROM posts WHERE id = ?");
  return stmt.get(id) as Post | undefined;
}

export function createPost(post: {
  date: string;
  title: string;
  article: string;
  notes: string;
}): Post {
  const stmt = getDb().prepare(
    `INSERT INTO posts (date, title, article, notes)
     VALUES (@date, @title, @article, @notes)`
  );
  const info = stmt.run(post);
  return getPostById(info.lastInsertRowid as number)!;
}

export function updatePost(
  id: number,
  post: { date?: string; title?: string; article?: string; notes?: string }
): Post | undefined {
  const existing = getPostById(id);
  if (!existing) return undefined;

  const updated = { ...existing, ...post, id };
  const stmt = getDb().prepare(
    `UPDATE posts
     SET date = @date, title = @title, article = @article, notes = @notes,
         updated_at = datetime('now', 'localtime')
     WHERE id = @id`
  );
  stmt.run(updated);
  return getPostById(id);
}

export function deletePost(id: number): boolean {
  const stmt = getDb().prepare("DELETE FROM posts WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0;
}
