function rowToMessage(row) {
  return {
    id: row.id,
    threadId: row.thread_id,
    userId: row.user_id,
    senderRole: row.sender_role,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    read: row.sender_role === 'patient' ? row.read_by_admin : row.read_by_patient,
    readByAdmin: row.read_by_admin,
    readByPatient: row.read_by_patient,
    createdAt: row.created_at,
  };
}

const messageSelect = `
  id, thread_id, user_id, sender_role, name, email, phone, message,
  read_by_admin, read_by_patient, created_at
`;

module.exports = { rowToMessage, messageSelect };
