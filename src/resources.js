/**
 * Definisi 9 tabel. Satu definisi dipakai bersama oleh:
 *  - API (daftar kolom yang boleh diakses, validasi, pencarian)
 *  - Panel admin (membangun tabel & formulir secara otomatis lewat /api/_meta)
 *
 * Nama tabel/kolom SQL hanya berasal dari definisi ini (bukan dari input
 * pengguna) sehingga aman dari SQL injection pada identifier.
 */
const text = (name, label, o = {}) => ({ name, label, type: 'text', ...o });
const area = (name, label, o = {}) => ({ name, label, type: 'textarea', ...o });
const int = (name, label, o = {}) => ({ name, label, type: 'number', ...o });

module.exports = {
  members: {
    label: 'Members', orderBy: 'sort_order, id', searchable: ['name', 'role'],
    fields: [
      text('name', 'Nama', { required: true, max: 100, list: true }),
      text('role', 'Peran', { required: true, max: 50, list: true }),
      text('photo', 'Foto (path)', { max: 255, image: true, list: true }),
      int('sort_order', 'Urutan', { default: 0, min: 0, list: true }),
    ],
  },
  releases: {
    label: 'Releases (Diskografi)', cascades: ['tracks'], orderBy: 'release_year DESC, id DESC', searchable: ['title', 'type'],
    fields: [
      text('title', 'Judul', { required: true, max: 150, list: true }),
      { name: 'type', label: 'Jenis', type: 'select', options: ['Single', 'EP', 'Album'], required: true, list: true },
      int('release_year', 'Tahun', { required: true, min: 1900, max: 2100, list: true }),
      text('cover', 'Cover (path)', { max: 255, image: true, list: true }),
      area('description', 'Deskripsi', { max: 1000 }),
    ],
  },
  tracks: {
    label: 'Tracks (Tracklist)', orderBy: 'release_id, track_number', searchable: ['title'],
    fields: [
      { name: 'release_id', label: 'Rilisan', type: 'ref', ref: 'releases', refLabel: 'title', required: true, list: true },
      int('track_number', 'No. Track', { required: true, min: 1, list: true }),
      text('title', 'Judul Lagu', { required: true, max: 150, list: true }),
      text('duration', 'Durasi (m:ss)', { required: true, pattern: '^\\d{1,2}:[0-5]\\d$', patternHint: 'format m:ss, mis. 3:45', list: true }),
    ],
  },
  tour_dates: {
    label: 'Tour Dates', orderBy: 'event_date', searchable: ['city', 'venue'],
    fields: [
      { name: 'event_date', label: 'Tanggal', type: 'date', required: true, list: true },
      text('city', 'Kota', { required: true, max: 80, list: true }),
      text('venue', 'Venue', { required: true, max: 120, list: true }),
      { name: 'status', label: 'Status Tiket', type: 'select', options: ['on_sale', 'sold_out'], default: 'on_sale', required: true, list: true },
      text('ticket_url', 'URL Tiket', { max: 255 }),
    ],
  },
  gallery_photos: {
    label: 'Gallery Photos', orderBy: 'id', searchable: ['title', 'caption'],
    fields: [
      text('title', 'Judul', { required: true, max: 150, list: true }),
      text('image', 'Gambar (path)', { required: true, max: 255, image: true, list: true }),
      area('caption', 'Caption', { max: 500 }),
    ],
  },
  videos: {
    label: 'Videos', orderBy: 'category, id', searchable: ['title', 'youtube_id'],
    fields: [
      text('title', 'Judul', { required: true, max: 150, list: true }),
      text('youtube_id', 'YouTube ID', { required: true, pattern: '^[A-Za-z0-9_-]{11}$', patternHint: '11 karakter ID YouTube', list: true }),
      { name: 'category', label: 'Kategori', type: 'select', options: ['music_video', 'live'], required: true, list: true },
      area('description', 'Keterangan', { max: 500 }),
    ],
  },
  products: {
    label: 'Products (Merchandise)', orderBy: 'id', searchable: ['name'],
    fields: [
      text('name', 'Nama Produk', { required: true, max: 120, list: true }),
      int('price', 'Harga (IDR)', { required: true, min: 0, list: true }),
      text('image', 'Gambar (path)', { max: 255, image: true, list: true }),
      int('stock', 'Stok', { default: 0, min: 0, list: true }),
      area('description', 'Deskripsi', { max: 1000 }),
    ],
  },
  contact_messages: {
    label: 'Contact Messages', orderBy: 'created_at DESC, id DESC', searchable: ['name', 'email', 'message'],
    readonlyColumns: [{ name: 'created_at', label: 'Dikirim', list: true }],
    fields: [
      text('name', 'Nama', { required: true, max: 100, list: true }),
      { name: 'email', label: 'Email', type: 'email', required: true, max: 150, list: true },
      area('message', 'Pesan', { required: true, max: 2000 }),
    ],
  },
  faqs: {
    label: 'FAQs', orderBy: 'sort_order, id', searchable: ['question', 'answer'],
    fields: [
      text('question', 'Pertanyaan', { required: true, max: 255, list: true }),
      area('answer', 'Jawaban', { required: true, max: 2000 }),
      int('sort_order', 'Urutan', { default: 0, min: 0, list: true }),
    ],
  },
};
