const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = n => 'Rp' + n.toLocaleString('id-ID');
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400) };

const members = [['Faiz', 'Vokal & Gitar', 'faiz'], ['Nugi', 'Bass', 'nugi'], ['Fathia', 'Vokal, Gitar & Keyboard', 'fathia'], ['Era', 'Drum', 'era']];
const discs = [['Who Knows Where Life Will Take You?', 'Album · 2025', 'albumwk'], ['Reality Club Presents…', 'Album · 2023', 'albumrcp'], ['What Do You Really Know?', 'Album · 2019', 'albumwdrk'], ['Never Get Better', 'Album · 2017', 'albumngb']];
/* Jadwal tur: [tanggal, kota, venue, status] status: 'done' = sudah lewat, 'next' = akan datang */
const shows = [
  ['6 Juni 2026', 'Jakarta, Indonesia', '(10) Years of Reality Club · Basketball Hall Senayan', 'done'],
  ['16–18 Oktober 2026', 'Jakarta, Indonesia', 'Synchronize Fest · Gambir Expo Kemayoran', 'done'],
  ['13 November 2026', 'Kuala Lumpur, Malaysia', 'Zepp Kuala Lumpur', 'next'],
  ['Desember 2026', 'Pontianak, Indonesia', 'Tanggal dan venue segera diumumkan', 'next']
];

const photos = [
  ['konser_fimela', 'Reality Club tampil langsung'],
  ['konser3', 'Poster Reality Club'],
  ['konser1', 'Konser Reality Club'],
  ['konser4', 'Reality Club Presents'],
  ['konser2', 'Konser Reality club'],
  ['konser13', 'Never Get Better'],
  ['konser10', 'Reality Club'],
  ['konser5', 'What Do You Really Know?']
];

/* Merchandise baris 1: Best Seller.
   sizes: daftar ukuran; isi null jika produk tanpa ukuran.
   imgs (opsional): foto tambahan untuk thumbnail di halaman detail. Foto pertama = foto utama.
   Contoh: imgs: ['merch_wkwlty', 'merch_wkwlty_belakang']
   Setiap nama harus ada filenya: images/<nama>.jpeg. Tanpa imgs, thumbnail tidak muncul.
   CATATAN: harga di bawah masih contoh, silakan sesuaikan. */
const merch = [
  { id: 'wkwlty',     name: 'WKWLTY Tee',                price: 180000, img: 'merch_wkwlty', imgs: ['merch_wkwlty', 'merch_wkwlty_belakang', 'merch_wkwlty_sablon', 'merch_wkwlty_kerah'],     sizes: ['S', 'M', 'L', 'XL'], desc: 'Kaos putih dengan sablon merah bertuliskan Who Knows Where Life Will Take You?' },
  { id: 'longsleeve', name: '10 Years Longsleeve',       price: 299000, img: 'merch_longsleeve', imgs: ['merch_longsleeve', 'merch_longsleeve_d1', 'merch_longsleeve_d2', 'merch_longsleeve_d3'], sizes: ['S', 'M', 'L', 'XL'], desc: 'Longsleeve putih edisi 10 Years of Reality Club dengan ilustrasi pintu merah.' },
  { id: 'cap',        name: 'WKWLTY Camp Cap',           price: 189000, img: 'merch_cap', imgs: ['merch_cap', 'merch_cap_samping', 'merch_cap_belakang'],        sizes: null,                 desc: 'Topi lima panel hitam dengan bordir Who Knows Where Life Will Take You?' },
  { id: 'logotee',    name: 'Reality Club Logo Tee',     price: 180000, img: 'merch_logotee', imgs: ['merch_logotee', 'merch_logotee_belakang', 'merch_logotee_sablon', 'merch_logotee_kerah'],    sizes: ['S', 'M', 'L', 'XL'], desc: 'Kaos hitam dengan logo Reality Club abu-abu di bagian dada.' }
];

