const express = require("express");
const router = express.Router();
const listingCtrl = require("../controllers/listingsController");
const { protect } = require("../middleware/auth");
const upload = require("../config/cloudinary");

router.post("/:type", protect, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("--- Multer/Cloudinary Error ---");
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Upload failed",
        error: err.message,
      });
    }
    next();
  });
}, listingCtrl.createListing);

router.get("/:type/:id", listingCtrl.getListingById);
router.get("/:type", listingCtrl.getListingsByType);
router.delete("/:type/:id", protect, listingCtrl.deleteListing);

module.exports = router;
