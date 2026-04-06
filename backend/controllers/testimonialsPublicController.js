const { pool } = require('../db');

function rowToPublic(row) {
  const rating = row.rating != null ? Math.min(5, Math.max(1, Number(row.rating))) : 5;
  const created = row.created_at ? new Date(row.created_at) : new Date();
  return {
    id: row.id,
    name: row.author_name?.trim() || 'Patient',
    rating,
    text: row.text,
    date: created.toISOString().slice(0, 10),
  };
}

async function getPublicTestimonials(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, author_name, text, rating, created_at
       FROM testimonials
       WHERE status = 'approved'
       ORDER BY created_at DESC`
    );
    res.json(rows.map(rowToPublic));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
}

module.exports = { getPublicTestimonials };
