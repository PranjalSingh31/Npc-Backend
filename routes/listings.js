const express = require("express");
const router = express.Router();
const listingCtrl = require("../controllers/listingsController");
const { protect } = require("../middleware/auth");
const upload = require('../config/cloudinary'); // Don't forget this!

// Use the controller functions
// router.get('/test', listingCtrl.testEndpoint);
// router.post("/:type", protect, upload.single("image"), listingCtrl.createListing);
router.post("/:type", protect, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("--- Multer/Cloudinary Error ---");
      console.error(err); // This will show the specific Cloudinary API error
      return res.status(400).json({ 
        success: false, 
        message: "Upload failed", 
        error: err.message 
      });
    }
    next();
  });
}, listingCtrl.createListing);
// router.post("/:type", protect,listingCtrl.createListing);
router.get("/:type", listingCtrl.getListingsByType);
router.delete("/:type/:id", protect, listingCtrl.deleteListing);
module.exports = router;


// // backend/routes/listings.js
// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/Listing");
// const { protect } = require("../middleware/auth");

// // Helper: allowed types
// const ALLOWED = ["franchise", "business", "investor", "blog"];

// /* GET /listings/:type  — list by type */
// router.get("/:type", async (req, res) => {
//   try {
//     const { type } = req.params;
//     if (!ALLOWED.includes(type)) return res.status(400).json({ ok: false, error: "Invalid type" });

//     const items = await Listing.find({ type }).sort({ createdAt: -1 });
//     return res.json({ ok: true, data: items });
//   } catch (err) {
//     console.error("GET /listings/:type error:", err);
//     return res.status(500).json({ ok: false, error: "Failed to fetch listings" });
//   }
// });

// /* GET /listings/:type/:id  — single item */
// router.get("/:type/:id", async (req, res) => {
//   try {
//     const { type, id } = req.params;
//     if (!ALLOWED.includes(type)) return res.status(400).json({ ok: false, error: "Invalid type" });

//     const item = await Listing.findById(id);
//     if (!item) return res.status(404).json({ ok: false, error: "Not found" });
//     if (item.type !== type) return res.status(400).json({ ok: false, error: "Type mismatch" });

//     return res.json({ ok: true, data: item });
//   } catch (err) {
//     console.error("GET /listings/:type/:id error:", err);
//     return res.status(500).json({ ok: false, error: "Failed to fetch listing" });
//   }
// });

// // /* POST /listings/:type — create (protected) */
// // router.post("/:type", protect, async (req, res) => {
// //   try {
// //     const { type } = req.params;
// //     if (!ALLOWED.includes(type)) return res.status(400).json({ ok: false, error: "Invalid type" });

// //     const payload = { ...req.body, type, authorEmail: req.user.email || "" };
// //     const listing = await Listing.create(payload);

// //     return res.json({ ok: true, listing });
// //   } catch (err) {
// //     console.error("POST /listings/:type error:", err);
// //     return res.status(500).json({ ok: false, error: "Creation failed" });
// //   }
// // });

// /* POST /listings/:type — create (protected + Image Upload) */
// router.post("/:type", protect, upload.single("image"), async (req, res) => {
//   try {
//     const { type } = req.params;
    
//     // Validate type
//     if (!ALLOWED.includes(type)) {
//       return res.status(400).json({ ok: false, error: "Invalid type" });
//     }

//     // 3. Construct payload with text fields + file URL
//     const payload = { 
//       ...req.body, 
//       type, 
//       authorName: req.user.name, // Added back authorName
//       authorEmail: req.user.email || "" 
//     };

//     // 4. If Cloudinary uploaded a file, store the URL
//     if (req.file) {
//       payload.image = req.file.path; 
//     }

//     const listing = await Listing.create(payload);

//     return res.json({ ok: true, listing });
//   } catch (err) {
//     console.error("POST /listings/:type error:", err);
//     return res.status(500).json({ ok: false, error: "Creation failed" });
//   }
// });


// /* DELETE /listings/:type/:id — delete (protected: admin or owner) */
// router.delete("/:type/:id", protect, async (req, res) => {
//   try {
//     const { type, id } = req.params;
//     if (!ALLOWED.includes(type)) return res.status(400).json({ ok: false, error: "Invalid type" });

//     const item = await Listing.findById(id);
//     if (!item) return res.status(404).json({ ok: false, error: "Not found" });
//     if (item.type !== type) return res.status(400).json({ ok: false, error: "Type mismatch" });

//     if (req.user.role !== "admin" && req.user.email !== item.authorEmail) {
//       return res.status(403).json({ ok: false, error: "Not allowed" });
//     }

//     await item.deleteOne();
//     return res.json({ ok: true });
//   } catch (err) {
//     console.error("DELETE /listings/:type/:id error:", err);
//     return res.status(500).json({ ok: false, error: "Delete failed" });
//   }
// });

// module.exports = router;
