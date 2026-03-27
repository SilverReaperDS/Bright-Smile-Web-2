const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  status: { type: String, default: 'pending' }, // pending, confirmed, canceled
});

module.exports = mongoose.model('Appointment', appointmentSchema);