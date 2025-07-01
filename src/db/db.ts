import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbPromise: Promise<Database> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.resolve(process.cwd(), 'chat.db'),
      driver: sqlite3.Database
    }).then(async (db) => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS chats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chat_id INTEGER NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
          content TEXT NOT NULL,
          tokens INTEGER GENERATED ALWAYS AS ((LENGTH(content) + 12) / 4) STORED,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE
        );
      `);
      await db.exec(`
        CREATE TABLE IF NOT EXISTS summaries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chat_id INTEGER NOT NULL,
          end_message_id INTEGER NOT NULL,
          summary TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE,
          FOREIGN KEY(end_message_id) REFERENCES messages(id)
        );
      `);

      return db;
    });
  }
  return dbPromise;
}
