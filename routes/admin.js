const express = require("express");
const router = express.Router();

const Listing = require("../models/Listing");
const FormSubmission = require("../models/FormSubmission");

const { protect } = require("../middleware/auth");

/* ======================================================
   ADMIN CHECK MIDDLEWARE
====================================================== */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ ok: false, error: "Admin only" });
  }
  next();
};

/* ======================================================
   FORMAT IMAGE (avoid frontend breaks)
====================================================== */
const formatListing = (item) => ({
  ...item._doc,
  image: item.image || (item.images?.length > 0 ? item.images[0] : ""),
});

/* ======================================================
   ADMIN: GET ALL BLOGS
====================================================== */
router.get("/blogs", protect, adminOnly, async (req, res) => {
  try {
    const blogs = await Listing.find({ type: "blog" }).sort({ createdAt: -1 });
    res.json({ ok: true, blogs: blogs.map(formatListing) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/* ======================================================
   ADMIN: GET ALL FRANCHISE LISTINGS
====================================================== */
router.get("/franchise", protect, adminOnly, async (req, res) => {
  try {
    const data = await Listing.find({ type: "franchise" }).sort({
      createdAt: -1,
    });
    res.json({ ok: true, data: data.map(formatListing) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/* ======================================================
   ADMIN: GET ALL BUSINESS LISTINGS
====================================================== */
router.get("/business", protect, adminOnly, async (req, res) => {
  try {
    const data = await Listing.find({ type: "business" }).sort({
      createdAt: -1,
    });
    res.json({ ok: true, data: data.map(formatListing) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/* ======================================================
   ADMIN: GET ALL INVESTOR LISTINGS
====================================================== */
router.get("/investor", protect, adminOnly, async (req, res) => {
  try {
    const data = await Listing.find({ type: "investor" }).sort({
      createdAt: -1,
    });
    res.json({ ok: true, data: data.map(formatListing) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/* ======================================================
   ADMIN: DELETE ANY LISTING
====================================================== */
router.delete("/listing/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await Listing.findById(req.params.id);
    if (!item) return res.status(404).json({ ok: false, error: "Not found" });

    await item.deleteOne();
    res.json({ ok: true, message: "Listing deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/* ======================================================
   ADMIN: UPDATE ANY LISTING
====================================================== */
router.put("/listing/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ ok: false, error: "Not found" });

    res.json({ ok: true, listing: formatListing(updated) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/* ======================================================
   ADMIN: VIEW ALL FORM SUBMISSIONS
====================================================== */
router.get("/forms", protect, adminOnly, async (req, res) => {
  try {
    const forms = await FormSubmission.find().sort({ createdAt: -1 });
    res.json({ ok: true, forms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/* ======================================================
   ADMIN: DELETE FORM SUBMISSION
====================================================== */
router.delete("/forms/:id", protect, adminOnly, async (req, res) => {
  try {
    const form = await FormSubmission.findById(req.params.id);
    if (!form)
      return res.status(404).json({ ok: false, error: "Not found" });

    await form.deleteOne();
    res.json({ ok: true, message: "Form deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
