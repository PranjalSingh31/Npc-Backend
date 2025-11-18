const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { protect } = require('../middleware/auth');

router.post('/:formType', protect, formController.createSubmission);
router.get('/:formType', protect, formController.getUserSubmissions);

module.exports = router;
