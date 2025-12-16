// backend/routes/forms.js
const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");
const { protect } = require("../middleware/auth");

/* ---------------------------------------------
   USER — SUBMIT SERVICE FORM
   POST /forms/submit
---------------------------------------------- */
router.post("/submit", async (req, res) => {
  try {
    const form = await FormSubmission.create({
      ...req.body,
      createdAt: new Date()
    });

    res.json({ ok: true, form });
  } catch (err) {
    console.error("SERVICE FORM SUBMIT ERROR:", err);
    res.status(500).json({ ok: false, error: "Form submission failed" });
  }
});

/* ---------------------------------------------
   ADMIN — GET ALL SERVICE FORMS
   GET /forms/all
---------------------------------------------- */
router.get("/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ ok: false, error: "Admin only" });

    const forms = await FormSubmission.find().sort({ createdAt: -1 });

    res.json({ ok: true, forms });
  } catch (err) {
    console.error("SERVICE FORM FETCH ERROR:", err);
    res.status(500).json({ ok: false, error: "Failed to load service forms" });
  }
});

/* ---------------------------------------------
   ADMIN — GET ONE SERVICE FORM
   GET /forms/:id
---------------------------------------------- */
router.get("/:id", protect, async (req, res) => {
  try {
    const form = await FormSubmission.findById(req.params.id);

    if (!form)
      return res.status(404).json({ ok: false, error: "Form not found" });

    res.json({ ok: true, form });
  } catch (err) {
    console.error("SERVICE FORM SINGLE FETCH ERROR:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch form" });
  }
});

/* ---------------------------------------------
   ADMIN — DELETE ONE SERVICE FORM
   DELETE /forms/:id
---------------------------------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const form = await FormSubmission.findById(req.params.id);

    if (!form)
      return res.status(404).json({ ok: false, error: "Form not found" });

    await form.deleteOne();

    res.json({ ok: true, message: "Form deleted" });
  } catch (err) {
    console.error("SERVICE FORM DELETE ERROR:", err);
    res.status(500).json({ ok: false, error: "Deletion failed" });
  }
});

module.exports = router;
