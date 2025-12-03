const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");
const { protect } = require("../middleware/auth");

/* ======================================================
   USER: SUBMIT FORM
   POST /forms/submit
====================================================== */
router.post("/submit", async (req, res) => {
  try {
    const form = await FormSubmission.create({
      ...req.body,
      submittedAt: new Date(),
    });

    res.json({ ok: true, form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Form submission failed" });
  }
});

/* ======================================================
   ADMIN: GET ALL FORMS
   GET /forms/all
====================================================== */
router.get("/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ ok: false, error: "Admin only" });
    }

    const forms = await FormSubmission.find().sort({ createdAt: -1 });

    res.json({ ok: true, forms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch forms" });
  }
});

/* ======================================================
   ADMIN: GET SINGLE FORM
   GET /forms/:id
====================================================== */
router.get("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ ok: false, error: "Admin only" });
    }

    const form = await FormSubmission.findById(req.params.id);

    if (!form)
      return res.status(404).json({ ok: false, error: "Form not found" });

    res.json({ ok: true, form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch form" });
  }
});

/* ======================================================
   ADMIN: DELETE FORM
   DELETE /forms/:id
====================================================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ ok: false, error: "Admin only" });
    }

    const form = await FormSubmission.findById(req.params.id);

    if (!form)
      return res.status(404).json({ ok: false, error: "Form not found" });

    await form.deleteOne();

    res.json({ ok: true, message: "Form deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Deletion failed" });
  }
});

module.exports = router;
