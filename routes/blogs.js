const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const blogController = require("../controllers/blogController");

// Public
router.get("/", blogController.getAllBlogs);

// Only logged user can post
router.post("/", protect, blogController.createBlog);

// Admin/Author only can delete
router.delete("/:id", protect, blogController.deleteBlog);

module.exports = router;
