const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    // TYPE — identifies what this record is
    type: {
      type: String,
      required: true,
      enum: ["blog", "franchise", "business", "investor"],
    },

    /* ----------------------------------------------------------
       BLOG FIELDS
    ---------------------------------------------------------- */
    title: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    // Your DB sometimes stores "image", sometimes "images[]"
    // This keeps BOTH and prevents frontend breakage
    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    /* ----------------------------------------------------------
       FRANCHISE / BUSINESS / INVESTOR FIELDS
    ---------------------------------------------------------- */
    name: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    investment: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    roi: {
      type: String,
      default: "",
    },

    askingPrice: {
      type: String,
      default: "",
    },

    employees: {
      type: String,
      default: "",
    },

    revenue: {
      type: String,
      default: "",
    },

    investmentRange: {
      type: String,
      default: "",
    },

    industries: {
      type: String,
      default: "",
    },

    stage: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    /* ----------------------------------------------------------
       AUTHOR INFO (BLOG OWNER OR ADMIN)
    ---------------------------------------------------------- */
    authorName: {
      type: String,
      default: "",
    },

    authorEmail: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
