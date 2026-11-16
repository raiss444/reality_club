const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { startServer } = require('./helpers');

const site = path.join(__dirname, '..', 'website');
const script = fs.readFileSync(path.join(site, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(site, 'realityclub.html'), 'utf8');

test('script.js memakai API, bukan data manual', () => {
  assert.ok(script.includes('/${table}?limit=1000'));
  for (const t of ['members', 'releases', 'tracks', 'tour_dates', 'gallery_photos', 'products', 'product_sizes', 'product_images', 'faqs', 'contact_messages'])
    assert.ok(script.includes(t), `script.js belum memakai tabel ${t}`);
});

test('wadah HTML untuk render otomatis tersedia', () => {
  for (const id of ['members', 'discs', 'songList', 'shows', 'photos', 'merch', 'merch2', 'faqs', 'form'])
    assert.ok(html.includes(`id="${id}"`), `#${id} tidak ada`);
});

test('data untuk setiap section website tersedia dari API', async () => {
  const s = await startServer();
  try {
    for (const t of ['members', 'releases', 'tracks', 'tour_dates', 'gallery_photos', 'products', 'product_sizes', 'product_images', 'faqs']) {
      const r = await s.call('GET', `/api/${t}?limit=1000`);
      assert.equal(r.status, 200);
      assert.ok(r.body.total > 0, `${t} kosong`);
    }
    const r = await s.call('POST', '/api/contact_messages', { name: 'Uji', email: 'uji@mail.com', message: 'Halo dari website' });
    assert.equal(r.status, 201);
  } finally { s.close(); }
});
