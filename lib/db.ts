import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local.db');

let db: ReturnType<typeof Database> | null = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL');
  }
  return db;
}
