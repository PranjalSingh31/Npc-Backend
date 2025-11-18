const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyGoogleIdToken } = require('../config/passport');

// Create JWT Token
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

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

    const token = signToken(user._id);

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
    console.error(err);
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

    const token = signToken(user._id);

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
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ------------------------------------------
// GOOGLE LOGIN
// ------------------------------------------
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "idToken required" });

    const payload = await verifyGoogleIdToken(idToken);
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // create new Google user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        role: "user"
      });
    } else {
      // update Google fields
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
      await user.save();
    }

    const token = signToken(user._id);

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
    console.error(err);
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
