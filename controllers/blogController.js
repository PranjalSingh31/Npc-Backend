const Blog = require("../models/Blog");

// 📌 Add Blog (Only logged user)
exports.createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const blog = await Blog.create({
      title,
      content,
      image,
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    res.json({ ok: true, blog });
  } catch {
    res.status(500).json({ error: "Blog create failed" });
  }
};

// 📌 Get All Blogs (Public – No Login Required)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json({ ok: true, blogs });
  } catch {
    res.status(500).json({ error: "Cannot load blogs" });
  }
};

// 📌 Delete Blog (Only admin OR blog owner)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });

    if (req.user.role !== "admin" && req.user.email !== blog.authorEmail) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await blog.deleteOne();
    res.json({ ok: true, message: "Blog removed" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};
