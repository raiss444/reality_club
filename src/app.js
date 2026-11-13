const path = require('node:path');
const express = require('express');
const resources = require('./resources');
const crud = require('./crud');

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
