const resources = require('./resources');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validasi body terhadap definisi tabel.
 * @returns {{values: object, errors: object}}  values hanya berisi kolom yang dikenal.
 */
function validate(db, table, body) {
  const def = resources[table];
  const values = {};
  const errors = {};
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { values, errors: { _: 'Body harus berupa objek JSON' } };
  }

  for (const f of def.fields) {
    let v = body[f.name];
    if (typeof v === 'string') v = v.trim();
    const empty = v === undefined || v === null || v === '';

    if (empty) {
      if (f.default !== undefined) { values[f.name] = f.default; continue; }
      if (f.required) { errors[f.name] = `${f.label} wajib diisi`; continue; }
      values[f.name] = null;
      continue;
    }

    switch (f.type) {
      case 'number': {
        const n = typeof v === 'number' ? v : Number(v);
        if (!Number.isInteger(n)) { errors[f.name] = `${f.label} harus berupa bilangan bulat`; continue; }
        if (f.min !== undefined && n < f.min) { errors[f.name] = `${f.label} minimal ${f.min}`; continue; }
        if (f.max !== undefined && n > f.max) { errors[f.name] = `${f.label} maksimal ${f.max}`; continue; }
        v = n; break;
      }
      case 'select':
        if (!f.options.includes(v)) { errors[f.name] = `${f.label} harus salah satu dari: ${f.options.join(', ')}`; continue; }
        break;
      case 'date': {
        if (typeof v !== 'string' || !DATE_RE.test(v) || Number.isNaN(Date.parse(v))) {
          errors[f.name] = `${f.label} harus berformat YYYY-MM-DD`; continue;
        }
        break;
      }
      case 'email':
        if (typeof v !== 'string' || !EMAIL_RE.test(v)) { errors[f.name] = `${f.label} tidak valid`; continue; }
        break;
      case 'ref': {
        const n = Number(v);
        if (!Number.isInteger(n) || !db.prepare(`SELECT 1 FROM ${f.ref} WHERE id = ?`).get(n)) {
          errors[f.name] = `${f.label} tidak ditemukan`; continue;
        }
        v = n; break;
      }
      default: // text, textarea
        if (typeof v !== 'string') { errors[f.name] = `${f.label} harus berupa teks`; continue; }
    }

    if (typeof v === 'string') {
      if (f.max && v.length > f.max) { errors[f.name] = `${f.label} maksimal ${f.max} karakter`; continue; }
      if (f.pattern && !new RegExp(f.pattern).test(v)) { errors[f.name] = `${f.label} harus ${f.patternHint || 'sesuai format'}`; continue; }
    }
    values[f.name] = v;
  }
  return { values, errors };
}

module.exports = { validate };
