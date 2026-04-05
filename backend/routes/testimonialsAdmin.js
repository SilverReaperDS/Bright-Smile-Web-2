const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const { listTestimonials, updateTestimonial } = require('../controllers/testimonialsAdminController');

router.use(verifyToken, isAdmin);
router.get('/', listTestimonials);
router.patch('/:id', updateTestimonial);

module.exports = router;
