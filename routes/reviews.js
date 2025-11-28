const express = require("express");
const Review = require("../models/Review");
const router = express.Router();

router.get("/", async (req,res)=>{
  res.json({ ok:true, reviews: await Review.find().sort({createdAt:-1}) });
});

router.post("/", async (req,res)=>{
  const r = await Review.create(req.body);
  res.json({ok:true, review:r});
});

router.delete("/:id", async(req,res)=>{
  await Review.findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

module.exports = router;
