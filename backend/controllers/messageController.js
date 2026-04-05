const { pool } = require('../db');

function rowToMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

async function getMessages(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, message, read, created_at FROM messages ORDER BY created_at DESC'
    );
    res.json(rows.map(rowToMessage));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function getMessage(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, message, read, created_at FROM messages WHERE id = $1',
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
  const { name, email, message } = req.body || {};
  try {
    const { rows } = await pool.query(
      `INSERT INTO messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, message, read, created_at`,
      [name ?? null, email ?? null, message ?? null]
    );
    res.status(201).json(rowToMessage(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create message' });
  }
}

async function updateMessage(req, res) {
  const allowed = ['name', 'email', 'message', 'read'];
  const body = req.body || {};
  const sets = [];
  const values = [];
  let i = 1;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      sets.push(`${key === 'read' ? 'read' : key} = $${i}`);
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
       RETURNING id, name, email, message, read, created_at`,
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
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};