/* Merchandise baris 2: Merch Lainnya (id harus unik) */
const merch2 = [
  { id: 'shirt',   name: 'Striped Club Shirt',       price: 350000, img: 'merch_shirt', imgs: ['merch_shirt', 'merch_shirt_belakang', 'merch_shirt_sablon', 'merch_shirt_kerah', 'merch_shirt_lengan'],   sizes: ['S', 'M', 'L', 'XL'], desc: 'Kemeja lengan panjang motif garis dengan tulisan Club merah di dada.' },
  { id: 'ringer',  name: 'Part of the Club Tee',     price: 190000, img: 'merch_ringer', imgs: ['merch_ringer', 'merch_ringer_sablon', 'merch_ringer_kerah'],  sizes: ['S', 'M', 'L', 'XL'], desc: 'Kaos putih ringer dengan kerah dan lengan merah, bertuliskan Part of the Club.' },
  { id: 'finding', name: 'Finding Tee',              price: 180000, img: 'merch_finding', imgs: ['merch_finding', 'merch_finding_sablon', 'merch_finding_kerah'], sizes: ['S', 'M', 'L', 'XL'], desc: 'Kaos biru muda dengan desain poster Finding Someone to Love.' },
  { id: 'belt',    name: 'Part of the Club Belt',    price: 249000, img: 'merch_belt', imgs: ['merch_belt', 'merch_belt_gulung', 'merch_belt_gesper'],    sizes: null,                 desc: 'Sabuk kulit cokelat dengan gesper logam bergambar Club dan tulisan Reality Club.' }
];
const allMerch = [...merch, ...merch2];

$('#members').innerHTML = members.map(([n, r, i]) => `<li><img src="images/${i}.jpeg" alt="${n}" loading="lazy"${i == 'fathia' ? ' style="object-position:top"' : ''}>${n}<small>${r}</small></li>`).join('');
$('#discs').innerHTML = discs.map(([t, m, i]) => `<article class="card"><div class="th"><span class="ph" aria-hidden="true">♪</span><img src="images/${i}.jpeg" alt="Sampul ${t}" loading="lazy" onerror="this.remove()"></div><h4>${t}</h4><small>${m}</small></article>`).join('');
const firstNext = shows.findIndex(x => x[3] == 'next');
$('#shows').innerHTML = shows.map(([d, c, v, st], i) => `<li class="${st == 'done' ? 'done' : i == firstNext ? 'up' : ''}"><time>${d}</time><div><b>${c}</b><span>${v}</span></div><span class="badge ${st}">${st == 'done' ? 'Selesai' : 'Akan datang'}</span></li>`).join('');
const nc = $('#nextCard');
if (firstNext >= 0) { const [d, c, v] = shows[firstNext]; nc.innerHTML = `<small>Konser berikutnya</small><b>${c}</b><span>${d} · ${v}</span>`; nc.hidden = false }

/* Galeri */
$('#photos').innerHTML = photos.map(([i, a]) => `<button data-src="images/${i}.jpeg"><img src="images/${i}.jpeg" alt="${a}" loading="lazy"></button>`).join('');

/* Merchandise: satu fungsi kartu dipakai untuk kedua baris */
const merchCard = p => `
  <a class="card merch" href="#produk-${p.id}" aria-label="Lihat ${p.name}">
    <div class="th"><img src="images/${p.img}.jpeg" alt="${p.name}" loading="lazy"></div>
    <h4>${p.name}</h4>
    <p class="price">${rp(p.price)}</p>
  </a>`;
$('#merch').innerHTML = merch.map(merchCard).join('');
$('#merch2').innerHTML = merch2.map(merchCard).join('');

/* Muncul bertahap saat di-scroll */
const cards = $$('#shop .merch'), showAll = () => cards.forEach(c => c.classList.add('in'));
if ('IntersectionObserver' in window) {
  const rv = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target) }
  }), { threshold: .01 });
  cards.forEach((c, i) => { c.style.setProperty('--i', i % 4); rv.observe(c) });
  document.documentElement.classList.add('js-ready');
  setTimeout(showAll, 3000);   // cadangan: kartu tidak akan pernah tetap tersembunyi
} else showAll();

/* Menu mobile + nav aktif */
const menu = $('#menu'), bg = $('#burger');
bg.onclick = () => { const o = menu.classList.toggle('open'); bg.setAttribute('aria-expanded', o) };
menu.onclick = e => { if (e.target.tagName == 'A') { menu.classList.remove('open'); bg.setAttribute('aria-expanded', false) } };
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('nav a', menu).forEach(a => a.classList.toggle('on', a.hash == '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' });
$$('main section').forEach(s => io.observe(s));

