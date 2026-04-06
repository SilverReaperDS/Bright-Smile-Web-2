require('dotenv').config({ path: `${__dirname}/../.env` });
const bcrypt = require('bcryptjs');
const { pool } = require('../db');

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@brightsmile.com';
const ADMIN_PASSWORD = 'adminADMIN123@';

const resetPassword = process.argv.includes('--reset-password');

async function seed() {
  const { rows } = await pool.query('SELECT id FROM users WHERE lower(username) = $1', [
    ADMIN_USERNAME,
  ]);

  if (rows.length) {
    if (resetPassword) {
      const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
      await pool.query(
        `UPDATE users SET password_hash = $1, role = 'admin' WHERE lower(username) = $2`,
        [hashedPassword, ADMIN_USERNAME]
      );
      console.log('Admin password reset successfully.');
      console.log(`   Username: ${ADMIN_USERNAME}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      await pool.end();
      process.exit(0);
    }
    console.log('Admin already exists. Nothing changed.');
    console.log('   To set the password to the value in this script, run: npm run seed:admin:reset');
    await pool.end();
    process.exit(0);
  }

  const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  await pool.query(
    `INSERT INTO users (username, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)`,
    [ADMIN_USERNAME, ADMIN_EMAIL, '000-000-0000', hashedPassword, 'admin']
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
