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

router.use(verifyToken, isPatientOrStaff);

router.delete('/account', deleteMyAccount);
router.get('/threads', getMyThreads);
router.get('/threads/:threadId/messages', getMyThreadMessages);
router.post('/threads/:threadId/messages', postMyThreadReply);
router.get('/appointments', listMyAppointments);

module.exports = router;
