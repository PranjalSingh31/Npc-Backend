const FormSubmission = require('../models/FormSubmission');

exports.listAllForms = async (req, res) => {
  try {
    const { page = 1, limit = 20, formType } = req.query;
    const filter = formType ? { formType } : {};
    const forms = await FormSubmission.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit));
    const total = await FormSubmission.countDocuments(filter);
    res.json({ ok: true, forms, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch forms' });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await FormSubmission.findById(req.params.id).populate('user', 'name email');
    if (!form) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateFormStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const form = await FormSubmission.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ ok: true, form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    await FormSubmission.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
