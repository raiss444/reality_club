-- Skema basis data Reality Club (SQLite)
-- Diturunkan dari konten website Reality Club versi terbaru: personel, diskografi, lagu,
-- jadwal tur, galeri, merchandise (+ ukuran & foto), pesan kontak, dan FAQ.

CREATE TABLE IF NOT EXISTS members (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  role        TEXT    NOT NULL,
  photo       TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS releases (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT    NOT NULL,
  type          TEXT    NOT NULL CHECK (type IN ('Single','EP','Album')),
  release_year  INTEGER NOT NULL CHECK (release_year BETWEEN 1900 AND 2100),
  cover         TEXT,
  description   TEXT
);

CREATE TABLE IF NOT EXISTS tracks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  release_id    INTEGER NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  track_number  INTEGER NOT NULL CHECK (track_number >= 1),
  title         TEXT    NOT NULL,
  duration      TEXT    NOT NULL,           -- format m:ss
  audio_file    TEXT,                       -- nama file di audio/ (tanpa .mp3)
  UNIQUE (release_id, track_number)
);

CREATE TABLE IF NOT EXISTS tour_dates (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  date_label  TEXT    NOT NULL,             -- teks tampilan, mis. '16–18 Oktober 2026'
  event_date  TEXT,                         -- YYYY-MM-DD (kosong bila tanggal belum diumumkan)
  city        TEXT    NOT NULL,
  venue       TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'next' CHECK (status IN ('done','next')),
  ticket_url  TEXT
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  title    TEXT NOT NULL,
  image    TEXT NOT NULL,
  caption  TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,     -- id produk di website, mis. 'wkwlty'
  name         TEXT    NOT NULL,
  price        INTEGER NOT NULL CHECK (price >= 0),   -- dalam Rupiah
  category     TEXT    NOT NULL DEFAULT 'best_seller' CHECK (category IN ('best_seller','lainnya')),
  image        TEXT,
  description  TEXT
);

CREATE TABLE IF NOT EXISTS product_sizes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        TEXT    NOT NULL,
  UNIQUE (product_id, size)
);

CREATE TABLE IF NOT EXISTS product_images (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image       TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faqs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
