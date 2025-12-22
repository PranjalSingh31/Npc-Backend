const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    formType: { type: String, required: true },  

    name: String,
    email: String,
    phone: String,

    payload: { type: Object, required: true }, 
  },
  { timestamps: true }
);

// 🔥 FIX — prevent OverwriteModelError
module.exports =
  mongoose.models.FormSubmission ||
  mongoose.model("FormSubmission", FormSchema);
