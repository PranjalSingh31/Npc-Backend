const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");
const { protect } = require("../middleware/auth");

// USER CAN SUBMIT — but only once per form type
router.post("/:formType", protect, async(req,res)=>{
  const exists = await FormSubmission.findOne({user:req.user._id, formType:req.params.formType});
  if(exists) return res.status(400).json({error:"Already submitted"});

  const save = await FormSubmission.create({
    formType:req.params.formType,
    data:req.body,
    user:req.user._id
  });

  res.json(save);
});

// ADMIN ONLY — view all submissions
router.get("/admin/all", protect, async(req,res)=>{
  if(req.user.role!=="admin") return res.status(403).json({error:"Not admin"});
  const subs = await FormSubmission.find().sort({createdAt:-1});
  res.json(subs);
});

module.exports = router;
