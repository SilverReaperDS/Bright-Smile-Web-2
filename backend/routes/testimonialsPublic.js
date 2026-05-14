const express = require('express');
const router = express.Router();
const { getPublicTestimonials } = require('../controllers/testimonialsPublicController');

router.get('/', getPublicTestimonials);

module.exports = router;
