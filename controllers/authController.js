const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create Token
const signToken = (userId, isAdmin) =>
  jwt.sign(
    { id: userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

/* ============================================================
   REGISTER
==============================================================*/
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed, role: "user" });
    const token = signToken(user._id, false);

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: false }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


/* ============================================================
   LOGIN — FIXED
==============================================================*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.password)
      return res.status(400).json({ error: "Use Google Login for this account" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect password" });

    const token = signToken(user._id, user.role === "admin");

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.role === "admin"
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


/* ============================================================
   GOOGLE LOGIN — FIXED (expects credential)
==============================================================*/
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // 🔥 Fixed (was idToken before)

    if (!credential)
      return res.status(400).json({ error: "Missing login token" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, googleId, avatar: picture, role: "user" });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
      await user.save();
    }

    const token = signToken(user._id, user.role === "admin");

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.role === "admin"
      }
    });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    return res.status(400).json({ error: "Google login failed" });
  }
};


/* ============================================================
   ME
==============================================================*/
exports.me = async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
