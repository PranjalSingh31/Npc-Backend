const FormSubmission = require('../models/FormSubmission');

// ✅ Create submission (Blog, Franchise, Business, Investor, Review, etc.)
exports.createSubmission = async (req, res) => {
  try {
    const { formType } = req.params;
    const payload = req.body;

    const submission = await FormSubmission.create({
      formType,
      payload,
      user: req.user ? req.user._id : null,
    });

    res.json({ ok: true, submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save submission' });
  }
};

// ✅ Get ALL submissions for a formType (GLOBAL — no login required)
exports.getAllSubmissions = async (req, res) => {
  try {
    const { formType } = req.params;

    const subs = await FormSubmission
      .find({ formType })
      .sort({ createdAt: -1 });

    res.json({ ok: true, submissions: subs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch submissions' });
  }
};

// ✅ Admin only: delete by ID
exports.deleteSubmission = async (req, res) => {
  try {
    await FormSubmission.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot delete' });
  }
};
