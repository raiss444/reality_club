-- Data awal: disalin dari konten website realityclub.html

INSERT INTO members (name, role, photo, sort_order) VALUES
  ('Faiz',   'Vocal',  'images/faiz.jpeg',   1),
  ('Nugi',   'Guitar', 'images/nugi.jpeg',   2),
  ('Fathia', 'Bass',   'images/fathia.jpeg', 3),
  ('Era',    'Drums',  'images/era.jpeg',    4);

INSERT INTO releases (title, type, release_year, cover, description) VALUES
  ('Reality Club',             'EP',     2018, NULL,                        NULL),
  ('Never Get Better',         'Album',  2020, 'images/albumngb.jpeg',      NULL),
  ('Yours Ever',               'EP',     2021, NULL,                        NULL),
  ('What Do You Really Know?', 'Album',  2022, 'images/album wdrk.jpeg',    'Album kedua Reality Club — 11 lagu tentang keraguan, harapan, dan kota.'),
  ('Reality Club Presents',    'Album',  2023, 'images/albumrcp.jpeg',      NULL),
  ('Is It the Answer?',        'Single', 2024, 'images/albumita.jpeg',      'Indie urban romance dari Jakarta untuk kota-kota yang belum tidur.');

INSERT INTO tracks (release_id, track_number, title, duration) VALUES
  (6, 1, 'Is It the Answer?',   '3:45'),
  (6, 2, 'All I Want',          '3:20'),
  (6, 3, 'Tell Me I''m Wrong',  '3:52'),
  (6, 4, 'Am I Bothering You?', '3:41'),
  (6, 5, 'Someday',             '4:02');

INSERT INTO tour_dates (event_date, city, venue, status) VALUES
  ('2024-05-25', 'Jakarta',    'JIExpo Kemayoran',  'on_sale'),
  ('2024-06-08', 'Bandung',    'The Hallway Space', 'on_sale'),
  ('2024-06-21', 'Yogyakarta', 'Jogja Expo Center', 'on_sale'),
  ('2024-07-13', 'Surabaya',   'Jatim Expo',        'on_sale'),
  ('2024-07-27', 'Bali',       'Atlas Beach Club',  'sold_out');

INSERT INTO gallery_photos (title, image) VALUES
  ('Reality Club Live',                'images/konser_fimela.jpeg'),
  ('Faiz - Reality Club',              'images/faiz.jpeg'),
  ('Nugi - Reality Club',              'images/nugi.jpeg'),
  ('Era - Reality Club',               'images/era.jpeg'),
  ('What Do You Really Know? Album',   'images/album wdrk.jpeg'),
  ('Reality Club Album',               'images/albumrcp.jpeg'),
  ('Never Get Better Album',           'images/albumngb.jpeg'),
  ('Reality Club Band',                'images/band_poster.jpeg');

INSERT INTO videos (title, youtube_id, category, description) VALUES
  ('Is It the Answer? (Official Video)', '-CuOwVTgpso', 'music_video', 'Reality Club · 2024'),
  ('We The Fest 2023',                   '6lyh0x2p3YY', 'live',        'Live Performance'),
  ('Synchronize Fest 2022',              '3PhYZZ-4_qk', 'live',        'Live Performance'),
  ('Joyland Festival 2023',              '0BiEHHdA22w', 'live',        'Live Performance');

INSERT INTO products (name, price, image, stock) VALUES
  ('Reality Club Hoodie',    450000, 'images/merch_hoodie.jpeg',     25),
  ('Reality Club Hat',       189000, 'images/merch_hat.jpeg',        40),
  ('Official T-Shirt',       180000, 'images/merch_tshirt.jpeg',     60),
  ('Longsleeve Tracklist',   299000, 'images/merch_longsleeve.jpeg', 30);

INSERT INTO contact_messages (name, email, message) VALUES
  ('Contoh Pengirim', 'contoh@email.com', 'Halo! Ini contoh pesan awal untuk menguji tampilan data.');

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('How can I book Reality Club for an event?',
   'Kirim email ke booking@realityclub.id atau isi form Contact Us. Tim manajemen kami akan menghubungi Anda dalam 1–2 hari kerja.', 1),
  ('Where can I buy the official merchandise?',
   'Merchandise di website ini hanya untuk item Best Seller. Untuk item lainnya ikuti Instagram Reality Club untuk update stok terbaru.', 2),
  ('How to contact the management?',
   'Hubungi manajemen melalui email management@realityclub.id. Untuk keperluan media dan press, gunakan press@realityclub.id.', 3),
  ('Do you have a fan community?',
   'Ya! Bergabunglah dengan komunitas Reality Club Fans di Discord dan Telegram. Link tersedia di bio Instagram official.', 4);
