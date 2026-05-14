const { pool } = require('../db');

async function logUserActivity(userId, action, details = '') {
  try {
    await pool.query(
      `INSERT INTO user_activity_logs (actor_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [userId || null, userId || null, action, details]
    );
  } catch (err) {
    console.error('Failed to log user activity:', err.message);
  }
}

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

// GET /api/my/testimonials — all testimonials submitted by the current user (any status).
async function getMyTestimonials(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, author_name, text, rating, status, created_at
       FROM testimonials
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows.map(rowToDto));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load your testimonials' });
  }
}

// POST /api/my/testimonials — create a new pending testimonial.
async function createMyTestimonial(req, res) {
  const text = String(req.body?.text ?? '').trim();
  const ratingNum = parseInt(String(req.body?.rating ?? ''), 10);
  const authorNameRaw = typeof req.body?.authorName === 'string' ? req.body.authorName.trim() : '';

  if (!text) {
    return res.status(400).json({ error: 'Testimonial text is required' });
  }
  if (text.length < 10) {
    return res.status(400).json({ error: 'Testimonial must be at least 10 characters' });
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: 'Testimonial must be at most 2000 characters' });
  }
  if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    // Prevent duplicate pending submissions — allow only one pending-or-approved live entry per user.
    const existing = await pool.query(
      `SELECT id, status FROM testimonials
       WHERE user_id = $1 AND status IN ('pending','approved')
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );
    if (existing.rows.length) {
      const st = existing.rows[0].status;
      const msg = st === 'approved'
        ? 'You already have an approved testimonial. Delete it to submit a new one.'
        : 'You already have a testimonial awaiting review.';
      return res.status(409).json({ error: msg });
    }

    // Resolve author name fallback from users table if not provided.
    let authorName = authorNameRaw;
    if (!authorName) {
      const u = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.id]);
      authorName = (u.rows[0]?.username || 'Patient').trim();
    }

    const { rows } = await pool.query(
      `INSERT INTO testimonials (user_id, author_name, text, rating, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, user_id, author_name, text, rating, status, created_at`,
      [req.user.id, authorName, text, ratingNum]
    );
    await logUserActivity(
      req.user.id,
      'testimonial_submitted',
      `Submitted testimonial with rating ${ratingNum}`
    );
    res.status(201).json(rowToDto(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
}

// DELETE /api/my/testimonials/:id — delete only if it belongs to the current user.
async function deleteMyTestimonial(req, res) {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM testimonials WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
}

module.exports = { getMyTestimonials, createMyTestimonial, deleteMyTestimonial };
