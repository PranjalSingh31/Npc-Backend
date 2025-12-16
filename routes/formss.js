const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const { protect } = require("../middleware/auth");

/*
--------------------------------------------------
 USER — SUBMIT INQUIRY
 POST /inquiries/submit
--------------------------------------------------
*/
router.post("/submit", async (req, res) => {
  try {
    const data = req.body;

    if (!data.fullName || !data.email || !data.mobile) {
      return res.status(400).json({
        ok: false,
        error: "Missing required fields"
      });
    }

    const inquiry = await Inquiry.create({
      ...data,
      createdAt: new Date()
    });

    res.json({ ok: true, inquiry });
  } catch (err) {
    console.error("INQUIRY SUBMIT ERROR:", err);
    res.status(500).json({ ok: false, error: "Failed to submit inquiry" });
  }
});

/*
--------------------------------------------------
 ADMIN — GET ALL INQUIRIES
 GET /inquiries/all
--------------------------------------------------
*/
router.get("/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ ok: false, error: "Admin only" });

    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.json({ ok: true, inquiries });
  } catch (err) {
    console.error("INQUIRY FETCH ERROR:", err);
    res.status(500).json({ ok: false, error: "Failed to load inquiries" });
  }
});

/*
--------------------------------------------------
 ADMIN — DELETE ONE INQUIRY
 DELETE /inquiries/:id
--------------------------------------------------
*/
router.delete("/:id", protect, async (req, res) => {
  try {
    const found = await Inquiry.findById(req.params.id);

    if (!found)
      return res.status(404).json({ ok: false, error: "Inquiry not found" });

    await found.deleteOne();

    res.json({ ok: true, message: "Inquiry deleted" });
  } catch (err) {
    console.error("INQUIRY DELETE ERROR:", err);
    res.status(500).json({ ok: false, error: "Deletion failed" });
  }
});

module.exports = router;
