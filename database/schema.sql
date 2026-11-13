-- Skema basis data Reality Club (SQLite)
-- Diturunkan dari entitas konten pada website: personel, diskografi, tracklist,
-- jadwal tur, galeri, video, merchandise, pesan kontak, dan FAQ.

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
  UNIQUE (release_id, track_number)
);

CREATE TABLE IF NOT EXISTS tour_dates (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  event_date  TEXT    NOT NULL,             -- YYYY-MM-DD
  city        TEXT    NOT NULL,
  venue       TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'on_sale' CHECK (status IN ('on_sale','sold_out')),
  ticket_url  TEXT
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  title    TEXT NOT NULL,
  image    TEXT NOT NULL,
  caption  TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  youtube_id   TEXT NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('music_video','live')),
  description  TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  price        INTEGER NOT NULL CHECK (price >= 0),   -- dalam Rupiah
  image        TEXT,
  stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description  TEXT
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
