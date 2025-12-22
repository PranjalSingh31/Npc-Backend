// backend/routes/forms.js

const express = require("express");
const router = express.Router();
const upload = require('../config/cloudinary');
const FormSubmission = require("../models/FormSubmission");

// ----------------------------
// CREATE FORM SUBMISSION
// ----------------------------
// router.post("/", async (req, res) => {
//   try {
//     const { formType, name, email, phone, payload } = req.body;

//     if (!formType || !payload) {
//       return res.status(400).json({ ok: false, error: "formType & payload required" });
//     }

//     const form = await FormSubmission.create({
//       formType,
//       name,
//       email,
//       phone,
//       payload,
//     });

//     res.json({ ok: true, data: form });
//   } catch (err) {
//     console.error("Form create error:", err);
//     res.status(500).json({ ok: false, error: "Server error" });
//   }
// });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // DEBUG: Logs to see exactly what arrived from the frontend
    console.log("Body Received:", req.body);
    console.log("File Received:", req.file);

    // 2. Destructure fields from req.body
    // Note: When using FormData, everything in 'payload' might arrive as individual strings
    const { formType, name, email, phone } = req.body;

    // 3. Validation
    if (!formType) {
      return res.status(400).json({ ok: false, error: "formType is required" });
    }

    // 4. Extract data for the payload
    // We remove the standard fields to keep the 'payload' clean
    const { ...restOfBody } = req.body;
    
    // 5. Create the record
    const form = await FormSubmission.create({
      formType,
      name,
      email,
      phone,
      // Store the Cloudinary URL in the image field
      image: req.file ? req.file.path : null, 
      // Store any other dynamic form fields here
      payload: restOfBody, 
    });

    res.json({ ok: true, data: form });
  } catch (err) {
    console.error("Form create error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ----------------------------
// GET ALL FORMS
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const forms = await FormSubmission.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: forms });
  } catch (err) {
    console.error("Fetch forms error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ----------------------------
// GET SINGLE FORM BY ID
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const form = await FormSubmission.findById(req.params.id);
    if (!form) return res.status(404).json({ ok: false, error: "Form not found" });

    res.json({ ok: true, data: form });
  } catch (err) {
    console.error("Fetch form error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ----------------------------
// DELETE FORM
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const result = await FormSubmission.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ ok: false, error: "Form not found" });
    }

    res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
