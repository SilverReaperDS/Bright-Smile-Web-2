const { pool } = require('../db');

function rowToAppointment(row) {
  return {
    id: row.id,
    appointmentDate: row.appointment_date,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    patient: row.patient_username
      ? { id: row.user_id, username: row.patient_username, email: row.patient_email }
      : null,
    assignedStaff: row.assigned_staff_id
      ? { id: row.assigned_staff_id, username: row.assigned_staff_username }
      : null,
  };
}

const listSql = `
  SELECT a.id, a.user_id, a.assigned_staff_id, a.appointment_date, a.status, a.notes, a.created_at,
         u.username AS patient_username, u.email AS patient_email,
         s.username AS assigned_staff_username
  FROM appointments a
  LEFT JOIN users u ON u.id = a.user_id
  LEFT JOIN users s ON s.id = a.assigned_staff_id
  ORDER BY a.appointment_date ASC
`;

async function listAppointments(req, res) {
  try {
    const { rows } = await pool.query(listSql);
    res.json(rows.map(rowToAppointment));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
}

async function listStaffForAssignment(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, role FROM users
       WHERE role = 'staff'
       ORDER BY username ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
}

async function updateAppointment(req, res) {
  const { id } = req.params;
  const { status, appointmentDate, assignedStaffId } = req.body || {};

  const sets = [];
  const values = [];
  let n = 1;

  if (status !== undefined) {
    if (!['pending', 'confirmed', 'canceled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    sets.push(`status = $${n++}`);
    values.push(status);
  }
  if (appointmentDate !== undefined) {
    sets.push(`appointment_date = $${n++}::timestamptz`);
    values.push(appointmentDate);
  }
  if (assignedStaffId !== undefined) {
    const sid = assignedStaffId || null;
    if (sid) {
      const st = await pool.query(`SELECT id FROM users WHERE id = $1 AND role = 'staff'`, [sid]);
      if (!st.rows.length) {
        return res.status(400).json({ error: 'Select a valid staff member from your team' });
      }
    }
    sets.push(`assigned_staff_id = $${n++}`);
    values.push(sid);
  }

  if (!sets.length) {
    return res.status(400).json({ error: 'No updatable fields' });
  }

  values.push(id);

  try {
    const { rows } = await pool.query(
      `UPDATE appointments SET ${sets.join(', ')}
       WHERE id = $${n}
       RETURNING id, user_id, assigned_staff_id, appointment_date, status, notes, created_at`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Appointment not found' });

    const full = await pool.query(
      `SELECT a.id, a.user_id, a.assigned_staff_id, a.appointment_date, a.status, a.notes, a.created_at,
              u.username AS patient_username, u.email AS patient_email,
              s.username AS assigned_staff_username
       FROM appointments a
       LEFT JOIN users u ON u.id = a.user_id
       LEFT JOIN users s ON s.id = a.assigned_staff_id
       WHERE a.id = $1`,
      [id]
    );
    res.json(rowToAppointment(full.rows[0]));
  } catch (err) {
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Invalid id or staff id' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { rowCount } = await pool.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ success: true });
  } catch (err) {
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Invalid id' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
}

async function exportAppointmentsCsv(req, res) {
  try {
    const { rows } = await pool.query(listSql);
    const header = [
      'id',
      'appointment_date',
      'status',
      'patient_username',
      'patient_email',
      'assigned_staff',
      'notes',
    ];
    const lines = [header.join(',')];
    for (const row of rows) {
      const cells = [
        row.id,
        row.appointment_date?.toISOString?.() || row.appointment_date,
        row.status,
        row.patient_username || '',
        row.patient_email || '',
        row.assigned_staff_username || '',
        (row.notes || '').replace(/"/g, '""'),
      ].map((c) => {
        const s = String(c);
        if (/[",\n]/.test(s)) return `"${s}"`;
        return s;
      });
      lines.push(cells.join(','));
    }
    const csv = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="appointments.csv"');
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
}

async function listMyAppointments(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.user_id, a.assigned_staff_id, a.appointment_date, a.status, a.notes, a.created_at,
              u.username AS patient_username, u.email AS patient_email,
              s.username AS assigned_staff_username
       FROM appointments a
       LEFT JOIN users u ON u.id = a.user_id
       LEFT JOIN users s ON s.id = a.assigned_staff_id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC`,
      [req.user.id]
    );
    res.json(rows.map(rowToAppointment));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
}

async function createPatientBooking(req, res) {
  if (req.user?.role === 'admin') {
    return res.status(403).json({ error: 'Admins cannot book patient appointments from this flow' });
  }
  const { appointmentDate, notes } = req.body || {};
  if (!appointmentDate) {
    return res.status(400).json({ error: 'appointmentDate is required' });
  }
  const d = new Date(appointmentDate);
  if (Number.isNaN(d.getTime())) {
    return res.status(400).json({ error: 'Invalid appointmentDate' });
  }
  if (d.getTime() < Date.now() - 60 * 1000) {
    return res.status(400).json({ error: 'Appointment must be in the future' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO appointments (user_id, appointment_date, status, notes)
       VALUES ($1, $2::timestamptz, 'pending', $3)
       RETURNING id, user_id, appointment_date, status, notes, created_at`,
      [req.user.id, appointmentDate, notes?.trim() || null]
    );
    const row = rows[0];
    res.status(201).json({
      id: row.id,
      appointmentDate: row.appointment_date,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
}

module.exports = {
  listAppointments,
  listStaffForAssignment,
  updateAppointment,
  deleteAppointment,
  exportAppointmentsCsv,
  listMyAppointments,
  createPatientBooking,
};
