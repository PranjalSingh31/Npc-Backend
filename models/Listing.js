const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["blog", "franchise", "business", "investor"], 
    },

    // BLOG SUPPORT (MULTIPLE IMAGES)
    title: String,
    content: String,
    images: [String],    // <-- UPDATED (stores multiple blog images)

    // Franchise & Business
    name: String,
    description: String,
    location: String,
    investment: String,
    industry: String,
    roi: String,

    // Business only
    askingPrice: String,
    employees: String,
    revenue: String,

    // Investor
    investmentRange: String,
    industries: String,
    stage: String,
    portfolio: String,

    // Author Info ↓
    authorName: String,
    authorEmail: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
