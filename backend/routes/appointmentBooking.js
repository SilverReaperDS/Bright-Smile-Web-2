const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createPatientBooking } = require('../controllers/appointmentController');

router.post('/', verifyToken, createPatientBooking);

module.exports = router;