/* Pemutar musik: memutar file audio langsung di website.
   Taruh file mp3 di folder audio/. Format: [judul, keterangan, nama file tanpa .mp3, nama gambar sampul di images/] */
const songs = [
  ['Am I Bothering You?', 'Reality Club Presents… · 2023', 'am-i-bothering-you', 'albumrcp'],
  ['Anything You Want', 'Anything You W · 2022', 'anything-you-want', 'albumayw'],
  ['Is It the Answer?', 'Never Get Better · 2017', 'is-it-the-answer', 'albumngb'],
  ['A Sorrowfull Reunion', 'What Do You Really Know? · 2019', 'a-sorrowfull-reunion', 'albumwdrk'],
  ['2112', 'What Do You Really Know? · 2019', '2112', 'albumwdrk']
];
$('#songList').innerHTML = songs.map((s, i) => `<li><button data-i="${i}"><span class="n">${i + 1}</span><span class="tt"><b>${s[0]}</b><small>${s[1]}</small></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></button></li>`).join('');

const au = $('#audio'), seek = $('#seek'), pl = $('#player'), cv = $('#coverImg');
let cur = 0, loaded = -1, seeking = false;
const fmt = s => { s = Math.max(0, s | 0); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0') };
cv.onload = () => cv.style.display = ''; cv.onerror = () => cv.style.display = 'none';
function show(i) {
  cur = i; const s = songs[i];
  $('#nowT').textContent = s[0]; $('#nowA').textContent = s[1];
  cv.src = `images/${s[3]}.jpeg`;
  $$('#songList button').forEach(b => b.classList.toggle('on', +b.dataset.i == i));
  seek.value = 0; $('#tm').textContent = '0:00';
}
function prog() {
  const d = isFinite(au.duration) ? au.duration : 0;
  seek.max = d || 100; if (!seeking) seek.value = au.currentTime;
  $('#tm').textContent = fmt(au.currentTime) + (d ? ' / ' + fmt(d) : '');
}
function play(i) {
  if (i == null) i = cur;
  if (i != loaded) { show(i); au.src = `audio/${songs[i][2]}.mp3`; loaded = i; meta(i) }
  au.play().catch(() => { });
}
function meta(i) {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({ title: songs[i][0], artist: 'Reality Club', album: songs[i][1] });
}
const next = () => play((cur + 1) % songs.length);
const prev = () => { if (loaded == cur && au.currentTime > 3) au.currentTime = 0; else play((cur - 1 + songs.length) % songs.length) };
const toggle = () => { if (loaded != cur) return play(cur); au.paused ? au.play().catch(() => { }) : au.pause() };
$('#play').onclick = toggle; $('#next').onclick = next; $('#prev').onclick = prev;
$('#songList').onclick = e => { const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.i; i == cur && loaded == cur ? toggle() : play(i) };
au.onplay = () => pl.classList.add('is-playing');
au.onpause = () => pl.classList.remove('is-playing');
au.onended = next;
au.ontimeupdate = au.onloadedmetadata = prog;
au.onerror = () => { pl.classList.remove('is-playing'); toast('File lagu belum ada. Taruh file mp3 di folder audio/') };
seek.oninput = () => { seeking = true; $('#tm').textContent = fmt(+seek.value) + ' / ' + fmt(+seek.max) };
seek.onchange = () => { au.currentTime = +seek.value; seeking = false };
if ('mediaSession' in navigator) { const ms = navigator.mediaSession; ms.setActionHandler('play', toggle); ms.setActionHandler('pause', toggle); ms.setActionHandler('previoustrack', prev); ms.setActionHandler('nexttrack', next) }
show(0);

/* Video: muat YouTube hanya saat diklik */
$$('.yt').forEach(el => {
  const id = el.dataset.id; el.style.backgroundImage = `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)`;
  el.innerHTML = `<button aria-label="Putar ${el.dataset.t}"><i>▶</i>Putar video</button>`;
  el.onclick = () => {
    if (location.protocol == 'file:') return open('https://www.youtube.com/watch?v=' + id);
    el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" title="${el.dataset.t}" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>`
  }
});

/* Lightbox */
const lb = $('#lb');
$('#photos').onclick = e => { const b = e.target.closest('button'); if (!b) return; $('img', lb).src = b.dataset.src; lb.hidden = false };
lb.onclick = () => lb.hidden = true;

/* Keranjang. Kunci = "idProduk|ukuran", contoh "hoodie|M" */
let cart = {};
try { cart = JSON.parse(sessionStorage.getItem('rc-cart') || '{}') } catch (e) { }
const dr = $('#drawer');
function draw() {
  let tot = 0, n = 0;
  const rows = Object.keys(cart).map(k => {
    const [id, size] = k.split('|'), p = allMerch.find(x => x.id == id);
    if (!p) { delete cart[k]; return ''; }   // buang data keranjang lama yang tidak cocok
    const q = cart[k]; tot += p.price * q; n += q;
    const label = p.name + (size ? ' · ' + size : '');
    return `<li><img src="images/${p.img}.jpeg" alt=""><div>${label}<br><small>${rp(p.price)} × ${q}</small></div><button data-rm="${k}" aria-label="Kurangi ${label}">−</button><button data-up="${k}" aria-label="Tambah ${label}">+</button></li>`;
  }).filter(Boolean);
  $('#cartList').innerHTML = rows.length ? rows.join('') : '<li>Keranjang masih kosong. Pilih merchandise dulu.</li>';
  $('#cartCount').textContent = n; $('#cartTotal').textContent = rp(tot);
  const pc = $('#pdpCount'); if (pc) pc.textContent = n;
  try { sessionStorage.setItem('rc-cart', JSON.stringify(cart)) } catch (e) { }
}
/* Halaman detail produk (overlay). Dibuka lewat link #produk-<id> */
document.body.insertAdjacentHTML('beforeend', `
<div class="pdp" id="pdp" role="dialog" aria-modal="true" aria-label="Detail produk" hidden>
  <div class="pdp-bar">
    <button type="button" class="pdp-back" id="pdpBack">‹ Kembali ke koleksi</button>
    <span class="pdp-logo"><img src="images/logo.png" alt="Reality Club"></span>
    <button type="button" class="cart-btn" id="pdpCart" aria-label="Buka keranjang">Keranjang <b id="pdpCount">0</b></button>
  </div>
  <div class="pdp-in" id="pdpBody"></div>
</div>`);
const pdp = $('#pdp'), pdpBody = $('#pdpBody');
let pdpP = null, fromList = false;

function openPdp(id) {
  const p = allMerch.find(x => x.id == id);
  if (!p) return hidePdp();
  pdpP = p;
  const imgs = (p.imgs && p.imgs.length) ? p.imgs : [p.img];
  pdpBody.innerHTML = `
    <div class="pdp-gal">
      <div class="pdp-main"><img id="pdpImg" src="images/${imgs[0]}.jpeg" alt="${p.name}"></div>
      ${imgs.length > 1 ? `<div class="pdp-thumbs" role="group" aria-label="Foto produk">${imgs.map((m, i) => `<button type="button" class="${i ? '' : 'on'}" data-img="${m}" aria-label="Foto ${i + 1}"><img src="images/${m}.jpeg" alt="" onerror="this.parentNode.remove()"></button>`).join('')}</div>` : ''}
    </div>
    <div class="pdp-info">
      <span class="pdp-badge">Tersedia</span>
      <div class="pdp-row"><h2>${p.name}</h2>
        <button type="button" class="ic-fav" data-fav aria-pressed="false" aria-label="Favorit"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg></button>
      </div>
      <p class="pdp-price">${rp(p.price)}</p>
      ${p.sizes ? `<p class="pdp-label">Ukuran</p><div class="sizes" role="radiogroup" aria-label="Pilih ukuran">${p.sizes.map(z => `<button type="button" class="size" role="radio" aria-checked="false" data-size="${z}">${z}</button>`).join('')}</div>` : ''}
      <p class="pdp-label">Jumlah</p>
      <div class="qty" role="group" aria-label="Jumlah">
        <button type="button" data-q="-1" aria-label="Kurangi jumlah">−</button>
        <span class="q" aria-live="polite">1</span>
        <button type="button" data-q="1" aria-label="Tambah jumlah">+</button>
      </div>
      <button type="button" class="btn pdp-add" data-act="add">Tambah ke keranjang</button>
      <button type="button" class="btn pdp-buy" data-act="buy">Beli sekarang</button>
      <h3>Deskripsi</h3>
      <p class="pdp-desc">${p.desc || ''}</p>
    </div>`;
  pdp.hidden = false; pdp.scrollTop = 0;
  document.documentElement.style.overflow = 'hidden';
  $('#pdpBack').focus({ preventScroll: true });
}
function hidePdp() { pdp.hidden = true; pdpP = null; document.documentElement.style.overflow = '' }
function closePdp() {
  if (pdp.hidden) return;
  if (fromList) { fromList = false; history.back() }          // hashchange yang menyembunyikan
  else { history.replaceState(null, '', '#shop'); hidePdp() }
}
function route(user) {
  const m = location.hash.match(/^#produk-(.+)$/);
  if (m) { if (user) fromList = true; openPdp(decodeURIComponent(m[1])) } else hidePdp();
}
addEventListener('hashchange', () => route(true));
$('#pdpBack').onclick = closePdp;
$('#pdpCart').onclick = () => cartOpen(true);

pdpBody.onclick = e => {
  const t = e.target;
  const th = t.closest('[data-img]');
  if (th) { $('#pdpImg').src = `images/${th.dataset.img}.jpeg`; $$('.pdp-thumbs button').forEach(b => b.classList.toggle('on', b === th)); return }
  if (t.closest('.pdp-main')) { $('img', lb).src = $('#pdpImg').src; lb.hidden = false; return }
  const fav = t.closest('[data-fav]');
  if (fav) { const on = fav.classList.toggle('on'); fav.setAttribute('aria-pressed', on); return toast(on ? 'Ditambah ke favorit' : 'Dihapus dari favorit') }
  const sz = t.closest('.size');
  if (sz) { $$('.size', pdpBody).forEach(b => { const on = b === sz; b.classList.toggle('on', on); b.setAttribute('aria-checked', on) }); return }
  const qb = t.closest('[data-q]');
  if (qb) { const q = $('.q', pdpBody); q.textContent = Math.min(10, Math.max(1, +q.textContent + +qb.dataset.q)); return }
  const act = t.closest('[data-act]'); if (!act || !pdpP) return;
  let size = '';
  if (pdpP.sizes) {
    const on = $('.size.on', pdpBody);
    if (!on) return toast('Pilih ukuran dulu');
    size = on.dataset.size;
  }
  const qEl = $('.q', pdpBody), qty = +qEl.textContent || 1, k = pdpP.id + '|' + size;
  cart[k] = (cart[k] || 0) + qty; draw(); qEl.textContent = 1;
  [$('#cartCount'), $('#pdpCount')].forEach(el => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump') });
  if (act.dataset.act == 'buy') cartOpen(true);
  else toast(pdpP.name + (size ? ' (' + size + ')' : '') + (qty > 1 ? ' ×' + qty : '') + ' masuk keranjang');
};
$('#cartList').onclick = e => { const r = e.target.dataset.rm, u = e.target.dataset.up; if (r != null) { if (--cart[r] < 1) delete cart[r] } else if (u != null) cart[u]++; else return; draw() };
const sc = $('#scrim');
const cartOpen = o => { dr.hidden = sc.hidden = !o; $('#cartBtn').setAttribute('aria-expanded', o); if (o) $('#closeCart').focus() };
$('#cartBtn').onclick = () => cartOpen(true); $('#closeCart').onclick = sc.onclick = () => cartOpen(false);
$('#checkout').onclick = () => toast(Object.keys(cart).length ? 'Checkout segera tersedia' : 'Keranjang masih kosong');
document.onkeydown = e => { if (e.key == 'Escape') { const wasCart = !dr.hidden; cartOpen(false); lb.hidden = true; if (!wasCart && !pdp.hidden) closePdp() } };
draw();

/* Formulir kontak */
$('#form').onsubmit = e => {
  e.preventDefault(); const n = $('#cn').value.trim(), m = $('#ce').value.trim(), t = $('#cm').value.trim(), er = $('#err');
  if (!n || !m || !t) return er.textContent = 'Isi nama, email, dan pesan terlebih dulu.';
  if (!/^\S+@\S+\.\S+$/.test(m)) return er.textContent = 'Format email belum benar, contoh: nama@domain.com.';
  er.textContent = ''; e.target.reset(); toast('Pesan terkirim. Terima kasih, ' + n + '!')
};

addEventListener('scroll', () => $('#nav').classList.toggle('solid', scrollY > 60), { passive: true }); $('#nav').classList.toggle('solid', scrollY > 60);
route(false);