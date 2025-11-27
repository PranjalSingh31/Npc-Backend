const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["blog", "franchise", "business", "investor"],
    },

    // Blog fields
    title: String,
    content: String,
    images: [String],   // <-- 🔥 multiple images here

    // Franchise / Business fields
    name: String,
    description: String,
    location: String,
    investment: String,
    industry: String,
    roi: String,

    askingPrice: String,
    employees: String,
    revenue: String,

    investmentRange: String,
    industries: String,
    stage: String,
    portfolio: String,

    authorName: String,
    authorEmail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
