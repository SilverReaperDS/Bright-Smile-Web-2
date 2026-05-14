const express = require('express');
const router = express.Router();
const { getGallery, createCase, updateCase, reorderGallery, deleteCase } = require('../controllers/galleryController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { multipartPair } = require('../middleware/galleryUpload');

router.get('/', getGallery);
router.patch('/reorder', verifyToken, isAdmin, reorderGallery);
router.post('/', verifyToken, isAdmin, multipartPair, createCase);
router.patch('/:id', verifyToken, isAdmin, multipartPair, updateCase);
router.delete('/:id', verifyToken, isAdmin, deleteCase);

module.exports = router;
