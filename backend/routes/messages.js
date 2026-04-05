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

router.post('/', createMessage);
router.get('/', verifyToken, isAdmin, getMessages);
router.get('/:id', verifyToken, isAdmin, getMessage);
router.put('/:id', verifyToken, isAdmin, updateMessage);
router.delete('/:id', verifyToken, isAdmin, deleteMessage);

module.exports = router;
