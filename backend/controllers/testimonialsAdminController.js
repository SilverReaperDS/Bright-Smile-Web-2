const { pool } = require('../db');

function rowToDto(row) {
  return {
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name,
    text: row.text,
    rating: row.rating,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function listTestimonials(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, author_name, text, rating, status, created_at
       FROM testimonials
       ORDER BY created_at DESC`
    );
    res.json(rows.map(rowToDto));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
}

async function updateTestimonial(req, res) {
  const { status, text, rating, authorName } = req.body || {};
  const sets = [];
  const values = [];
  let n = 1;

  if (status !== undefined) {
    if (!['pending', 'approved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    sets.push(`status = $${n++}`);
    values.push(status);
  }
  if (text !== undefined) {
    sets.push(`text = $${n++}`);
    values.push(text);
  }
  if (rating !== undefined) {
    sets.push(`rating = $${n++}`);
    values.push(rating);
  }
  if (authorName !== undefined) {
    sets.push(`author_name = $${n++}`);
    values.push(authorName);
  }

  if (!sets.length) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(req.params.id);

  try {
    const { rows } = await pool.query(
      `UPDATE testimonials SET ${sets.join(', ')}
       WHERE id = $${n}
       RETURNING id, user_id, author_name, text, rating, status, created_at`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rowToDto(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Update failed' });
  }
}

module.exports = { listTestimonials, updateTestimonial };
