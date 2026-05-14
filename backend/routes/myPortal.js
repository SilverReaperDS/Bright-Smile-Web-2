const express = require('express');
const router = express.Router();
const { verifyToken, isPatientOrStaff } = require('../middleware/auth');
const {
  getMyThreads,
  getMyThreadMessages,
  postMyThreadReply,
  deleteMyAccount,
} = require('../controllers/myPortalController');
const { listMyAppointments } = require('../controllers/appointmentController');
const {
  getMyTestimonials,
  createMyTestimonial,
  deleteMyTestimonial,
} = require('../controllers/myTestimonialsController');

router.use(verifyToken, isPatientOrStaff);

router.delete('/account', deleteMyAccount);
router.get('/threads', getMyThreads);
router.get('/threads/:threadId/messages', getMyThreadMessages);
router.post('/threads/:threadId/messages', postMyThreadReply);
router.get('/appointments', listMyAppointments);

router.get('/testimonials', getMyTestimonials);
router.post('/testimonials', createMyTestimonial);
router.delete('/testimonials/:id', deleteMyTestimonial);

module.exports = router;
