import Database from "better-sqlite3";
import path from "path";
import type { Post } from "./types";

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
      )
    `);
  }
  return db;
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
