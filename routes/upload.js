const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/auth");

// Upload Base64 or File Blob
router.post("/image", protect, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) return res.status(400).json({ error: "Image required" });

    const upload = await cloudinary.uploader.upload(image, {
      folder: "npc_uploads",
    });

    res.json({ ok: true, url: upload.secure_url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
