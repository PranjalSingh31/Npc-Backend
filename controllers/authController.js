const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create JWT Token
const signToken = (userId, isAdmin) =>
  jwt.sign(
    { id: userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ------------------------------------------
// REGISTER
// ------------------------------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user"
    });

    const token = signToken(user._id, false);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: false
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ------------------------------------------
// LOGIN
// ------------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.password)
      return res.status(400).json({ error: 'Use Google login for this account' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken(user._id, user.role === "admin");

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.role === "admin"
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ------------------------------------------
// GOOGLE LOGIN  (FOR GOOGLE IDENTITY SERVICES)
// ------------------------------------------
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;   // <-- THIS is what GIS sends

    if (!credential)
      return res.status(400).json({ error: "Missing credential" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        role: "user"
      });
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
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isAdmin: user.role === "admin"
      }
    });
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    return res.status(400).json({ error: "Google login failed" });
  }
};

// ------------------------------------------
// ME
// ------------------------------------------
exports.me = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Not authorized" });

    return res.json({ user: req.user });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
