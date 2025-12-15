// backend/models/Listing.js
const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["blog", "franchise", "business", "investor"],
    },

    // blog-like fields
    title: { type: String, default: "" },
    content: { type: String, default: "" },

    // keep old names for compatibility
    image: { type: String, default: "" },
    images: { type: [String], default: [] },

    // NEW canonical field used by frontend: logo
    logo: { type: String, default: "" },

    // franchise/business/investor fields
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    investment: { type: String, default: "" },
    industry: { type: String, default: "" },
    roi: { type: String, default: "" },
    askingPrice: { type: String, default: "" },
    employees: { type: String, default: "" },
    revenue: { type: String, default: "" },
    investmentRange: { type: String, default: "" },
    industries: { type: String, default: "" },
    stage: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    // author
    authorName: { type: String, default: "" },
    authorEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
