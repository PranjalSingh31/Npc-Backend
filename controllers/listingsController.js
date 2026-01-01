const Listing = require("../models/Listing");

// 👉 GET ALL BY TYPE
exports.getListingsByType = async (req, res) => {
  try {
    const { type } = req.params;

    // 1. Log the incoming request
    console.log(`🚀 [GET REQUEST] Fetching listings for type: ${type}`);

    const ALLOWED = ["franchise", "business", "investor", "blog"];

    // 2. Validate type and warn if it's outside the allowed list
    if (!ALLOWED.includes(type)) {
      console.warn(`⚠️  [INVALID TYPE ACCESS]: User attempted to fetch invalid type: "${type}"`);
      return res.status(400).json({ ok: false, error: "Invalid listing type" });
    }

    const data = await Listing.find({ type }).sort({ createdAt: -1 });

    // 3. Log results count
    console.log(`✅ Found ${data.length} listings for type: ${type}`);
    
    res.json({ ok: true, data });
  } catch (err) {
    // 4. Log the full stack trace for debugging
    console.error("❌ [GET LISTINGS BY TYPE ERROR]:", err);
    res.status(500).json({ ok: false, error: "Error loading listings" });
  }
};

// 👉 GET SINGLE LISTING
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Log the search start
    console.log(`🚀 [GET REQUEST] Searching for listing ID: ${id}`);

    const item = await Listing.findById(id);

    // 2. Handle missing item with a warning
    if (!item) {
      console.warn(`⚠️  [NOT FOUND]: Listing with ID ${id} does not exist in the database.`);
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    // 3. Log successful retrieval
    console.log(`📦 [DATA RETRIEVED]: Successfully loaded listing: "${item.title || item.name}"`);
    
    res.json({ ok: true, data: item });
  } catch (err) {
    // 4. Handle invalid MongoDB ObjectIDs or other server errors
    console.error(`❌ [GET LISTING BY ID ERROR] for ID ${req.params.id}:`, err.message);
    res.status(500).json({ ok: false, error: "Error fetching listing" });
  }
};


// 🆕 CREATE LISTING
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