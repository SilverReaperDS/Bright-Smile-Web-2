const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { validatePassword } = require('../utils/validatePassword');
const { normalizePhone, validatePhoneRequired } = require('../utils/validatePhone');

async function listUsers(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, phone, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json(
      rows.map((r) => ({
        id: r.id,
        username: r.username,
        email: r.email,
        phone: r.phone || '',
        role: r.role,
        createdAt: r.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function listStaff(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, phone, role, created_at
       FROM users
       WHERE role = 'staff'
       ORDER BY username ASC`
    );
    res.json(
      rows.map((r) => ({
        id: r.id,
        username: r.username,
        email: r.email,
        phone: r.phone || '',
        role: r.role,
        createdAt: r.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
}

async function createStaff(req, res) {
  const { username: rawUsername, email: rawEmail, password, phone: rawPhone } = req.body || {};
  const username = rawUsername?.toLowerCase()?.trim();
  const email = rawEmail?.toLowerCase()?.trim();
  const phone = normalizePhone(rawPhone);

  const pwdErr = validatePassword(password);
  if (pwdErr) {
    return res.status(400).json({ error: pwdErr });
  }
  const phoneErr = validatePhoneRequired(phone);
  if (phoneErr) {
    return res.status(400).json({ error: phoneErr });
  }
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    const dup = await pool.query(
      'SELECT id FROM users WHERE lower(username) = $1 OR lower(email) = $2 LIMIT 1',
      [username, email]
    );
    if (dup.rows.length) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'staff')
       RETURNING id, username, email, phone, role, created_at`,
      [username, email, phone, hashedPassword]
    );
    const r = rows[0];
    res.status(201).json({
      id: r.id,
      username: r.username,
      email: r.email,
      phone: r.phone || '',
      role: r.role,
      createdAt: r.created_at,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create staff' });
  }
}

async function updateStaff(req, res) {
  const { id } = req.params;
  const { username: rawUsername, email: rawEmail, password, phone: rawPhone } = req.body || {};

  try {
    const existing = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (existing.rows[0].role !== 'staff') {
      return res.status(400).json({ error: 'Only staff accounts can be updated here' });
    }

    const sets = [];
    const values = [];
    let n = 1;

    if (rawUsername !== undefined) {
      const username = rawUsername?.toLowerCase()?.trim();
      if (!username) {
        return res.status(400).json({ error: 'Username cannot be empty' });
      }
      sets.push(`username = $${n++}`);
      values.push(username);
    }
    if (rawEmail !== undefined) {
      const email = rawEmail?.toLowerCase()?.trim();
      if (!email) {
        return res.status(400).json({ error: 'Email cannot be empty' });
      }
      sets.push(`email = $${n++}`);
      values.push(email);
    }
    if (password !== undefined && password !== '') {
      const pwdErr = validatePassword(password);
      if (pwdErr) {
        return res.status(400).json({ error: pwdErr });
      }
      sets.push(`password_hash = $${n++}`);
      values.push(bcrypt.hashSync(password, 10));
    }
    if (rawPhone !== undefined) {
      const phone = normalizePhone(rawPhone);
      const phoneErr = validatePhoneRequired(phone);
      if (phoneErr) {
        return res.status(400).json({ error: phoneErr });
      }
      sets.push(`phone = $${n++}`);
      values.push(phone);
    }

    if (!sets.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE users SET ${sets.join(', ')}
       WHERE id = $${n} AND role = 'staff'
       RETURNING id, username, email, phone, role, created_at`,
      values
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    const r = rows[0];
    res.json({
      id: r.id,
      username: r.username,
      email: r.email,
      phone: r.phone || '',
      role: r.role,
      createdAt: r.created_at,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already in use' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update staff' });
  }
}

async function deleteStaff(req, res) {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account here' });
  }

  try {
    const { rows } = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (rows[0].role !== 'staff') {
      return res.status(400).json({ error: 'Only staff accounts can be removed from this list' });
    }

    await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [id, 'staff']);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
}

module.exports = { listUsers, listStaff, createStaff, updateStaff, deleteStaff };
