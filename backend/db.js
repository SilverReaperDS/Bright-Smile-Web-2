const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});

async function ensureSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE appointments
      ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES users (id) ON DELETE SET NULL;
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_assigned_staff ON appointments (assigned_staff_id);
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    `);
    await client.query(`
      UPDATE users SET phone = '' WHERE phone IS NULL;
    `);
    await client.query(`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    `);
    await client.query(`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS thread_id UUID;
    `);
    await client.query(`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users (id) ON DELETE SET NULL;
    `);
    await client.query(`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_role VARCHAR(20) DEFAULT 'patient';
    `);
    await client.query(`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_by_admin BOOLEAN DEFAULT false;
    `);
    await client.query(`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_by_patient BOOLEAN DEFAULT true;
    `);
    await client.query(`
      UPDATE messages SET thread_id = gen_random_uuid() WHERE thread_id IS NULL;
    `);
    await client.query(`
      UPDATE messages SET sender_role = 'patient' WHERE sender_role IS NULL;
    `);
    await client.query(`
      UPDATE messages SET read_by_admin = COALESCE(read, false) WHERE read_by_admin IS NULL;
    `);
    await client.query(`
      UPDATE messages SET read_by_patient = true WHERE read_by_patient IS NULL;
    `);
    await client.query(`
      ALTER TABLE messages ALTER COLUMN thread_id SET NOT NULL;
    `);
    await client.query(`
      ALTER TABLE messages ALTER COLUMN sender_role SET NOT NULL;
    `);
    await client.query(`
      ALTER TABLE messages ALTER COLUMN read_by_admin SET NOT NULL;
    `);
    await client.query(`
      ALTER TABLE messages ALTER COLUMN read_by_patient SET NOT NULL;
    `);
    await client.query(`
      UPDATE messages SET read = read_by_admin;
    `);
  } finally {
    client.release();
  }
}

module.exports = { pool, ensureSchema };
