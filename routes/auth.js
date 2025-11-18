const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

const { protect } = require('../middleware/auth');
router.get('/me', protect, authController.me);

module.exports = router;
