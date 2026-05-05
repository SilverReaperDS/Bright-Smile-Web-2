const { pool } = require('../db');

async function getOverviewStats(req, res) {
  try {
    const [users, appointments, testimonialsPending, messagesUnread, recentAppointments, recentThreads, pendingTestimonials] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM users'),
      pool.query('SELECT COUNT(*)::int AS c FROM appointments'),
      pool.query(`SELECT COUNT(*)::int AS c FROM testimonials WHERE status = 'pending'`),
      pool.query(
        `SELECT COUNT(*)::int AS c FROM messages WHERE sender_role = 'patient' AND NOT read_by_admin`
      ),
      pool.query(
        `SELECT a.id, a.appointment_date, a.status, a.created_at, u.username AS patient_username
         FROM appointments a
         LEFT JOIN users u ON u.id = a.user_id
         ORDER BY a.appointment_date ASC
         LIMIT 6`
      ),
      pool.query(
        `SELECT
           m.thread_id,
           MAX(m.created_at) AS last_at,
           (SELECT name FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at ASC LIMIT 1) AS name,
           (SELECT email FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at ASC LIMIT 1) AS email,
           (SELECT message FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at DESC LIMIT 1) AS last_preview,
           COUNT(*) FILTER (WHERE m.sender_role = 'patient' AND NOT m.read_by_admin)::int AS unread_count
         FROM messages m
         GROUP BY m.thread_id
         ORDER BY last_at DESC
         LIMIT 6`
      ),
      pool.query(
        `SELECT id, author_name, text, rating, created_at
         FROM testimonials
         WHERE status = 'pending'
         ORDER BY created_at DESC
         LIMIT 6`
      ),
    ]);

    res.json({
      users: users.rows[0].c,
      appointments: appointments.rows[0].c,
      testimonialsPending: testimonialsPending.rows[0].c,
      messagesUnread: messagesUnread.rows[0].c,
      recentAppointments: recentAppointments.rows.map((r) => ({
        id: r.id,
        appointmentDate: r.appointment_date,
        status: r.status,
        createdAt: r.created_at,
        patientName: r.patient_username || 'Unknown',
      })),
      recentUnreadThreads: recentThreads.rows
        .filter((r) => Number(r.unread_count) > 0)
        .map((r) => ({
          threadId: r.thread_id,
          lastAt: r.last_at,
          name: r.name || null,
          email: r.email || null,
          lastPreview: r.last_preview || '',
          unreadCount: r.unread_count,
        })),
      pendingTestimonials: pendingTestimonials.rows.map((r) => ({
        id: r.id,
        authorName: r.author_name || 'Patient',
        text: r.text,
        rating: r.rating,
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

module.exports = { getOverviewStats };
