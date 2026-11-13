// Tahap 2 (WBS 2.3): pengujian Update dan Delete
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, samples } = require('./helpers');

let s;
before(async () => { s = await startServer(); });
after(() => s.close());

// Payload unik per pemanggilan (tracks punya UNIQUE(release_id, track_number))
let seq = 100;
const fresh = (t) => (t === 'tracks' ? { ...samples.tracks, track_number: seq++ } : { ...samples[t] });

// Perubahan valid per tabel: [kolom, nilai baru]
const changes = {
  members: ['role', 'Keyboard'],
  releases: ['title', 'Judul Baru'],
  tracks: ['title', 'Lagu Baru'],
  tour_dates: ['venue', 'Venue Baru'],
  gallery_photos: ['caption', 'Caption Baru'],
  videos: ['title', 'Video Baru'],
  products: ['price', 123000],
  contact_messages: ['message', 'Pesan diubah'],
  faqs: ['answer', 'Jawaban baru'],
};

for (const t of Object.keys(samples)) {
  test(`UPDATE ${t}: PUT mengganti data, GET membuktikan perubahan`, async () => {
    const payload = fresh(t);
    const { body: made } = await s.call('POST', `/api/${t}`, payload);
    const [col, val] = changes[t];
    const put = await s.call('PUT', `/api/${t}/${made.id}`, { ...payload, [col]: val });
    assert.equal(put.status, 200, JSON.stringify(put.body));
    assert.equal(put.body[col], val);
    assert.equal((await s.call('GET', `/api/${t}/${made.id}`)).body[col], val);
  });

  test(`UPDATE ${t}: PUT tidak valid -> 422; id tidak ada -> 404`, async () => {
    const { body: made } = await s.call('POST', `/api/${t}`, fresh(t));
    assert.equal((await s.call('PUT', `/api/${t}/${made.id}`, {})).status, 422);
    assert.equal((await s.call('PUT', `/api/${t}/999999`, fresh(t))).status, 404);
  });

  test(`DELETE ${t}: 204, lalu GET -> 404, hapus ulang -> 404`, async () => {
    const { body: made } = await s.call('POST', `/api/${t}`, fresh(t));
    assert.equal((await s.call('DELETE', `/api/${t}/${made.id}`)).status, 204);
    assert.equal((await s.call('GET', `/api/${t}/${made.id}`)).status, 404);
    assert.equal((await s.call('DELETE', `/api/${t}/${made.id}`)).status, 404);
  });
}

test('UPDATE: PATCH hanya mengubah kolom yang dikirim', async () => {
  const before = (await s.call('GET', '/api/products/1')).body;
  const r = await s.call('PATCH', '/api/products/1', { stock: 77 });
  assert.equal(r.status, 200);
  assert.equal(r.body.stock, 77);
  assert.equal(r.body.name, before.name);
  assert.equal(r.body.price, before.price);
  assert.equal(r.body.image, before.image);
});

test('UPDATE: PATCH nilai tidak valid -> 422 dan data lama utuh', async () => {
  const r = await s.call('PATCH', '/api/products/2', { price: -10 });
  assert.equal(r.status, 422);
  assert.equal((await s.call('GET', '/api/products/2')).body.price, 189000);
});

test('UPDATE: melanggar UNIQUE (nomor track ganda) -> 409, data tidak berubah', async () => {
  const r = await s.call('PATCH', '/api/tracks/2', { track_number: 1 });
  assert.equal(r.status, 409);
  assert.equal((await s.call('GET', '/api/tracks/2')).body.track_number, 2);
});

test('UPDATE: tidak bisa mengubah id lewat body', async () => {
  const r = await s.call('PUT', '/api/faqs/2', { question: 'Q', answer: 'A', id: 777 });
  assert.equal(r.status, 200);
  assert.equal(r.body.id, 2);
});

test('UPDATE tracks: pindah ke rilisan lain yang valid, dan ditolak bila rilisan tidak ada', async () => {
  const { body: rel } = await s.call('POST', '/api/releases', samples.releases);
  const ok = await s.call('PATCH', '/api/tracks/3', { release_id: rel.id, track_number: 1 });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.release_id__label, 'Rilisan Uji');
  assert.equal((await s.call('PATCH', '/api/tracks/3', { release_id: 424242 })).status, 422);
});

test('DELETE releases: tracks terkait ikut terhapus (CASCADE), tabel lain tidak terpengaruh', async () => {
  const tracksBefore = (await s.call('GET', '/api/tracks?limit=1000')).body.data.filter((t) => t.release_id === 6).length;
  assert.ok(tracksBefore > 0);
  const productsBefore = (await s.call('GET', '/api/products')).body.total;
  assert.equal((await s.call('DELETE', '/api/releases/6')).status, 204);
  const left = (await s.call('GET', '/api/tracks?limit=1000')).body.data.filter((t) => t.release_id === 6);
  assert.equal(left.length, 0);
  assert.equal((await s.call('GET', '/api/products')).body.total, productsBefore);
});

test('DELETE: id non-numerik -> 400; tabel tak dikenal -> 404', async () => {
  assert.equal((await s.call('DELETE', '/api/faqs/abc')).status, 400);
  assert.equal((await s.call('DELETE', '/api/pengguna/1')).status, 404);
});

test('DELETE: jumlah baris berkurang tepat satu', async () => {
  const n = (await s.call('GET', '/api/faqs')).body.total;
  const { body: made } = await s.call('POST', '/api/faqs', samples.faqs);
  assert.equal((await s.call('GET', '/api/faqs')).body.total, n + 1);
  await s.call('DELETE', `/api/faqs/${made.id}`);
  assert.equal((await s.call('GET', '/api/faqs')).body.total, n);
});
