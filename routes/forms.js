const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");
const { protect } = require("../middleware/auth");

/* --------------------------------------------
   USER — SUBMIT FORM (multiple allowed per type)
-------------------------------------------- */
router.post("/:formType", protect, async (req, res) => {
  try {
    const saved = await FormSubmission.create({
      formType: req.params.formType,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      payload: req.body,       // full form data
      user: req.user._id,
    });

    res.json({ ok: true, submission: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Form submission failed" });
  }
});

/* --------------------------------------------
   GET — ALL FORMS (ADMIN ONLY)
-------------------------------------------- */
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Not admin" });

    const forms = await FormSubmission.find().sort({ createdAt: -1 });
    res.json({ ok: true, forms });
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch forms" });
  }
});

/* --------------------------------------------
   GET — FILTER BY FORM TYPE (Admin + User)
-------------------------------------------- */
router.get("/type/:formType", protect, async (req, res) => {
  try {
    const result = await FormSubmission.find({ formType: req.params.formType }).sort({ createdAt: -1 });
    res.json({ ok: true, forms: result });
  } catch (err) {
    res.status(500).json({ error: "Unable to load submissions" });
  }
});

/* --------------------------------------------
   DELETE A FORM (ADMIN ONLY)
-------------------------------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Not admin" });

    await FormSubmission.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Form removed" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
