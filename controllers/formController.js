const FormSubmission = require('../models/FormSubmission');

exports.createSubmission = async (req, res) => {
  try {
    const { formType } = req.params;
    const payload = req.body;
    const submission = await FormSubmission.create({ formType, payload, user: req.user._id });
    res.json({ ok: true, submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save submission' });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const { formType } = req.params;
    const subs = await FormSubmission.find({ formType, user: req.user._id }).sort({ createdAt: -1 });
    res.json({ ok: true, submissions: subs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch submissions' });
  }
};
