/** Lapisan akses data generik berbasis definisi di resources.js */
const resources = require('./resources');

const columnsOf = (def) => ['id', ...def.fields.map((f) => f.name), ...(def.readonlyColumns || []).map((c) => c.name)];

/** SELECT dasar + subquery label untuk kolom relasi (FK) agar tampil ramah. */
function baseSelect(table) {
  const def = resources[table];
  const refs = def.fields
    .filter((f) => f.type === 'ref')
    .map((f) => `(SELECT ${f.refLabel} FROM ${f.ref} WHERE ${f.ref}.id = t.${f.name}) AS ${f.name}__label`);
  return `SELECT t.*${refs.length ? ', ' + refs.join(', ') : ''} FROM ${table} t`;
}

/** READ: daftar data dengan pencarian (q) dan pagination (limit/offset). */
function list(db, table, { q = '', limit = 50, offset = 0 } = {}) {
  const def = resources[table];
  limit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 1000);
  offset = Math.max(parseInt(offset, 10) || 0, 0);
  let where = '';
  const params = [];
  if (q && def.searchable?.length) {
    where = ' WHERE ' + def.searchable.map((c) => `t.${c} LIKE ? ESCAPE '\\'`).join(' OR ');
    const like = `%${String(q).replace(/[\\%_]/g, (m) => '\\' + m)}%`;
    def.searchable.forEach(() => params.push(like));
  }
  const total = db.prepare(`SELECT COUNT(*) AS c FROM ${table} t${where}`).get(...params).c;
  const data = db
    .prepare(`${baseSelect(table)}${where} ORDER BY ${def.orderBy} LIMIT ? OFFSET ?`)
    .all(...params, limit, offset);
  return { data, total, limit, offset };
}

/** READ: satu baris berdasarkan id. */
function get(db, table, id) {
  return db.prepare(`${baseSelect(table)} WHERE t.id = ?`).get(id) || null;
}

/** CREATE: sisipkan satu baris, kembalikan baris yang baru dibuat. */
function create(db, table, values) {
  const cols = Object.keys(values);
  const info = db
    .prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
    .run(...cols.map((c) => values[c]));
  return get(db, table, Number(info.lastInsertRowid));
}

module.exports = { columnsOf, list, get, create };
