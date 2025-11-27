const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/auth");

// memory storage for quick upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/image", protect, upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, uploadResult) => {
        if (uploadResult) {
          res.json({ ok: true, url: uploadResult.secure_url });
        } else {
          res.status(500).json({ ok: false, error: "Upload failed" });
        }
      }
    ).end(req.file.buffer);

  } catch (err) {
    res.status(500).json({ ok: false, error: "Cloudinary upload error" });
  }
});

module.exports = router;
