const { pool } = require('../db');
const { rowToMessage, messageSelect } = require('./messageShared');
const { emitMessageEvent } = require('../utils/realtime');

async function assertThreadOwnedByUser(threadId, userId) {
  const { rows } = await pool.query(
    'SELECT 1 FROM messages WHERE thread_id = $1 AND user_id = $2 LIMIT 1',
    [threadId, userId]
  );
  return rows.length > 0;
}

async function getMyThreads(req, res) {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        m.thread_id,
        MAX(m.created_at) AS last_at,
        (SELECT message FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at DESC LIMIT 1) AS last_preview,
        (SELECT sender_role FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at DESC LIMIT 1) AS last_sender_role,
        COUNT(*) FILTER (WHERE m.sender_role = 'admin' AND NOT m.read_by_patient)::int AS unread_count
      FROM messages m
      WHERE m.user_id = $1
      GROUP BY m.thread_id
      ORDER BY last_at DESC
      `,
      [req.user.id]
    );
    res.json(
      rows.map((r) => ({
        threadId: r.thread_id,
        lastAt: r.last_at,
        lastPreview: r.last_preview,
        lastSenderRole: r.last_sender_role,
        unreadCount: r.unread_count,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
}

async function getMyThreadMessages(req, res) {
  const { threadId } = req.params;
  try {
    const ok = await assertThreadOwnedByUser(threadId, req.user.id);
    if (!ok) return res.status(404).json({ error: 'Conversation not found' });

    await pool.query(
      `UPDATE messages SET read_by_patient = true
       WHERE thread_id = $1 AND sender_role = 'admin'`,
      [threadId]
    );

    const { rows } = await pool.query(
      `SELECT ${messageSelect} FROM messages WHERE thread_id = $1 ORDER BY created_at ASC`,
      [threadId]
    );
    res.json(rows.map(rowToMessage));
  } catch (err) {
    if (err.code === '22P02') return res.status(400).json({ error: 'Invalid conversation id' });
    console.error(err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
}

async function postMyThreadReply(req, res) {
  const { threadId } = req.params;
  const text = String(req.body?.message ?? '').trim();
  if (!text) return res.status(400).json({ error: 'Message is required' });

  try {
    const ok = await assertThreadOwnedByUser(threadId, req.user.id);
    if (!ok) return res.status(404).json({ error: 'Conversation not found' });

    const { rows: first } = await pool.query(
      `SELECT name, email, phone FROM messages WHERE thread_id = $1 ORDER BY created_at ASC LIMIT 1`,
      [threadId]
    );
    const { rows: userRows } = await pool.query(
      'SELECT username, email, phone FROM users WHERE id = $1',
      [req.user.id]
    );
    const u = userRows[0] || {};
    const name = (first[0]?.name || u.username || 'Patient').trim();
    const email = (first[0]?.email || u.email || '').trim();
    const phone = first[0]?.phone || u.phone || '';

    const { rows } = await pool.query(
      `INSERT INTO messages (thread_id, user_id, name, email, phone, message, sender_role, read_by_admin, read_by_patient, read)
       VALUES ($1, $2, $3, $4, $5, $6, 'patient', false, true, false)
       RETURNING ${messageSelect}`,
      [threadId, req.user.id, name, email, phone, text]
    );
    const dto = rowToMessage(rows[0]);
    emitMessageEvent(req.app, dto);
    res.status(201).json(dto);
  } catch (err) {
    if (err.code === '22P02') return res.status(400).json({ error: 'Invalid conversation id' });
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

async function deleteMyAccount(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `DELETE FROM users WHERE id = $1 AND role IN ('patient', 'staff') RETURNING id`,
      [req.user.id]
    );
    if (!rows.length) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'This account cannot be deleted here' });
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account' });
  } finally {
    client.release();
  }
}

module.exports = {
  getMyThreads,
  getMyThreadMessages,
  postMyThreadReply,
  deleteMyAccount,
};
