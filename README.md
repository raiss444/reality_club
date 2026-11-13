# Reality Club — Website + CRUD Basis Data

Website resmi band **Reality Club** (HTML/CSS/JS) yang ditambah lapisan **basis data
SQLite** dan **operasi CRUD** untuk seluruh tabelnya, lengkap dengan REST API dan panel admin.

> Catatan: berkas awal proyek (`website/`) adalah situs statis tanpa basis data. Skema tabel di
> repositori ini diturunkan dari konten yang sudah ada pada situs (personel, diskografi, tracklist,
> jadwal tur, galeri, video, merchandise, pesan kontak, FAQ).

## Tahapan pengerjaan

| Tahap | WBS | Isi | Status |
|---|---|---|---|
| 1 | 2.2 | **Create** (Insert) dan **Read** (Select) | ✅ |
| 2 | 2.3 | **Update** dan **Delete** | ✅ |

## Menjalankan

Prasyarat: **Node.js ≥ 22.5** (memakai modul bawaan `node:sqlite`, tanpa instalasi MySQL).

```bash
npm install
npm start            # http://localhost:3000   (admin: /admin/)
npm test             # pengujian otomatis
```

Basis data `database/realityclub.db` dibuat otomatis beserta data awal (`seed.sql`) saat pertama dijalankan.
Hapus berkas itu untuk mengulang dari data awal.

## Tabel (9)

| Tabel | Keterangan | Relasi |
|---|---|---|
| `members` | Personel band | — |
| `releases` | Diskografi (Single/EP/Album) | — |
| `tracks` | Tracklist | `release_id` → `releases` |
| `tour_dates` | Jadwal konser & status tiket | — |
| `gallery_photos` | Foto galeri | — |
| `videos` | Video musik & live | — |
| `products` | Merchandise | — |
| `contact_messages` | Pesan dari form kontak | — |
| `faqs` | Pertanyaan umum | — |

## API — Tahap 1 (Create & Read)

| Operasi | Metode & URL | Respons |
|---|---|---|
| Read (daftar) | `GET /api/:tabel?q=&limit=&offset=` | `200 {data,total,limit,offset}` |
| Read (satu) | `GET /api/:tabel/:id` | `200` / `404` |
| Create | `POST /api/:tabel` (body JSON) | `201` baris baru / `422` validasi / `409` duplikat |

Contoh:
```bash
curl http://localhost:3000/api/products
curl -X POST http://localhost:3000/api/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Tote Bag","price":99000,"stock":20}'
```

## API — Tahap 2 (Update & Delete)

| Operasi | Metode & URL | Respons |
|---|---|---|
| Update (ganti penuh) | `PUT /api/:tabel/:id` — semua kolom wajib terpenuhi; kolom opsional yang tidak dikirim menjadi kosong | `200` baris terbaru / `404` / `422` / `409` |
| Update (sebagian) | `PATCH /api/:tabel/:id` — hanya kolom yang dikirim yang berubah | `200` / `404` / `422` / `409` |
| Delete | `DELETE /api/:tabel/:id` | `204` / `404` |

Catatan: menghapus sebuah **rilisan** otomatis menghapus **tracklist**-nya (`ON DELETE CASCADE`);
panel admin menampilkan peringatan sebelum penghapusan.

```bash
curl -X PATCH http://localhost:3000/api/products/1 -H 'Content-Type: application/json' -d '{"stock":15}'
curl -X DELETE http://localhost:3000/api/faqs/4
```

## Panel admin

Buka `http://localhost:3000/admin/` — sidebar berisi 9 tabel; tiap tabel mendukung pencarian, paging,
**Detail** (Read), **+ Tambah** (Create), **Edit** (Update), dan **Hapus** (Delete, dengan konfirmasi).

## Pengujian

`npm test` menjalankan 78 kasus (`node:test`) yang mencakup keempat operasi pada semua 9 tabel:
`tests/create-read.test.js` (tahap 1) dan `tests/update-delete.test.js` (tahap 2).

## Struktur

```
website/    situs statis asli (realityclub.html, style.css, images/)
admin/      panel admin CRUD (HTML/CSS/JS)
database/   schema.sql, seed.sql
src/        db.js, resources.js (definisi tabel), crud.js, validate.js, app.js, server.js
tests/      pengujian otomatis (node:test)
```

## Keamanan

- Seluruh query memakai *prepared statement*; nama tabel/kolom hanya dari whitelist `resources.js`.
- Validasi sisi server untuk setiap kolom; kolom asing diabaikan.
- Panel admin merender data lewat DOM API (bukan `innerHTML`).
- **Belum ada autentikasi** — panel admin & API tulis sebaiknya tidak dibuka ke internet publik sebelum diberi login.
