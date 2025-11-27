const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

// =========================================
// 👉 PUBLIC — Everyone Can View Listings
// =========================================
router.get("/:type", async (req, res) => {
  try {
    const type = req.params.type; // blog / franchise / business / investor
    const data = await Listing.find({ type }).sort({ createdAt: -1 });

    res.json({ ok: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error loading listings" });
  }
});

// =========================================
// ✍️ USER — Create Blog/Franchise/Business/Investor
// =========================================
router.post("/:type", protect, async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      type: req.params.type,
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    res.json({ ok: true, listing });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating listing" });
  }
});

// =========================================
// 🗑 DELETE — Only Owner or Admin
// =========================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Listing.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Not found" });

    // Only creator or admin can delete
    if (req.user.email !== item.authorEmail && req.user.role !== "admin")
      return res.status(403).json({ error: "Not allowed" });

    await item.deleteOne();
    res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting listing" });
  }
});

module.exports = router;
