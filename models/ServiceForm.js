const mongoose = require("mongoose");

const ServiceFormSchema = new mongoose.Schema({
  serviceType: String,
  name: String,
  email: String,
  phone: String,
  details: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceForm", ServiceFormSchema);
