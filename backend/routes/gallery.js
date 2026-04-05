const express = require('express');
const router = express.Router();
const { getGallery, addGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', getGallery);
router.post('/', verifyToken, isAdmin, addGalleryItem);
router.delete('/:id', verifyToken, isAdmin, deleteGalleryItem);

module.exports = router;
