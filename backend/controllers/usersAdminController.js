const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const { validatePassword } = require("../utils/validatePassword");
const {
  normalizePhone,
  validatePhoneRequired,
} = require("../utils/validatePhone");

async function logActivity(actorId, userId, action, details = "") {
  try {
    await pool.query(
      `INSERT INTO user_activity_logs (actor_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [actorId || null, userId || null, action, details],
    );
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
}

function mapUser(r) {
  return {
    id: r.id,
    username: r.username,
    email: r.email,
    phone: r.phone || "",
    role: r.role,
    isActive: r.is_active,
    createdAt: r.created_at,
  };
}

async function listUsers(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, phone, role, is_active, created_at
       FROM users
       ORDER BY created_at DESC`,
    );
    res.json(rows.map(mapUser));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

async function listStaff(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, phone, role, is_active, created_at
       FROM users
       WHERE role = 'staff'
       ORDER BY username ASC`,
    );
    res.json(rows.map(mapUser));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
}

async function createStaff(req, res) {
  const {
    username: rawUsername,
    email: rawEmail,
    password,
    phone: rawPhone,
  } = req.body || {};

  const username = rawUsername?.toLowerCase()?.trim();
  const email = rawEmail?.toLowerCase()?.trim();
  const phone = normalizePhone(rawPhone);

  const pwdErr = validatePassword(password);
  if (pwdErr) return res.status(400).json({ error: pwdErr });

  const phoneErr = validatePhoneRequired(phone);
  if (phoneErr) return res.status(400).json({ error: phoneErr });

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  try {
    const dup = await pool.query(
      "SELECT id FROM users WHERE lower(username) = $1 OR lower(email) = $2 LIMIT 1",
      [username, email],
    );

    if (dup.rows.length) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (username, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'staff')
       RETURNING id, username, email, phone, role, is_active, created_at`,
      [username, email, phone, hashedPassword],
    );
    const created = mapUser(rows[0]);
    await logActivity(
      req.user.id,
      created.id,
      "staff_created",
      `Created staff ${created.username}`,
    );
    res.status(201).json(created);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create staff" });
  }
}

async function updateStaff(req, res) {
  const { id } = req.params;
  const {
    username: rawUsername,
    email: rawEmail,
    password,
    phone: rawPhone,
  } = req.body || {};

  try {
    const existing = await pool.query(
      "SELECT id, role, username, email, phone FROM users WHERE id = $1",
      [id],
    );

    if (!existing.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existing.rows[0].role !== "staff") {
      return res
        .status(400)
        .json({ error: "Only staff accounts can be updated here" });
    }

    const sets = [];
    const values = [];
    let n = 1;

    if (rawUsername !== undefined) {
      const username = rawUsername?.toLowerCase()?.trim();
      if (!username)
        return res.status(400).json({ error: "Username cannot be empty" });
      sets.push(`username = $${n++}`);
      values.push(username);
    }

    if (rawEmail !== undefined) {
      const email = rawEmail?.toLowerCase()?.trim();
      if (!email)
        return res.status(400).json({ error: "Email cannot be empty" });
      sets.push(`email = $${n++}`);
      values.push(email);
    }

    if (password !== undefined && password !== "") {
      const pwdErr = validatePassword(password);
      if (pwdErr) return res.status(400).json({ error: pwdErr });
      sets.push(`password_hash = $${n++}`);
      values.push(bcrypt.hashSync(password, 10));
    }

    if (rawPhone !== undefined) {
      const phone = normalizePhone(rawPhone);
      const phoneErr = validatePhoneRequired(phone);
      if (phoneErr) return res.status(400).json({ error: phoneErr });
      sets.push(`phone = $${n++}`);
      values.push(phone);
    }

    if (!sets.length) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);

    const { rows } = await pool.query(
      `UPDATE users SET ${sets.join(", ")}
       WHERE id = $${n} AND role = 'staff'
       RETURNING id, username, email, phone, role, is_active, created_at`,
      values,
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Staff not found" });
    }
    const updated = mapUser(rows[0]);
    await logActivity(
      req.user.id,
      id,
      "staff_updated",
      `Updated staff ${updated.username}`,
    );
    res.json(updated);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "Username or email already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update staff" });
  }
}

async function deleteStaff(req, res) {
  const { id } = req.params;

  if (id === req.user.id) {
    return res
      .status(400)
      .json({ error: "You cannot delete your own account here" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, role, username FROM users WHERE id = $1",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    if (rows[0].role !== "staff") {
      return res
        .status(400)
        .json({ error: "Only staff accounts can be removed from this list" });
    }

    await pool.query("DELETE FROM users WHERE id = $1 AND role = $2", [
      id,
      "staff",
    ]);
    await logActivity(
      req.user.id,
      id,
      "staff_deleted",
      `Deleted staff ${rows[0].username}`,
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete staff" });
  }
}

async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body || {};

  if (!["admin", "staff", "patient"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (id === req.user.id && role !== "admin") {
    return res
      .status(400)
      .json({ error: "You cannot remove your own admin role" });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING id, username, email, phone, role, is_active, created_at`,
      [role, id],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const updated = mapUser(rows[0]);
    await logActivity(
      req.user.id,
      id,
      "role_updated",
      `Role changed to ${updated.role} for ${updated.username}`,
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update role" });
  }
}

async function toggleUserActive(req, res) {
  const { id } = req.params;
  const { isActive } = req.body || {};
  if (typeof isActive !== "boolean") {
    return res.status(400).json({ error: "isActive must be boolean" });
  }
  if (id === req.user.id && isActive === false) {
    return res.status(400).json({ error: "You cannot deactivate your own account" });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2
       RETURNING id, username, email, phone, role, is_active, created_at`,
      [isActive, id],
    );
    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    const updated = mapUser(rows[0]);
    await logActivity(
      req.user.id,
      id,
      "active_status_updated",
      `${updated.username} ${isActive ? "activated" : "deactivated"}`,
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user status" });
  }
}

async function listUserActivityLogs(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT
        l.id,
        l.action,
        l.details,
        l.created_at,
        actor.id AS actor_id,
        actor.username AS actor_username,
        target.id AS user_id,
        target.username AS target_username
      FROM user_activity_logs l
      LEFT JOIN users actor ON actor.id = l.actor_id
      LEFT JOIN users target ON target.id = l.user_id
      ORDER BY l.created_at DESC
      LIMIT 500`,
    );
    res.json(
      rows.map((r) => ({
        id: r.id,
        action: r.action,
        details: r.details || "",
        createdAt: r.created_at,
        actor: r.actor_id
          ? { id: r.actor_id, username: r.actor_username || "Unknown" }
          : null,
        user: r.user_id
          ? { id: r.user_id, username: r.target_username || "Unknown" }
          : null,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
}

module.exports = {
  listUsers,
  listStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  updateUserRole,
  toggleUserActive,
  listUserActivityLogs,
  logActivity,
};
