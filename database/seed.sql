-- Data awal: disalin dari konten website Reality Club (script.js + realityclub.html)

INSERT INTO members (name, role, photo, sort_order) VALUES
  ('Faiz', 'Vokal & Gitar', 'images/faiz.jpeg', 1),
  ('Nugi', 'Bass', 'images/nugi.jpeg', 2),
  ('Fathia', 'Vokal, Gitar & Keyboard', 'images/fathia.jpeg', 3),
  ('Era', 'Drum', 'images/era.jpeg', 4);

INSERT INTO releases (title, type, release_year, cover, description) VALUES
  ('Who Knows Where Life Will Take You?', 'Album', 2025, 'images/albumwk.jpeg', NULL),
  ('Reality Club Presents…', 'Album', 2023, 'images/albumrcp.jpeg', NULL),
  ('Anything You Want', 'Single', 2022, 'images/albumayw.jpeg', NULL),
  ('What Do You Really Know?', 'Album', 2019, 'images/albumwdrk.jpeg', NULL),
  ('Never Get Better', 'Album', 2017, 'images/albumngb.jpeg', NULL);

INSERT INTO tracks (release_id, track_number, title, duration, audio_file) VALUES
  (2, 1, 'Am I Bothering You?', '3:45', 'am-i-bothering-you'),
  (3, 1, 'Anything You Want', '3:56', 'anything-you-want'),
  (5, 1, 'Is It the Answer?', '3:50', 'is-it-the-answer'),
  (4, 1, 'A Sorrowfull Reunion', '4:19', 'a-sorrowfull-reunion'),
  (4, 2, '2112', '5:56', '2112');

INSERT INTO tour_dates (date_label, event_date, city, venue, status) VALUES
  ('6 Juni 2026', '2026-06-06', 'Jakarta, Indonesia', '(10) Years of Reality Club · Basketball Hall Senayan', 'done'),
  ('16–18 Oktober 2026', '2026-10-16', 'Jakarta, Indonesia', 'Synchronize Fest · Gambir Expo Kemayoran', 'done'),
  ('13 November 2026', '2026-11-13', 'Kuala Lumpur, Malaysia', 'Zepp Kuala Lumpur', 'next'),
  ('Desember 2026', NULL, 'Pontianak, Indonesia', 'Tanggal dan venue segera diumumkan', 'next');

INSERT INTO gallery_photos (title, image) VALUES
  ('Reality Club tampil langsung', 'images/konser_fimela.jpeg'),
  ('Poster Reality Club', 'images/konser3.jpeg'),
  ('Konser Reality Club', 'images/konser1.jpeg'),
  ('Reality Club Presents', 'images/konser4.jpeg'),
  ('Konser Reality club', 'images/konser2.jpeg'),
  ('Never Get Better', 'images/konser13.jpeg'),
  ('Reality Club', 'images/konser10.jpeg'),
  ('What Do You Really Know?', 'images/konser5.jpeg');

INSERT INTO products (slug, name, price, category, image, description) VALUES
  ('wkwlty', 'WKWLTY Tee', 180000, 'best_seller', 'images/merch_wkwlty.jpeg', 'Kaos putih dengan sablon merah bertuliskan Who Knows Where Life Will Take You?'),
  ('longsleeve', '10 Years Longsleeve', 299000, 'best_seller', 'images/merch_longsleeve.jpeg', 'Longsleeve putih edisi 10 Years of Reality Club dengan ilustrasi pintu merah.'),
  ('cap', 'WKWLTY Camp Cap', 189000, 'best_seller', 'images/merch_cap.jpeg', 'Topi lima panel hitam dengan bordir Who Knows Where Life Will Take You?'),
  ('logotee', 'Reality Club Logo Tee', 180000, 'best_seller', 'images/merch_logotee.jpeg', 'Kaos hitam dengan logo Reality Club abu-abu di bagian dada.'),
  ('shirt', 'Striped Club Shirt', 350000, 'lainnya', 'images/merch_shirt.jpeg', 'Kemeja lengan panjang motif garis dengan tulisan Club merah di dada.'),
  ('ringer', 'Part of the Club Tee', 190000, 'lainnya', 'images/merch_ringer.jpeg', 'Kaos putih ringer dengan kerah dan lengan merah, bertuliskan Part of the Club.'),
  ('finding', 'Finding Tee', 180000, 'lainnya', 'images/merch_finding.jpeg', 'Kaos biru muda dengan desain poster Finding Someone to Love.'),
  ('belt', 'Part of the Club Belt', 249000, 'lainnya', 'images/merch_belt.jpeg', 'Sabuk kulit cokelat dengan gesper logam bergambar Club dan tulisan Reality Club.');

