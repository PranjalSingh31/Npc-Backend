const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

/* ======================================
   📌 GET ALL BLOGS
====================================== */
router.get("/", async (req, res) => {
  try {
    const blogs = await Listing.find({ type: "blog" }).sort({ createdAt: -1 });
    res.json({ ok: true, blogs });           // <--- Consistent response
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

/* ======================================
   📌 GET SINGLE BLOG — REQUIRED BY UI
====================================== */
router.get("/:id", async (req, res) => {
  try {
    const blog = await Listing.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({ ok: true, blog });            // <--- frontend reads res.data.blog
  } catch (err) {
    res.status(500).json({ error: "Could not load blog" });
  }
});

/* ======================================
   📌 CREATE BLOG  (USER + ADMIN)
====================================== */
router.post("/", protect, async (req, res) => {
  try {
    const blog = await Listing.create({
      ...req.body,
      type: "blog",
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    res.json({ ok: true, blog });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Blog creation failed" });
  }
});

/* ======================================
   📌 DELETE BLOG  (Admin OR Owner Only)
====================================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Listing.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // 🔥 Final secured condition:
    // Admin can delete any
    // User can delete only their own blog
    if (req.user.role !== "admin" && req.user.email !== blog.authorEmail) {
      return res.status(403).json({ error: "Not allowed to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ ok: true, message: "Blog deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: "Deletion failed" });
  }
});

module.exports = router;
