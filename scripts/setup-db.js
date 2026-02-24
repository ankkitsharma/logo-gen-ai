const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'local.db');
const schemaPath = path.join(process.cwd(), 'schema.sql');

console.log('Setting up database at:', dbPath);

try {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('Database schema executed successfully.');
  } else {
    console.log('schema.sql not found at', schemaPath);
  }

  db.close();
  console.log('Database setup complete.');
} catch (error) {
  console.error('Error setting up database:', error);
  process.exit(1);
}
