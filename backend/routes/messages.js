const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  getThreadsSummaryAdmin,
  getThreadMessagesAdmin,
  adminReplyToThread,
  patchThreadReadState,
  patchThreadArchiveState,
} = require('../controllers/messageController');

router.post('/', verifyToken, createMessage);

router.get('/threads/summary', verifyToken, isAdmin, getThreadsSummaryAdmin);
router.get('/threads/:threadId', verifyToken, isAdmin, getThreadMessagesAdmin);
router.post('/threads/:threadId/reply', verifyToken, isAdmin, adminReplyToThread);
router.patch('/threads/:threadId/read', verifyToken, isAdmin, patchThreadReadState);
router.patch('/threads/:threadId/archive', verifyToken, isAdmin, patchThreadArchiveState);

router.get('/', verifyToken, isAdmin, getMessages);
router.get('/:id', verifyToken, isAdmin, getMessage);
router.put('/:id', verifyToken, isAdmin, updateMessage);
router.delete('/:id', verifyToken, isAdmin, deleteMessage);

module.exports = router;
