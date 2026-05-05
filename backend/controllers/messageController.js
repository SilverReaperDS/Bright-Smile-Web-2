const crypto = require('crypto');
const { pool } = require('../db');
const { normalizePhone, validatePhoneRequired } = require('../utils/validatePhone');
const { rowToMessage, messageSelect } = require('./messageShared');
const { emitMessageEvent } = require('../utils/realtime');

async function getMessages(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT ${messageSelect} FROM messages ORDER BY thread_id, created_at ASC`
    );
    res.json(rows.map(rowToMessage));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function getThreadsSummaryAdmin(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT
        m.thread_id,
        MAX(m.created_at) AS last_at,
        (SELECT name FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at ASC LIMIT 1) AS name,
        (SELECT email FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at ASC LIMIT 1) AS email,
        (SELECT phone FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at ASC LIMIT 1) AS phone,
        (SELECT user_id FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at ASC LIMIT 1) AS user_id,
        (SELECT message FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at DESC LIMIT 1) AS last_preview,
        (SELECT sender_role FROM messages x WHERE x.thread_id = m.thread_id ORDER BY x.created_at DESC LIMIT 1) AS last_sender_role,
        COUNT(*) FILTER (WHERE m.sender_role = 'patient' AND NOT m.read_by_admin)::int AS unread_count
      FROM messages m
      GROUP BY m.thread_id
      ORDER BY last_at DESC
    `);
    res.json(
      rows.map((r) => ({
        threadId: r.thread_id,
        lastAt: r.last_at,
        name: r.name,
        email: r.email,
        phone: r.phone,
        userId: r.user_id,
        lastPreview: r.last_preview,
        lastSenderRole: r.last_sender_role,
        unreadCount: r.unread_count,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
}

async function getThreadMessagesAdmin(req, res) {
  const { threadId } = req.params;
  try {
    const { rows: exists } = await pool.query('SELECT 1 FROM messages WHERE thread_id = $1 LIMIT 1', [threadId]);
    if (!exists.length) return res.status(404).json({ error: 'Thread not found' });

    await pool.query(
      `UPDATE messages SET read_by_admin = true, read = true
       WHERE thread_id = $1 AND sender_role = 'patient'`,
      [threadId]
    );

    const { rows } = await pool.query(
      `SELECT ${messageSelect} FROM messages WHERE thread_id = $1 ORDER BY created_at ASC`,
      [threadId]
    );
    res.json(rows.map(rowToMessage));
  } catch (err) {
    if (err.code === '22P02') return res.status(400).json({ error: 'Invalid thread id' });
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
}

async function adminReplyToThread(req, res) {
  const { threadId } = req.params;
  const text = String(req.body?.message ?? '').trim();
  if (!text) return res.status(400).json({ error: 'Message is required' });

  try {
    const { rows: first } = await pool.query(
      `SELECT user_id, name, email, phone FROM messages WHERE thread_id = $1 ORDER BY created_at ASC LIMIT 1`,
      [threadId]
    );
    if (!first.length) return res.status(404).json({ error: 'Thread not found' });

    const { user_id: userId, name, email, phone } = first[0];
    const { rows } = await pool.query(
      `INSERT INTO messages (thread_id, user_id, name, email, phone, message, sender_role, read_by_admin, read_by_patient, read)
       VALUES ($1, $2, $3, $4, $5, $6, 'admin', true, false, true)
       RETURNING ${messageSelect}`,
      [threadId, userId, name, email, phone, text]
    );
    const dto = rowToMessage(rows[0]);
    emitMessageEvent(req.app, dto);
    res.status(201).json(dto);
  } catch (err) {
    if (err.code === '22P02') return res.status(400).json({ error: 'Invalid thread id' });
    console.error(err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
}

async function getMessage(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT ${messageSelect} FROM messages WHERE id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Message not found' });
    res.json(rowToMessage(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
}

async function createMessage(req, res) {
  const messageText = String(req.body?.message || '').trim();
  const userId = req.user.id;

  if (!messageText) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const { rows: urows } = await pool.query(
    'SELECT username, email, phone FROM users WHERE id = $1',
    [userId]
  );
  if (!urows.length) {
    return res.status(401).json({ error: 'Account not found' });
  }
  const u = urows[0];
  const name = String(u.username || '').trim();
  const email = String(u.email || '').trim().toLowerCase();
  const phone = normalizePhone(u.phone);
  const phoneErr = validatePhoneRequired(phone);
  if (phoneErr) {
    return res.status(400).json({
      error:
        'Your account needs a valid phone number on file to send a message. Update your profile or re-register with a phone number.',
    });
  }

  let threadId = null;
  const { rows: existing } = await pool.query(
    'SELECT thread_id FROM messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [userId]
  );
  if (existing.length) threadId = existing[0].thread_id;
  if (!threadId) threadId = crypto.randomUUID();

  try {
    const { rows } = await pool.query(
      `INSERT INTO messages (thread_id, user_id, name, email, phone, message, sender_role, read_by_admin, read_by_patient, read)
       VALUES ($1, $2, $3, $4, $5, $6, 'patient', false, true, false)
       RETURNING ${messageSelect}`,
      [threadId, userId, name, email, phone, messageText]
    );
    const dto = rowToMessage(rows[0]);
    emitMessageEvent(req.app, dto);
    res.status(201).json(dto);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create message' });
  }
}

async function updateMessage(req, res) {
  const body = req.body || {};
  const sets = [];
  const values = [];
  let i = 1;

  if (Object.prototype.hasOwnProperty.call(body, 'read')) {
    sets.push(`read_by_admin = $${i}`);
    values.push(!!body.read);
    i += 1;
    sets.push(`read = $${i}`);
    values.push(!!body.read);
    i += 1;
  }

  for (const key of ['name', 'email', 'phone', 'message']) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      sets.push(`${key} = $${i}`);
      values.push(body[key]);
      i += 1;
    }
  }

  if (!sets.length) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(req.params.id);
  try {
    const { rows } = await pool.query(
      `UPDATE messages SET ${sets.join(', ')}
       WHERE id = $${i}
       RETURNING ${messageSelect}`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Message not found' });
    res.json(rowToMessage(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update message' });
  }
}

async function deleteMessage(req, res) {
  try {
    const { rowCount } = await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
}

module.exports = {
  getMessages,
  getThreadsSummaryAdmin,
  getThreadMessagesAdmin,
  adminReplyToThread,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};