INSERT INTO product_sizes (product_id, size) VALUES
  (1, 'S'),
  (1, 'M'),
  (1, 'L'),
  (1, 'XL'),
  (2, 'S'),
  (2, 'M'),
  (2, 'L'),
  (2, 'XL'),
  (4, 'S'),
  (4, 'M'),
  (4, 'L'),
  (4, 'XL'),
  (5, 'S'),
  (5, 'M'),
  (5, 'L'),
  (5, 'XL'),
  (6, 'S'),
  (6, 'M'),
  (6, 'L'),
  (6, 'XL'),
  (7, 'S'),
  (7, 'M'),
  (7, 'L'),
  (7, 'XL');

INSERT INTO product_images (product_id, image, sort_order) VALUES
  (1, 'images/merch_wkwlty.jpeg', 1),
  (1, 'images/merch_wkwlty_belakang.jpeg', 2),
  (1, 'images/merch_wkwlty_sablon.jpeg', 3),
  (1, 'images/merch_wkwlty_kerah.jpeg', 4),
  (2, 'images/merch_longsleeve.jpeg', 1),
  (2, 'images/merch_longsleeve_d1.jpeg', 2),
  (2, 'images/merch_longsleeve_d2.jpeg', 3),
  (2, 'images/merch_longsleeve_d3.jpeg', 4),
  (3, 'images/merch_cap.jpeg', 1),
  (3, 'images/merch_cap_samping.jpeg', 2),
  (3, 'images/merch_cap_belakang.jpeg', 3),
  (4, 'images/merch_logotee.jpeg', 1),
  (4, 'images/merch_logotee_belakang.jpeg', 2),
  (4, 'images/merch_logotee_sablon.jpeg', 3),
  (4, 'images/merch_logotee_kerah.jpeg', 4),
  (5, 'images/merch_shirt.jpeg', 1),
  (5, 'images/merch_shirt_belakang.jpeg', 2),
  (5, 'images/merch_shirt_sablon.jpeg', 3),
  (5, 'images/merch_shirt_kerah.jpeg', 4),
  (5, 'images/merch_shirt_lengan.jpeg', 5),
  (6, 'images/merch_ringer.jpeg', 1),
  (6, 'images/merch_ringer_sablon.jpeg', 2),
  (6, 'images/merch_ringer_kerah.jpeg', 3),
  (7, 'images/merch_finding.jpeg', 1),
  (7, 'images/merch_finding_sablon.jpeg', 2),
  (7, 'images/merch_finding_kerah.jpeg', 3),
  (8, 'images/merch_belt.jpeg', 1),
  (8, 'images/merch_belt_gulung.jpeg', 2),
  (8, 'images/merch_belt_gesper.jpeg', 3);

INSERT INTO contact_messages (name, email, message) VALUES
  ('Contoh Pengirim', 'contoh@email.com', 'Halo! Ini contoh pesan awal untuk menguji tampilan data.');

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Bagaimana cara booking Reality Club?', 'Kirim email ke booking@realityclub.id atau isi formulir ini. Tim manajemen membalas dalam 1–2 hari kerja.', 1),
  ('Di mana beli merchandise resmi?', 'Website ini hanya menjual item best seller. Untuk stok lainnya, ikuti Instagram Reality Club.', 2),
  ('Bagaimana menghubungi manajemen?', 'Email management@realityclub.id. Untuk media dan press: press@realityclub.id.', 3),
  ('Apakah ada komunitas penggemar?', 'Ada. Gabung Reality Club Fans di Discord dan Telegram. Linknya ada di bio Instagram resmi.', 4);

