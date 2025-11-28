const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    formType: { type: String, required: true },  // blog, franchise, business, investor, incorporation etc.

    name: String,
    email: String,
    phone: String,

    payload: { type: Object, required: true }, // stores entire submitted form object
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormSubmission", FormSchema);
