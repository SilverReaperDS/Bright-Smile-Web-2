const express = require('express');
const router = express.Router();
const {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public: contact form submission
router.post('/', createMessage);

// Admin only: manage messages
router.get('/', verifyToken, isAdmin, getMessages);
router.get('/:id', verifyToken, isAdmin, getMessage);
router.put('/:id', verifyToken, isAdmin, updateMessage);
router.delete('/:id', verifyToken, isAdmin, deleteMessage);

module.exports = router;