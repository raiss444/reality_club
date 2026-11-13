// Tahap 1 (WBS 2.2): pengujian Create (Insert) dan Read (Select)
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, samples } = require('./helpers');

let s;
before(async () => { s = await startServer(); });
after(() => s.close());

const tables = Object.keys(samples);

for (const t of tables) {
  test(`READ ${t}: daftar berisi data awal + metadata paging`, async () => {
    const r = await s.call('GET', `/api/${t}`);
    assert.equal(r.status, 200);
    assert.ok(r.body.total >= 1);
    assert.ok(Array.isArray(r.body.data));
    assert.equal(r.body.data.length, r.body.total);
  });

  test(`CREATE ${t}: POST valid -> 201, lalu bisa dibaca (READ by id)`, async () => {
    const created = await s.call('POST', `/api/${t}`, samples[t]);
    assert.equal(created.status, 201, JSON.stringify(created.body));
    assert.ok(created.body.id);
    const read = await s.call('GET', `/api/${t}/${created.body.id}`);
    assert.equal(read.status, 200);
    for (const [k, v] of Object.entries(samples[t])) assert.equal(read.body[k], v ?? null, `kolom ${k}`);
  });

  test(`CREATE ${t}: body kosong ditolak 422`, async () => {
    const r = await s.call('POST', `/api/${t}`, {});
    assert.equal(r.status, 422);
    assert.ok(Object.keys(r.body.details).length > 0);
  });

  test(`READ ${t}: id tidak ada -> 404`, async () => {
    assert.equal((await s.call('GET', `/api/${t}/999999`)).status, 404);
  });
}

test('READ: pencarian ?q= dan pagination', async () => {
  const q = await s.call('GET', '/api/tour_dates?q=malaysia');
  assert.equal(q.body.total, 1);
  assert.equal(q.body.data[0].city, 'Kuala Lumpur, Malaysia');
  const p = await s.call('GET', '/api/gallery_photos?limit=3&offset=3');
  assert.equal(p.body.data.length, 3);
  assert.ok(p.body.total >= 8);
});

test('READ tracks: menyertakan label relasi rilisan', async () => {
  const r = await s.call('GET', '/api/tracks/1');
  assert.equal(r.body.release_id__label, 'Reality Club Presents…');
});

test('CREATE: aturan validasi spesifik', async () => {
  const bad = (t, over) => s.call('POST', `/api/${t}`, { ...samples[t], ...over });
  assert.equal((await bad('products', { price: -1 })).status, 422);
  assert.equal((await bad('products', { price: 'abc' })).status, 422);
  assert.equal((await bad('releases', { type: 'Mixtape' })).status, 422);
  assert.equal((await bad('tour_dates', { event_date: '31-01-2027' })).status, 422);
  assert.equal((await bad('products', { slug: 'Slug Salah!' })).status, 422);
  assert.equal((await bad('tour_dates', { status: 'on_sale' })).status, 422);
  assert.equal((await bad('contact_messages', { email: 'bukan-email' })).status, 422);
  assert.equal((await bad('tracks', { duration: '3:75' })).status, 422);
  assert.equal((await bad('tracks', { release_id: 12345 })).status, 422);
});

test('CREATE tracks: nomor track ganda pada rilisan sama -> 409', async () => {
  const r = await s.call('POST', '/api/tracks', { release_id: 2, track_number: 1, title: 'Dobel', duration: '1:00' });
  assert.equal(r.status, 409);
});

test('CREATE: kolom asing diabaikan (mass-assignment) & nilai default dipakai', async () => {
  const r = await s.call('POST', '/api/products', { slug: 'tanpa-kategori', name: 'Tanpa Kategori', price: 1, id: 9999, hack: 'x' });
  assert.equal(r.status, 201);
  assert.notEqual(r.body.id, 9999);
  assert.equal(r.body.category, 'best_seller');
  assert.equal('hack' in r.body, false);
});

test('CREATE: SQL injection pada nilai diperlakukan sebagai teks biasa', async () => {
  const evil = "x'); DROP TABLE faqs;--";
  const r = await s.call('POST', '/api/faqs', { question: evil, answer: 'a' });
  assert.equal(r.status, 201);
  assert.equal(r.body.question, evil);
  assert.equal((await s.call('GET', '/api/faqs')).status, 200);
});

test('API: nama tabel di luar whitelist -> 404; JSON rusak -> 400', async () => {
  assert.equal((await s.call('GET', '/api/sqlite_master')).status, 404);
  assert.equal((await s.call('GET', '/api/members/abc')).status, 400);
});

test('CREATE tour_dates: tanggal boleh kosong (belum diumumkan)', async () => {
  const r = await s.call('POST', '/api/tour_dates', { date_label: 'Segera', city: 'Medan', venue: 'TBA' });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  assert.equal(r.body.event_date, null);
  assert.equal(r.body.status, 'next');
});

test('CREATE products: slug ganda -> 409', async () => {
  const r = await s.call('POST', '/api/products', { slug: 'wkwlty', name: 'Dobel', price: 1 });
  assert.equal(r.status, 409);
});
