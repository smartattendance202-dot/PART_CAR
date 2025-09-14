// Migrate data from data/db.json to data/db.sqlite (products, branches, settings)
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const root = 'c:\\Users\\OS ABD\\Desktop\\البرمجة والتطوير\\موقع ابونيا لقطع غيار السيارات';
const dataDir = path.join(root, 'data');
const jsonPath = path.join(dataDir, 'db.json');
const dbPath = path.join(dataDir, 'db.sqlite');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(jsonPath)) {
  console.log('No db.json found. Nothing to migrate.');
  process.exit(0);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  models TEXT,
  image TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  coordinates TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data_json TEXT NOT NULL
);
INSERT OR IGNORE INTO settings(id, data_json) VALUES (1, '{}');
`);

const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const insertProduct = db.prepare('INSERT INTO products (name, models, image) VALUES (?, ?, ?)');
(json.products || []).forEach(p => {
  insertProduct.run(p.name || '', p.models || '', p.image || '');
});

const insertBranch = db.prepare('INSERT INTO branches (name, address, phone, coordinates) VALUES (?, ?, ?, ?)');
(json.branches || []).forEach(b => {
  insertBranch.run(b.name || '', b.address || '', b.phone || '', b.coordinates || '');
});

if (json.settings) {
  db.prepare('UPDATE settings SET data_json=? WHERE id=1').run(JSON.stringify(json.settings));
}

console.log('Migration completed successfully.');