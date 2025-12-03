// backend/routes/upload.js
const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { protect } = require("../middleware/auth");

/**
 * POST /upload/image
 * Accepts single file (form-data name: "file")
 * Returns: { ok: true, url, public_id }
 */
router.post("/image", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: "No file received" });

    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(file, {
      folder: "npc_uploads",
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });

    // uploaded.secure_url is a full https URL — frontend can use it directly
    return res.json({ ok: true, url: uploaded.secure_url, public_id: uploaded.public_id });
  } catch (err) {
    console.error("UPLOAD ERROR →", err);
    return res.status(500).json({ ok: false, error: "Upload failed" });
  }
});

module.exports = router;
