const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  listAppointments,
  listStaffForAssignment,
  updateAppointment,
  deleteAppointment,
  exportAppointmentsCsv,
} = require('../controllers/appointmentController');

router.use(verifyToken, isAdmin);

router.get('/export/csv', exportAppointmentsCsv);
router.get('/staff', listStaffForAssignment);
router.get('/', listAppointments);
router.patch('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
