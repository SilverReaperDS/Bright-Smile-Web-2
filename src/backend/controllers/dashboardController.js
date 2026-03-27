const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');

async function getOverviewStats(req, res) {
  try {
    const usersCount = await User.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const testimonialsPending = await Testimonial.countDocuments({ status: 'pending' });
    const messagesUnread = await Message.countDocuments({ read: false });

    res.json({
      users: usersCount,
      appointments: appointmentsCount,
      testimonialsPending,
      messagesUnread,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

module.exports = { getOverviewStats };