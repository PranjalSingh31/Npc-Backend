const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

router.get('/forms', protect, isAdmin, adminController.listAllForms);
router.get('/forms/:id', protect, isAdmin, adminController.getFormById);
router.patch('/forms/:id', protect, isAdmin, adminController.updateFormStatus);
router.delete('/forms/:id', protect, isAdmin, adminController.deleteForm);

module.exports = router;
