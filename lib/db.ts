import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let db: ReturnType<typeof Database> | null = null;

export function getDb() {
  if (!db) {
    db = new Database(':memory:', { verbose: console.log });
    
    // Execute schema because it's an in-memory database
    try {
      const schemaPath = path.join(process.cwd(), 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema);
      console.log('In-memory database initialized with schema.');
    } catch (error) {
      console.error('Failed to initialize in-memory database schema:', error);
    }
  }
  return db;
}
