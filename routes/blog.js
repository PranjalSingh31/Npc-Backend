// backend/routes/blog.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

/* HELPERS */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const FALLBACK = "/no-image.png";

const safeImage = (img) => {
  if (!img || typeof img !== "string") return FALLBACK;
  const s = img.trim();
  if (!s) return FALLBACK;
  if (s.includes("empowerfitness.in")) return FALLBACK;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  if (s.includes("/")) return `/${s.replace(/^\/+/, "")}`;
  return FALLBACK;
};

const formatBlog = (b) => {
  const imgArray =
    Array.isArray(b.images) && b.images.length > 0
      ? b.images.map((x) => safeImage(x))
      : b.image
      ? [safeImage(b.image)]
      : [FALLBACK];

  return {
    ...b._doc,
    image: safeImage(b.image),
    images: imgArray,
  };
};

/* GET ALL BLOGS */
router.get("/", async (req, res) => {
  try {
    const blogs = await Listing.find({ type: "blog" }).sort({ createdAt: -1 });
    res.json({ ok: true, blogs: blogs.map(formatBlog) });
  } catch (err) {
    console.error("GET /api/blog error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch blogs" });
  }
});

/* GET SINGLE BLOG */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ ok: false, error: "Invalid blog id" });

    const blog = await Listing.findById(id);
    if (!blog) return res.status(404).json({ ok: false, error: "Blog not found" });

    res.json({ ok: true, blog: formatBlog(blog) });
  } catch (err) {
    console.error(`GET /api/blog/${req.params.id} error:`, err);
    res.status(500).json({ ok: false, error: "Failed to fetch blog" });
  }
});

/* CREATE BLOG (auth) */
router.post("/", protect, async (req, res) => {
  try {
    const data = { ...req.body, type: "blog", authorName: req.user.name, authorEmail: req.user.email };
    const blog = await Listing.create(data);
    res.json({ ok: true, blog: formatBlog(blog) });
  } catch (err) {
    console.error("POST /api/blog error:", err);
    res.status(500).json({ ok: false, error: "Blog creation failed" });
  }
});

/* UPDATE BLOG (owner|admin) */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ ok: false, error: "Invalid blog id" });

    const blog = await Listing.findById(id);
    if (!blog) return res.status(404).json({ ok: false, error: "Blog not found" });

    if (req.user.role !== "admin" && req.user.email !== blog.authorEmail)
      return res.status(403).json({ ok: false, error: "Not allowed" });

    const updated = await Listing.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ ok: true, blog: formatBlog(updated) });
  } catch (err) {
    console.error(`PUT /api/blog/${req.params.id} error:`, err);
    res.status(500).json({ ok: false, error: "Blog update failed" });
  }
});

/* DELETE BLOG (owner|admin) */
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ ok: false, error: "Invalid blog id" });

    const blog = await Listing.findById(id);
    if (!blog) return res.status(404).json({ ok: false, error: "Blog not found" });

    if (req.user.role !== "admin" && req.user.email !== blog.authorEmail)
      return res.status(403).json({ ok: false, error: "Not allowed" });

    await blog.deleteOne();
    res.json({ ok: true, message: "Blog deleted" });
  } catch (err) {
    console.error(`DELETE /api/blog/${req.params.id} error:`, err);
    res.status(500).json({ ok: false, error: "Deletion failed" });
  }
});

module.exports = router;
