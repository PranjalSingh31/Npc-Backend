// backend/routes/listings.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const FALLBACK = "/no-image.png";

const safeImage = (img) => {
  if (!img || typeof img !== "string") return FALLBACK;
  const s = img.trim();
  if (!s) return FALLBACK;
  // block broken domain
  if (s.includes("empowerfitness.in")) return FALLBACK;
  // full url (cloudinary etc)
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  // root-relative paths (e.g. /uploads/...)
  if (s.startsWith("/")) return s;
  // upload-like path "uploads/abc.jpg" -> make root-relative
  if (s.includes("/")) return `/${s.replace(/^\/+/, "")}`;
  return FALLBACK;
};

const formatListing = (item) => {
  const imagesArr =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images.map((x) => safeImage(x))
      : item.image
      ? [safeImage(item.image)]
      : [FALLBACK];

  return {
    ...item._doc,
    image: safeImage(item.image),
    images: imagesArr,
  };
};

/* GET /listings/:type  — list items of a type (public) */
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    if (!["franchise", "business", "investor"].includes(type)) {
      return res.status(400).json({ ok: false, error: "Invalid listing type" });
    }

    const items = await Listing.find({ type }).sort({ createdAt: -1 });

    res.json({
      ok: true,
      data: items.map(formatListing),
    });
  } catch (err) {
    console.error("GET /listings/:type error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch listings" });
  }
});

/* GET /listings/:type/:id  — single item (public) */
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!["franchise", "business", "investor"].includes(type)) {
      return res.status(400).json({ ok: false, error: "Invalid listing type" });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }

    const item = await Listing.findById(id);
    if (!item) return res.status(404).json({ ok: false, error: "Not found" });

    // ensure the found item's type matches requested type (defense)
    if (item.type !== type) {
      return res.status(400).json({ ok: false, error: "Type mismatch" });
    }

    res.json({ ok: true, data: formatListing(item) });
  } catch (err) {
    console.error(`GET /listings/${req.params.type}/${req.params.id} error:`, err);
    res.status(500).json({ ok: false, error: "Failed to fetch listing" });
  }
});

/* POST /listings/:type  — create (admin) */
router.post("/:type", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ ok: false, error: "Admin only" });

    const { type } = req.params;
    if (!["franchise", "business", "investor"].includes(type)) {
      return res.status(400).json({ ok: false, error: "Invalid listing type" });
    }

    const listing = await Listing.create({
      ...req.body,
      type,
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    res.json({ ok: true, listing: formatListing(listing) });
  } catch (err) {
    console.error("POST /listings/:type error:", err);
    res.status(500).json({ ok: false, error: "Creation failed" });
  }
});

/* PUT /listings/:id  — update (admin) */
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ ok: false, error: "Admin only" });

    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ ok: false, error: "Invalid id" });

    const updated = await Listing.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ ok: false, error: "Not found" });

    res.json({ ok: true, listing: formatListing(updated) });
  } catch (err) {
    console.error("PUT /listings/:id error:", err);
    res.status(500).json({ ok: false, error: "Update failed" });
  }
});

/* DELETE /listings/:id  — delete (admin) */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ ok: false, error: "Admin only" });

    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ ok: false, error: "Invalid id" });

    const item = await Listing.findById(id);
    if (!item) return res.status(404).json({ ok: false, error: "Not found" });

    await item.deleteOne();
    res.json({ ok: true, message: "Listing deleted" });
  } catch (err) {
    console.error("DELETE /listings/:id error:", err);
    res.status(500).json({ ok: false, error: "Delete failed" });
  }
});

module.exports = router;
