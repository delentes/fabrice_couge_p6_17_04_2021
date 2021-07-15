const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Specific routes for each user middleware
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;