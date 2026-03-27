const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  status: { type: String, default: 'pending' }, // pending, approved
});

module.exports = mongoose.model('Testimonial', testimonialSchema);