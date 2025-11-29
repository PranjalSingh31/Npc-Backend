// backend/routes/upload.js

const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const multer = require("multer");          // <– REQUIRED TO HANDLE FILE UPLOAD
const upload = multer({ storage: multer.memoryStorage() });
const { protect } = require("../middleware/auth");

// Accept LOGO + MULTIPLE IMAGES using form-data
router.post("/image", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });

    // Convert to Base64 → cloudinary accepts it
    const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(file, {
      folder: "npc_uploads",
    });

    return res.json({ ok: true, url: uploaded.secure_url });

  } catch (err) {
    console.error("UPLOAD ERROR →", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
