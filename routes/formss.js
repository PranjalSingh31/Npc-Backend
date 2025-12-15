// backend/routes/forms.js
const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const { protect } = require("../middleware/auth");

/*
--------------------------------------------------
 POST /forms/inquiry
 Save an inquiry submitted from the modal form
--------------------------------------------------
*/
router.post("/inquiry", async (req, res) => {
  try {
    const data = req.body;

    if (!data.fullName || !data.mobile || !data.email) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const inquiry = await Inquiry.create(data);

    return res.json({ ok: true, inquiry });
  } catch (err) {
    console.error("Inquiry save error:", err);
    return res.status(500).json({ ok: false, error: "Failed to submit inquiry" });
  }
});

/*
--------------------------------------------------
 GET /forms/inquiries  (ADMIN ONLY)
 Fetch all submissions for admin dashboard
--------------------------------------------------
*/
router.get("/inquiries", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ ok: false, error: "Admin only" });
    }

    const all = await Inquiry.find().sort({ createdAt: -1 });

    return res.json({ ok: true, inquiries: all });
  } catch (err) {
    console.error("Inquiry fetch error:", err);
    return res.status(500).json({ ok: false, error: "Failed to load inquiries" });
  }
});

module.exports = router;
