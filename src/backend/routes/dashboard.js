const express = require('express');
const router = express.Router();
const { getOverviewStats } = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/overview', verifyToken, isAdmin, getOverviewStats);

module.exports = router;