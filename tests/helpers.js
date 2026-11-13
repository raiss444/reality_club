const { openDb } = require('../src/db');
const { createApp } = require('../src/app');

/** Jalankan server pada port acak dengan DB in-memory baru. */
async function startServer() {
  const server = createApp(openDb(':memory:')).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://localhost:${server.address().port}`;
  const call = async (method, url, body) => {
    const res = await fetch(base + url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  };
  return { call, close: () => server.close() };
}

/** Payload valid untuk membuat 1 baris baru di setiap tabel. */
const samples = {
  members:          { name: 'Tamu', role: 'Keyboard', photo: 'images/x.jpeg', sort_order: 5 },
  releases:         { title: 'Rilisan Uji', type: 'EP', release_year: 2025, cover: null, description: 'uji' },
  tracks:           { release_id: 6, track_number: 6, title: 'Lagu Uji', duration: '2:59' },
  tour_dates:       { event_date: '2025-01-31', city: 'Pontianak', venue: 'Gedung Uji', status: 'on_sale' },
  gallery_photos:   { title: 'Foto Uji', image: 'images/uji.jpeg', caption: 'caption' },
  videos:           { title: 'Video Uji', youtube_id: 'abcdefghijk', category: 'live' },
  products:         { name: 'Produk Uji', price: 100000, stock: 3 },
  contact_messages: { name: 'Penguji', email: 'uji@email.com', message: 'Halo' },
  faqs:             { question: 'Apa?', answer: 'Itu.', sort_order: 9 },
};

module.exports = { startServer, samples };
