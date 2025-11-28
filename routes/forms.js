const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");
const { protect } = require("../middleware/auth");

/* --------------------------------------------
   USER — SUBMIT FORM (any formType accepted)
-------------------------------------------- */

router.post("/:formType", protect, async (req, res) => {
  try {
    const submission = await FormSubmission.create({
      user: req.user._id,
      formType: req.params.formType,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      payload: req.body,
    });

    res.json({ ok: true, submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Form submission failed" });
  }
});

/* --------------------------------------------
   GET — ALL FORMS (Admin only)
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
   GET — SPECIFIC FORM TYPE
-------------------------------------------- */
router.get("/type/:formType", protect, async (req, res) => {
  try {
    const data = await FormSubmission.find({ formType: req.params.formType }).sort({ createdAt: -1 });
    res.json({ ok: true, forms: data });
  } catch (err) {
    res.status(500).json({ error: "Unable to load submissions" });
  }
});


/* --------------------------------------------
   DELETE A FORM (Admin only)
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
