const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");


// -------------------------------------
// 🔥 PUBLIC — anyone can view all listings
// -------------------------------------
router.get("/:type", async (req, res) => {
  try {
    const data = await Listing.find({ type: req.params.type }).sort({ createdAt: -1 });
    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});


// -------------------------------------
// ✍️ AUTH Required — Create Listing
// -------------------------------------
router.post("/:type", protect, async (req, res) => {
  try {
    const item = await Listing.create({
      ...req.body,
      type: req.params.type,
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    return res.json({ ok: true, item });
  } catch (err) {
    return res.status(500).json({ error: "Error creating listing" });
  }
});


// -------------------------------------
// ❌ Delete — admin or owner
// -------------------------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Listing.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });

    if (req.user.email !== item.authorEmail && !req.user.isAdmin)
      return res.status(403).json({ error: "Not allowed" });

    await item.deleteOne();
    return res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting listing" });
  }
});

module.exports = router;
