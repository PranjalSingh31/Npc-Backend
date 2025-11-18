const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "Nitish@npcglobal.com" });

    if (existing) {
      return res.json({ ok: true, message: "Admin already exists", admin: existing });
    }

    const hashed = await bcrypt.hash("NPC@2025##", 10);

    const admin = await User.create({
      name: "Admin",
      email: "Nitish@npcglobal.com",
      password: hashed,
      role: "admin",
    });

    res.json({ ok: true, message: "Admin created", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating admin" });
  }
});

module.exports = router;
