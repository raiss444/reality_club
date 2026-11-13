const { openDb } = require('./db');
const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
const app = createApp(openDb());
app.listen(PORT, () => {
  console.log(`Reality Club berjalan di  http://localhost:${PORT}`);
  console.log(`Panel admin (CRUD)       http://localhost:${PORT}/admin/`);
});
