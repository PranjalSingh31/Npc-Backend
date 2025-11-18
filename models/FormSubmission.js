const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  formType: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['new','reviewed','approved','rejected'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('FormSubmission', submissionSchema);
