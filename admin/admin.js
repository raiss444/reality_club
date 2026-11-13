/* Panel admin Reality Club — menggunakan REST API /api/*.
   Semua data ditampilkan lewat textContent / DOM API (bukan innerHTML)
   sehingga aman dari XSS, terutama untuk tabel contact_messages. */
'use strict';

const PAGE_SIZE = 10;
const state = { meta: null, table: null, q: '', page: 0, total: 0 };
const $ = (s) => document.querySelector(s);

/** Pembuat elemen DOM aman */
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid);
  return el;
}

async function api(path, opts = {}) {
  const res = await fetch('/api/' + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(data?.error || res.statusText), { details: data?.details });
  return data;
}

let toastTimer;
function toast(msg, isError = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show' + (isError ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = 'toast'), 2800);
}

const def = () => state.meta[state.table];
const allColumns = () => [
  ...def().fields.filter((f) => f.list),
  ...(def().readonlyColumns || []).filter((c) => c.list),
];

/* ───────── tampilan nilai sel ───────── */
function renderCell(field, row) {
  const v = row[field.name];
  if (field.type === 'ref') return row[field.name + '__label'] ?? v;
  if (field.image) return v ? h('img', { src: '/' + v, alt: '' }) : '—';
  if (field.type === 'select' && (field.name === 'status')) return h('span', { class: 'badge ' + v }, v);
  if (field.name === 'price' && v !== null) return 'Rp ' + Number(v).toLocaleString('id-ID');
  return v === null || v === undefined || v === '' ? '—' : String(v);
}

/* ───────── READ: daftar ───────── */
async function load() {
  const params = new URLSearchParams({ limit: PAGE_SIZE, offset: state.page * PAGE_SIZE });
  if (state.q) params.set('q', state.q);
  try {
    const { data, total } = await api(`${state.table}?${params}`);
    if (!data.length && state.page > 0) { state.page--; return load(); }
    state.total = total;
    renderTable(data);
    renderPager();
  } catch (e) { toast(e.message, true); }
}

function renderTable(rows) {
  const cols = allColumns();
  const head = h('tr', {}, h('th', {}, 'ID'), cols.map((c) => h('th', {}, c.label)), h('th'));
  const body = rows.length
    ? rows.map((row) => h('tr', {},
        h('td', {}, String(row.id)),
        cols.map((c) => h('td', {}, renderCell(c, row))),
        h('td', {}, h('div', { class: 'row-actions' }, ...rowActions(row)))))
    : [h('tr', {}, h('td', { class: 'empty', colspan: cols.length + 2 }, 'Belum ada data.'))];
  $('#tableWrap').replaceChildren(h('table', {}, h('thead', {}, head), h('tbody', {}, ...body)));
}

function rowActions(row) {
  return [
    h('button', { class: 'btn sm', onclick: () => showDetail(row.id) }, 'Detail'),
    h('button', { class: 'btn sm', onclick: () => openForm({ row }) }, 'Edit'),
    h('button', { class: 'btn sm danger', onclick: () => confirmDelete(row) }, 'Hapus'),
  ];
}

function renderPager() {
  const pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
  $('#pager').replaceChildren(
    h('span', {}, `${state.total} data · halaman ${state.page + 1} / ${pages}`),
    h('div', {},
      h('button', { class: 'btn sm', disabled: state.page === 0, onclick: () => { state.page--; load(); } }, '← Sebelumnya'),
      h('button', { class: 'btn sm', disabled: state.page + 1 >= pages, onclick: () => { state.page++; load(); } }, 'Berikutnya →')));
}

