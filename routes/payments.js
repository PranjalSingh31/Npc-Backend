const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Razorpay order creation
router.post('/create-order', protect, paymentController.createRazorpayOrder);

// Razorpay webhook
router.post('/razorpay-webhook', paymentController.razorpayWebhook);

module.exports = router;
