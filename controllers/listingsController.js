const Listing = require("../models/Listing");

// 👉 GET ALL BY TYPE
exports.getListingsByType = async (req, res) => {
  try {
    const { type } = req.params;
    // print the type for debugging
    // console.log("Fetching listings of type:", type);
    const ALLOWED = ["franchise", "business", "investor", "blog"];

    if (!ALLOWED.includes(type)) {
      return res.status(400).json({ ok: false, error: "Invalid listing type" });
    }

    const data = await Listing.find({ type }).sort({ createdAt: -1 });
    res.json({ ok: true, data });
  } catch (err) {
    console.error("GET Listings Error:", err);
    res.status(500).json({ ok: false, error: "Error loading listings" });
  }
};

// exports.testEndpoint = async (req, res) => {
//   console.log("Test endpoint hit");
//   res.json({ ok: true, message: "Test endpoint is working!" });
// }

// 👉 GET SINGLE LISTING
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Listing.findById(id);

    if (!item) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: item });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error fetching listing" });
  }
};

// ✍️ CREATE LISTING
// exports.createListing = async (req, res) => {
//   try {
//     // Log the incoming request
//     // console.log(`[CREATE LISTING] User: ${req.user.email} | Type: ${req.params.type} | Time: ${new Date().toISOString()}`);

//     // res.status(400).json({ ok: false, error: "Testing it now" });
//     // return;

//     const { type } = req.params;
    
//     // Spread req.body and add system-generated fields
//     const listingData = {
//       ...req.body,
//       type,
//       authorName: req.user.name,
//       authorEmail: req.user.email,
//     };

//     // If Cloudinary middleware processed an image, add the URL
//     if (req.file) {
//       listingData.image = req.file.path; 
//     }

//     const listing = await Listing.create(listingData);
//     res.status(201).json({ ok: true, listing });
//   } catch (err) {
//     console.error("Create Listing Error:", err);
//     res.status(500).json({ ok: false, error: "Error creating listing" });
//   }
// };

exports.createListing = async (req, res) => {
  try {
    // 1. Initial Request Log
    console.log("--------------------------------------------------");
    console.log(`🚀 [NEW REQUEST] Type: ${req.params.type}`);
    console.log(`👤 User: ${req.user.email} (${req.user.name})`);

    // 2. Log Text Data (req.body)
    // Note: If this is empty, your frontend is likely not appending to FormData correctly
    console.log("📝 Body Data:", req.body);

    // 3. Log File Data (req.file)
    // This confirms if your Multer/Cloudinary middleware successfully caught the image
    if (req.file) {
      console.log("🖼️  File Received:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path, // Cloudinary URL
        size: req.file.size
      });
    } else {
      console.warn("⚠️  No file/image found in request");
    }

    const { type } = req.params;
    
    const listingData = {
      ...req.body,
      type,
      authorName: req.user.name,
      authorEmail: req.user.email,
    };

    if (req.file) {
      listingData.image = req.file.path; 
    }

    // 4. Log the final object before DB insertion
    console.log("💾 Final Listing Object for DB:", listingData);

    const listing = await Listing.create(listingData);

    console.log("✅ Successfully created in DB with ID:", listing._id);
    console.log("--------------------------------------------------");

    res.status(201).json({ ok: true, data:listing });
  } catch (err) {
    console.error("❌ [CREATE LISTING ERROR]:", err);
    res.status(500).json({ ok: false, error: "Error creating listing" });
  }
};

// 🗑 DELETE LISTING
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Listing.findById(id);

    if (!item) {
      return res.status(404).json({ ok: false, error: "Listing not found" });
    }

    // Authorization: Check if user is the author OR an admin
    const isAuthor = req.user.email === item.authorEmail;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ ok: false, error: "Not authorized to delete this" });
    }

    await item.deleteOne();
    res.json({ ok: true, message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete Listing Error:", err);
    res.status(500).json({ ok: false, error: "Error deleting listing" });
  }
};