/* ───────── READ: detail satu baris ───────── */
async function showDetail(id) {
  try {
    const row = await api(`${state.table}/${id}`);
    const items = [['ID', String(row.id)]];
    for (const f of def().fields) items.push([f.label, renderCell(f, row)]);
    for (const c of def().readonlyColumns || []) items.push([c.label, String(row[c.name])]);
    openModal(h('div', {},
      h('h2', {}, `Detail ${def().label} #${row.id}`),
      h('dl', {}, items.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
      h('div', { class: 'actions' },
        h('button', { class: 'btn danger', onclick: () => confirmDelete(row) }, 'Hapus'),
        h('button', { class: 'btn', onclick: () => openForm({ row }) }, 'Edit'),
        h('button', { class: 'btn', onclick: closeModal }, 'Tutup'))));
  } catch (e) { toast(e.message, true); }
}

/* ───────── modal ───────── */
function openModal(content) { $('#modalBody').replaceChildren(content); const m = $('#modal'); if (!m.open) m.showModal(); }
function closeModal() { $('#modal').close(); }

/* ───────── formulir (dipakai Create; Update memakainya juga) ───────── */
async function buildInput(f, value) {
  const common = { id: 'f_' + f.name, name: f.name };
  if (f.type === 'textarea') return h('textarea', { ...common, maxlength: f.max }, value ?? '');
  if (f.type === 'select') {
    const sel = h('select', common, h('option', { value: '' }, '— pilih —'),
      f.options.map((o) => h('option', { value: o }, o)));
    sel.value = value ?? f.default ?? '';
    return sel;
  }
  if (f.type === 'ref') {
    const { data } = await api(`${f.ref}?limit=1000`);
    const sel = h('select', common, h('option', { value: '' }, '— pilih —'),
      data.map((r) => h('option', { value: r.id }, `#${r.id} ${r[f.refLabel]}`)));
    sel.value = value ?? '';
    return sel;
  }
  const type = { number: 'number', date: 'date', email: 'email' }[f.type] || 'text';
  const input = h('input', { ...common, type, maxlength: f.max, min: f.min, max: f.type === 'number' ? f.max : undefined, step: f.type === 'number' ? 1 : undefined });
  input.value = value ?? (f.default ?? '');
  return input;
}

async function openForm({ row = null } = {}) {
  const form = h('form', { novalidate: true });
  for (const f of def().fields) {
    const input = await buildInput(f, row ? row[f.name] : undefined);
    form.append(h('div', { class: 'field', 'data-field': f.name },
      h('label', { for: 'f_' + f.name }, f.label, f.required ? h('b', {}, ' *') : null), input,
      h('div', { class: 'err' })));
  }
  const saveBtn = h('button', { class: 'btn primary', type: 'submit' }, 'Simpan');
  form.append(h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'button', onclick: closeModal }, 'Batal'), saveBtn));

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    form.querySelectorAll('.field').forEach((d) => { d.classList.remove('invalid'); d.querySelector('.err').textContent = ''; });
    saveBtn.disabled = true;
    try {
      await submitForm(body, row);
      closeModal();
      await load();
      await refreshCounts();
    } catch (e) {
      for (const [name, msg] of Object.entries(e.details || {})) {
        const d = form.querySelector(`[data-field="${name}"]`);
        if (d) { d.classList.add('invalid'); d.querySelector('.err').textContent = msg; }
      }
      toast(e.message, true);
    } finally { saveBtn.disabled = false; }
  });

  openModal(h('div', {}, h('h2', {}, row ? `Edit ${def().label} #${row.id}` : `Tambah ${def().label}`), form));
}

/** CREATE (POST) atau UPDATE (PUT) tergantung ada tidaknya row */
async function submitForm(body, row) {
  if (row) {
    await api(`${state.table}/${row.id}`, { method: 'PUT', body: JSON.stringify(body) });
    toast('Data berhasil diperbarui');
  } else {
    await api(state.table, { method: 'POST', body: JSON.stringify(body) });
    toast('Data berhasil ditambahkan');
  }
}

/* ───────── DELETE: dialog konfirmasi ───────── */
function confirmDelete(row) {
  const first = def().fields.find((f) => f.type === 'text' || f.type === 'email') || def().fields[0];
  const label = String(row[first.name] ?? '#' + row.id);
  const cascades = (def().cascades || []).map((t) => state.meta[t].label);
  const delBtn = h('button', { class: 'btn danger-solid', onclick: async () => {
    delBtn.disabled = true;
    try {
      await api(`${state.table}/${row.id}`, { method: 'DELETE' });
      closeModal();
      toast('Data berhasil dihapus');
      await load();
      await refreshCounts();
    } catch (e) { toast(e.message, true); delBtn.disabled = false; }
  } }, 'Ya, hapus');
  openModal(h('div', {},
    h('h2', {}, 'Hapus data?'),
    h('p', {}, `${def().label} #${row.id} — “${label}” akan dihapus permanen.`),
    cascades.length ? h('p', { class: 'warn' }, `Perhatian: data terkait di ${cascades.join(', ')} juga ikut terhapus.`) : null,
    h('div', { class: 'actions' }, h('button', { class: 'btn', onclick: closeModal }, 'Batal'), delBtn)));
}

/* ───────── navigasi tabel ───────── */
async function refreshCounts() {
  for (const t of Object.keys(state.meta)) {
    const { total } = await api(`${t}?limit=1`);
    const badge = document.querySelector(`[data-count="${t}"]`);
    if (badge) badge.textContent = total;
  }
}

function selectTable(t) {
  state.table = t; state.q = ''; state.page = 0;
  $('#search').value = '';
  $('#title').textContent = def().label;
  document.querySelectorAll('#tableNav button').forEach((b) => b.classList.toggle('active', b.dataset.table === t));
  load();
}

async function init() {
  state.meta = await api('_meta');
  $('#tableNav').replaceChildren(...Object.entries(state.meta).map(([t, d]) =>
    h('button', { 'data-table': t, onclick: () => selectTable(t) }, h('span', {}, d.label), h('span', { 'data-count': t }, ''))));
  $('#btnAdd').addEventListener('click', () => openForm());
  let timer;
  $('#search').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = e.target.value.trim(); state.page = 0; load(); }, 250);
  });
  selectTable(Object.keys(state.meta)[0]);
  refreshCounts();
}
init().catch((e) => { $('#title').textContent = 'Gagal memuat: ' + e.message; });
