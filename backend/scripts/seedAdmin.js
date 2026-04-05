require('dotenv').config({ path: `${__dirname}/../.env` });
const bcrypt = require('bcryptjs');
const { pool } = require('../db');

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@brightsmile.com';
const ADMIN_PASSWORD = 'BrightSmile2025!';

async function seed() {
  const { rows } = await pool.query('SELECT id FROM users WHERE lower(username) = $1', [
    ADMIN_USERNAME,
  ]);
  if (rows.length) {
    console.log('Admin already exists. Nothing changed');
    await pool.end();
    process.exit(0);
  }

  const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  await pool.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
    [ADMIN_USERNAME, ADMIN_EMAIL, hashedPassword, 'admin']
  );

  console.log('Admin user created successfully.');
  console.log(`   Username: ${ADMIN_USERNAME}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('   Change this password after first login.');
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
