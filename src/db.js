const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_DIR = path.join(__dirname, '..', 'database');

/**
 * Membuka basis data, membuat tabel bila belum ada, dan mengisi data awal
 * hanya pada pembuatan pertama (basis data baru).
 * @param {string} file  path file .db atau ':memory:'
 * @param {{seed?: boolean}} opts
 */
function openDb(file = process.env.DB_PATH || path.join(DB_DIR, 'realityclub.db'), { seed = true } = {}) {
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON');
  const fresh = !db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='members'").get();
  db.exec(fs.readFileSync(path.join(DB_DIR, 'schema.sql'), 'utf8'));
  if (fresh && seed) db.exec(fs.readFileSync(path.join(DB_DIR, 'seed.sql'), 'utf8'));
  return db;
}

module.exports = { openDb };
