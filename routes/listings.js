const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

// ✔ GET — Public access
router.get("/:type", async (req, res) => {
  try {
    const items = await Listing.find({ type: req.params.type }).sort({ createdAt: -1 });
    res.json({ ok: true, data: items });
  } catch {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// ✔ POST — Blog + Franchise + Business + Investor
router.post("/:type", protect, async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      type: req.params.type,
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    res.json({ ok: true, listing });
  } catch {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// ✔ DELETE — Only owner or admin
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Listing.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });

    if (req.user.email !== item.authorEmail && !req.user.isAdmin)
      return res.status(403).json({ error: "Not allowed" });

    await item.deleteOne();
    res.json({ ok: true, message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
