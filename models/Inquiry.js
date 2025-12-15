// backend/models/Inquiry.js
const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },

    investorType: String,
    budget: String,
    location: String,

    reason: String,
    message: String,

    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", InquirySchema);
