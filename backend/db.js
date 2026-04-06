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
    await client.query(`
      ALTER TABLE testimonials DROP CONSTRAINT IF EXISTS testimonials_status_check;
    `);
    await client.query(`
      ALTER TABLE testimonials ADD CONSTRAINT testimonials_status_check
        CHECK (status IN ('pending', 'approved', 'rejected'));
    `);
    await client.query(`
      ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON gallery_items (sort_order ASC, created_at DESC);
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_cases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500),
        description TEXT,
        category VARCHAR(255),
        before_image_url TEXT NOT NULL,
        after_image_url TEXT,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_gallery_cases_sort ON gallery_cases (sort_order ASC, created_at DESC);
    `);

    const { rows: caseCountRows } = await client.query('SELECT COUNT(*)::int AS c FROM gallery_cases');
    if (caseCountRows[0].c === 0) {
      const { rows: tab } = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'gallery_items'
        ) AS e
      `);
      if (tab[0].e) {
        const { rows: items } = await client.query(
          `SELECT title, description, image_url, category, sort_order, created_at
           FROM gallery_items ORDER BY sort_order ASC, created_at ASC`
        );
        for (let i = 0; i < items.length; i += 2) {
          const a = items[i];
          const b = items[i + 1];
          const before = a?.image_url;
          if (!before) continue;
          const after = b?.image_url || null;
          await client.query(
            `INSERT INTO gallery_cases (title, description, category, before_image_url, after_image_url, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              a.title || (b && b.title) || null,
              [a.description, b?.description].filter(Boolean).join('\n\n') || null,
              a.category || b?.category || null,
              before,
              after,
              Math.floor(i / 2),
            ]
          );
        }
      }
    }
  } finally {
    client.release();
  }
}

module.exports = { pool, ensureSchema };
