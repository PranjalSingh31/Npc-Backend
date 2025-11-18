const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = await Contact.create({ name, email, phone, message });
    res.json({ ok: true, contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save contact' });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ receivedAt: -1 });
    res.json({ ok: true, contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch contacts' });
  }
};
