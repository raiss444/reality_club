const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = n => 'Rp' + n.toLocaleString('id-ID');
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400) };

/* ============================================================
   DATA DARI DATABASE (lewat REST API backend CRUD)
   Pemetaan:  members -> #members      releases -> #discs
              tracks (+releases) -> #songList   tour_dates -> #shows
              gallery_photos -> #photos         products (+product_sizes, product_images) -> #merch, #merch2
              faqs -> #faqs                     contact_messages <- formulir kontak (POST)
   ============================================================ */
const API = '/api';
async function getAll(table) {
  const r = await fetch(`${API}/${table}?limit=1000`);
  if (!r.ok) throw new Error(`GET /api/${table} -> ${r.status}`);
  return (await r.json()).data;
}

let members = [], discs = [], shows = [], photos = [], songs = [], merch = [], merch2 = [], allMerch = [], faqs = [];

async function loadData() {
  const [mb, rl, tr, td, gp, pr, ps, pi, fq] = await Promise.all(
    ['members', 'releases', 'tracks', 'tour_dates', 'gallery_photos', 'products', 'product_sizes', 'product_images', 'faqs'].map(getAll)
  );

  members = mb.map(m => ({ name: m.name, role: m.role, photo: m.photo }));
  discs = rl.map(r => ({ title: r.title, meta: `${r.type} · ${r.release_year}`, cover: r.cover }));
  shows = td.map(t => [t.date_label, t.city, t.venue, t.status]);
  photos = gp.map(g => ({ src: g.image, alt: g.title }));
  faqs = fq;

  const rel = Object.fromEntries(rl.map(r => [r.id, r]));
  songs = tr.filter(t => t.audio_file).map(t => {
    const r = rel[t.release_id] || {};
    return [t.title, `${r.title || ''} · ${r.release_year || ''}`, t.audio_file, r.cover || ''];
  });

  allMerch = pr.map(p => {
    const sizes = ps.filter(z => z.product_id == p.id).map(z => z.size);
    const imgs = pi.filter(m => m.product_id == p.id).sort((a, b) => a.sort_order - b.sort_order || a.id - b.id).map(m => m.image);
    return { id: p.slug, name: p.name, price: p.price, img: p.image, imgs: imgs.length ? imgs : [p.image], sizes: sizes.length ? sizes : null, desc: p.description || '', category: p.category };
  });
  merch = allMerch.filter(p => p.category == 'best_seller');
  merch2 = allMerch.filter(p => p.category != 'best_seller');
}

