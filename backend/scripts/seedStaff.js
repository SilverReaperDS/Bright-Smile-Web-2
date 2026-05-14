require('dotenv').config({ path: `${__dirname}/../.env` });
const bcrypt = require('bcryptjs');
const { pool } = require('../db');

const STAFF_USERNAME = 'staff1';
const STAFF_EMAIL = 'staff1@brightsmile.com';
const STAFF_PHONE = '000-000-0000';
const STAFF_PASSWORD = 'staffSTAFF123@';

const resetPassword = process.argv.includes('--reset-password');

async function seed() {
  const { rows } = await pool.query('SELECT id FROM users WHERE lower(username) = $1', [
    STAFF_USERNAME.toLowerCase(),
  ]);

  if (rows.length) {
    if (resetPassword) {
      const hashedPassword = bcrypt.hashSync(STAFF_PASSWORD, 10);
      await pool.query(
        `UPDATE users SET password_hash = $1, email = $2, phone = $3, role = 'staff' WHERE lower(username) = $4`,
        [hashedPassword, STAFF_EMAIL, STAFF_PHONE, STAFF_USERNAME.toLowerCase()]
      );
      console.log('Staff password reset successfully.');
      console.log(`   Username: ${STAFF_USERNAME}`);
      console.log(`   Password: ${STAFF_PASSWORD}`);
      await pool.end();
      process.exit(0);
    }
    console.log('Staff user already exists. Nothing changed.');
    console.log('   To set the password to the value in this script, run: npm run seed:staff:reset');
    await pool.end();
    process.exit(0);
  }

  const hashedPassword = bcrypt.hashSync(STAFF_PASSWORD, 10);
  await pool.query(
    `INSERT INTO users (username, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)`,
    [STAFF_USERNAME, STAFF_EMAIL, STAFF_PHONE, hashedPassword, 'staff']
  );

  console.log('Staff user created successfully.');
  console.log(`   Username: ${STAFF_USERNAME}`);
  console.log(`   Password: ${STAFF_PASSWORD}`);
  console.log('   Change this password after first login.');
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
