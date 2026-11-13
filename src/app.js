const path = require('node:path');
const express = require('express');
const resources = require('./resources');
const crud = require('./crud');
const { validate } = require('./validate');

/** Ubah galat constraint SQLite menjadi respons 4xx yang mudah dibaca. */
function dbError(err, res) {
  const msg = String(err.message || '');
  if (msg.includes('UNIQUE')) return res.status(409).json({ error: 'Data duplikat: kombinasi nilai tersebut sudah ada' });
  if (msg.includes('FOREIGN KEY')) return res.status(409).json({ error: 'Relasi data tidak valid atau masih dipakai data lain' });
  if (msg.includes('CHECK') || msg.includes('NOT NULL')) return res.status(400).json({ error: 'Data melanggar aturan basis data' });
  throw err;
}

function createApp(db) {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  // Metadata tabel untuk panel admin
  app.get('/api/_meta', (_req, res) => res.json(resources));

  // Validasi nama tabel (whitelist) sebelum rute /api/:resource...
  const api = express.Router();
  api.param('resource', (req, res, next, name) => {
    if (!Object.hasOwn(resources, name)) return res.status(404).json({ error: `Tabel '${name}' tidak ditemukan` });
    next();
  });
  api.param('id', (req, res, next, id) => {
    if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID harus berupa angka' });
    next();
  });

  // ── READ ──
  api.get('/:resource', (req, res) => {
    const { q, limit, offset } = req.query;
    res.json(crud.list(db, req.params.resource, { q, limit, offset }));
  });

  api.get('/:resource/:id', (req, res) => {
    const row = crud.get(db, req.params.resource, Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(row);
  });

  // ── CREATE ──
  api.post('/:resource', (req, res) => {
    const table = req.params.resource;
    const { values, errors } = validate(db, table, req.body);
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Validasi gagal', details: errors });
    try {
      res.status(201).json(crud.create(db, table, values));
    } catch (err) { dbError(err, res); }
  });

  // ── UPDATE ──
  // PUT   = ganti seluruh kolom (semua kolom wajib terpenuhi seperti saat Create)
  // PATCH = ubah sebagian kolom; kolom yang tidak dikirim tetap bernilai lama
  const updateHandler = (partial) => (req, res) => {
    const table = req.params.resource;
    const id = Number(req.params.id);
    const existing = crud.get(db, table, id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });
    const input = partial && req.body && typeof req.body === 'object' ? { ...existing, ...req.body } : req.body;
    const { values, errors } = validate(db, table, input);
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Validasi gagal', details: errors });
    try {
      res.json(crud.update(db, table, id, values));
    } catch (err) { dbError(err, res); }
  };
  api.put('/:resource/:id', updateHandler(false));
  api.patch('/:resource/:id', updateHandler(true));

  // ── DELETE ──
  // Menghapus rilisan ikut menghapus tracklist-nya (FK ON DELETE CASCADE).
  api.delete('/:resource/:id', (req, res) => {
    try {
      if (!crud.remove(db, req.params.resource, Number(req.params.id))) {
        return res.status(404).json({ error: 'Data tidak ditemukan' });
      }
      res.status(204).end();
    } catch (err) { dbError(err, res); }
  });

  app.use('/api', api);

  // Website statis + panel admin
  app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
  app.use(express.static(path.join(__dirname, '..', 'website')));
  app.get('/', (_req, res) => res.redirect('/realityclub.html'));

  // Penanganan error umum
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON tidak valid' });
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  });
  return app;
}

module.exports = { createApp };
