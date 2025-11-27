const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["blog", "franchise", "business", "investor"], // 🔥 all types supported
    },

    // Common Fields
    title: String,         // blog only
    content: String,       // blog only
    image: String,         // optional for all

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

    // Author Info
    authorName: String,
    authorEmail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
