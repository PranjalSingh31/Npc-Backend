const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  type: { type: String, required: true },  // franchise, business, investor etc.
  name: String,
  email: String,
  phone: String,
  payload: Object, // stores full submitted form data
}, { timestamps: true });

module.exports = mongoose.model("FormSubmission", FormSchema);
