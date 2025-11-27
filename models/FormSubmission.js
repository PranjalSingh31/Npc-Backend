const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  formType: { type:String, required:true },   // business / investor / franchise etc
  data: Object,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps:true });

module.exports = mongoose.model("FormSubmission", FormSchema);
