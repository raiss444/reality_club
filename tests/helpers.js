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
  tracks:           { release_id: 1, track_number: 6, title: 'Lagu Uji', duration: '2:59', audio_file: 'lagu-uji' },
  tour_dates:       { date_label: '31 Januari 2027', event_date: '2027-01-31', city: 'Pontianak', venue: 'Gedung Uji', status: 'next' },
  gallery_photos:   { title: 'Foto Uji', image: 'images/uji.jpeg', caption: 'caption' },
  products:         { slug: 'produk-uji', name: 'Produk Uji', price: 100000, category: 'lainnya' },
  product_sizes:    { product_id: 3, size: 'XXL' },
  product_images:   { product_id: 1, image: 'images/uji.jpeg', sort_order: 9 },
  contact_messages: { name: 'Penguji', email: 'uji@email.com', message: 'Halo' },
  faqs:             { question: 'Apa?', answer: 'Itu.', sort_order: 9 },
};

module.exports = { startServer, samples };
