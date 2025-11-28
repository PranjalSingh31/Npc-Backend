const express = require('express');
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

/* --------------------------------------------
   VIEW *ALL* FORMS
-------------------------------------------- */
router.get('/forms', protect, isAdmin, async (req, res) => {
  try {
    const forms = await FormSubmission.find().sort({ createdAt: -1 });
    res.json({ ok: true, forms });
  } catch (err) {
    res.status(500).json({ error: "Failed to load forms" });
  }
});

/* --------------------------------------------
   GET SINGLE FORM DETAILS
-------------------------------------------- */
router.get('/forms/:id', protect, isAdmin, async (req, res) => {
  try {
    const form = await FormSubmission.findById(req.params.id);
    res.json({ ok: true, form });
  } catch {
    res.status(500).json({ error: "Unable to fetch details" });
  }
});

/* --------------------------------------------
   UPDATE FORM (status / other admin fields later)
-------------------------------------------- */
router.patch('/forms/:id', protect, isAdmin, async (req, res) => {
  try {
    const updated = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ ok: true, updated });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

/* --------------------------------------------
   DELETE FORM
-------------------------------------------- */
router.delete('/forms/:id', protect, isAdmin, async (req, res) => {
  try {
    await FormSubmission.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Form deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
