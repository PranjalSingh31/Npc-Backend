const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/', contactController.createContact);
router.get('/all', protect, contactController.getAllContacts);

module.exports = router;