/* Escape teks dari database sebelum masuk innerHTML */
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function main() {
try { await loadData() } catch (e) { console.error(e); toast('Data belum bisa dimuat dari server. Jalankan: npm start, lalu buka http://localhost:3000') }

$('#members').innerHTML = members.map(m => `<li><img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy"${/fathia/.test(m.photo) ? ' style="object-position:top"' : ''}>${esc(m.name)}<small>${esc(m.role)}</small></li>`).join('');
$('#discs').innerHTML = discs.map(d => `<article class="card"><div class="th"><span class="ph" aria-hidden="true">♪</span><img src="${esc(d.cover)}" alt="Sampul ${esc(d.title)}" loading="lazy" onerror="this.remove()"></div><h4>${esc(d.title)}</h4><small>${esc(d.meta)}</small></article>`).join('');
const firstNext = shows.findIndex(x => x[3] == 'next');
$('#shows').innerHTML = shows.map(([d, c, v, st], i) => `<li class="${st == 'done' ? 'done' : i == firstNext ? 'up' : ''}"><time>${esc(d)}</time><div><b>${esc(c)}</b><span>${esc(v)}</span></div><span class="badge ${st}">${st == 'done' ? 'Selesai' : 'Akan datang'}</span></li>`).join('');
const nc = $('#nextCard');
if (firstNext >= 0) { const [d, c, v] = shows[firstNext]; nc.innerHTML = `<small>Konser berikutnya</small><b>${esc(c)}</b><span>${esc(d)} · ${esc(v)}</span>`; nc.hidden = false }

/* Galeri */
$('#photos').innerHTML = photos.map(p => `<button data-src="${esc(p.src)}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy"></button>`).join('');

/* FAQ dari tabel faqs (isi HTML statis dipertahankan bila tabel kosong / server mati) */
if (faqs.length) $('#faqs').innerHTML = faqs.map(f => `<details><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join('');

/* Merchandise: satu fungsi kartu dipakai untuk kedua baris */
const merchCard = p => `
  <a class="card merch" href="#produk-${esc(p.id)}" aria-label="Lihat ${esc(p.name)}">
    <div class="th"><img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy"></div>
    <h4>${esc(p.name)}</h4>
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
$('#songList').innerHTML = songs.map((s, i) => `<li><button data-i="${i}"><span class="n">${i + 1}</span><span class="tt"><b>${esc(s[0])}</b><small>${esc(s[1])}</small></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></button></li>`).join('');

const au = $('#audio'), seek = $('#seek'), pl = $('#player'), cv = $('#coverImg');
let cur = 0, loaded = -1, seeking = false;
const fmt = s => { s = Math.max(0, s | 0); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0') };
cv.onload = () => cv.style.display = ''; cv.onerror = () => cv.style.display = 'none';
function show(i) {
  cur = i; const s = songs[i];
  $('#nowT').textContent = s[0]; $('#nowA').textContent = s[1];
  cv.src = s[3];
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
if (songs.length) show(0);

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
    return `<li><img src="${esc(p.img)}" alt=""><div>${esc(label)}<br><small>${rp(p.price)} × ${q}</small></div><button data-rm="${k}" aria-label="Kurangi ${label}">−</button><button data-up="${k}" aria-label="Tambah ${label}">+</button></li>`;
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
      <div class="pdp-main"><img id="pdpImg" src="${esc(imgs[0])}" alt="${esc(p.name)}"></div>
      ${imgs.length > 1 ? `<div class="pdp-thumbs" role="group" aria-label="Foto produk">${imgs.map((m, i) => `<button type="button" class="${i ? '' : 'on'}" data-img="${esc(m)}" aria-label="Foto ${i + 1}"><img src="${esc(m)}" alt="" onerror="this.parentNode.remove()"></button>`).join('')}</div>` : ''}
    </div>
    <div class="pdp-info">
      <span class="pdp-badge">Tersedia</span>
      <div class="pdp-row"><h2>${esc(p.name)}</h2>
        <button type="button" class="ic-fav" data-fav aria-pressed="false" aria-label="Favorit"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg></button>
      </div>
      <p class="pdp-price">${rp(p.price)}</p>
      ${p.sizes ? `<p class="pdp-label">Ukuran</p><div class="sizes" role="radiogroup" aria-label="Pilih ukuran">${p.sizes.map(z => `<button type="button" class="size" role="radio" aria-checked="false" data-size="${esc(z)}">${esc(z)}</button>`).join('')}</div>` : ''}
      <p class="pdp-label">Jumlah</p>
      <div class="qty" role="group" aria-label="Jumlah">
        <button type="button" data-q="-1" aria-label="Kurangi jumlah">−</button>
        <span class="q" aria-live="polite">1</span>
        <button type="button" data-q="1" aria-label="Tambah jumlah">+</button>
      </div>
      <button type="button" class="btn pdp-add" data-act="add">Tambah ke keranjang</button>
      <button type="button" class="btn pdp-buy" data-act="buy">Beli sekarang</button>
      <h3>Deskripsi</h3>
      <p class="pdp-desc">${esc(p.desc)}</p>
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
  if (th) { $('#pdpImg').src = th.dataset.img; $$('.pdp-thumbs button').forEach(b => b.classList.toggle('on', b === th)); return }
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

/* Formulir kontak -> disimpan ke tabel contact_messages (POST /api/contact_messages) */
$('#form').onsubmit = async e => {
  e.preventDefault(); const f = e.target, n = $('#cn').value.trim(), m = $('#ce').value.trim(), t = $('#cm').value.trim(), er = $('#err');
  if (!n || !m || !t) return er.textContent = 'Isi nama, email, dan pesan terlebih dulu.';
  if (!/^\S+@\S+\.\S+$/.test(m)) return er.textContent = 'Format email belum benar, contoh: nama@domain.com.';
  er.textContent = '';
  try {
    const r = await fetch(`${API}/contact_messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: n, email: m, message: t }) });
    if (!r.ok) { const j = await r.json().catch(() => ({})); return er.textContent = j.error || 'Pesan gagal dikirim, coba lagi.' }
    f.reset(); toast('Pesan terkirim. Terima kasih, ' + n + '!');
  } catch (x) { er.textContent = 'Tidak bisa terhubung ke server. Pastikan backend berjalan (npm start).' }
};

addEventListener('scroll', () => $('#nav').classList.toggle('solid', scrollY > 60), { passive: true }); $('#nav').classList.toggle('solid', scrollY > 60);
route(false);
}
main();
