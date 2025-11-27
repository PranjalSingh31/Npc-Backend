const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// GOOGLE CLIENT (paste this in .env later)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -----------------------------
// 🔥 GOOGLE LOGIN ROUTE
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "No Google Token Sent" });

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;

    // Create or find user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
        role: "user",
        password: "@GoogleAuth",   // dummy for non-password accounts
        googleId: payload.sub
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.role === "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isAdmin: user.role === "admin"
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
});

module.exports = router;
