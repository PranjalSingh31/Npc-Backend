// backend/routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// TEMP upload folder
const upload = multer({ dest: "uploads/" });

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/*
--------------------------------------------------
 POST /upload/image
 Handles image upload and returns direct URL
--------------------------------------------------
*/
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    const tempPath = req.file.path;
    const ext = path.extname(req.file.originalname);
    const finalName = req.file.filename + ext;
    const finalPath = path.join("uploads", finalName);

    // Rename temp file → final file
    fs.renameSync(tempPath, finalPath);

    // Production (Render) or Localhost base URL
    const base =
      process.env.BASE_URL ||
      (process.env.RENDER_EXTERNAL_URL
        ? process.env.RENDER_EXTERNAL_URL
        : "http://localhost:5000");

    const fileUrl = `${base}/uploads/${finalName}`;

    return res.json({
      ok: true,
      url: fileUrl,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Image upload failed" });
  }
});

module.exports = router;
