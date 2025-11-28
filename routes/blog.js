const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

// 📌 GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Listing.find({ type: "blog" }).sort({ createdAt: -1 });
    res.json({ ok: true, data: blogs });
  } catch {
    res.status(500).json({ error: "Blog fetch failed" });
  }
});

// 📌 GET single blog by ID  ❗ THIS WAS MISSING
router.get("/:id", async (req, res) => {
  try {
    const blog = await Listing.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({ ok: true, blog }); // frontend expects `res.data.blog`
  } catch {
    res.status(500).json({ error: "Could not load blog" });
  }
});

// 📌 CREATE blog
router.post("/", protect, async (req, res) => {
  try {
    const blog = await Listing.create({
      ...req.body,
      type: "blog",
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    res.json({ ok: true, blog });
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Blog creation failed" });
  }
});

// 📌 DELETE (Admin OR Owner)
router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Listing.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });

    if (req.user.role !== "admin" && req.user.email !== blog.authorEmail)
      return res.status(403).json({ error: "Not allowed" });

    await blog.deleteOne();
    res.json({ ok: true, message: "Deleted" });

  } catch {
    res.status(500).json({ error: "Deletion failed" });
  }
});

module.exports = router;
