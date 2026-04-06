const { pool } = require('../db');

async function getOverviewStats(req, res) {
  try {
    const [users, appointments, testimonialsPending, messagesUnread] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM users'),
      pool.query('SELECT COUNT(*)::int AS c FROM appointments'),
      pool.query(`SELECT COUNT(*)::int AS c FROM testimonials WHERE status = 'pending'`),
      pool.query(
        `SELECT COUNT(*)::int AS c FROM messages WHERE sender_role = 'patient' AND NOT read_by_admin`
      ),
    ]);

    res.json({
      users: users.rows[0].c,
      appointments: appointments.rows[0].c,
      testimonialsPending: testimonialsPending.rows[0].c,
      messagesUnread: messagesUnread.rows[0].c,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

module.exports = { getOverviewStats };
