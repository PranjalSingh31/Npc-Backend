require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// connect DB
connectDB();

// ------------------------------
// 🔥 CREATE ADMIN ON STARTUP
// ------------------------------
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    const email = "Nitish@npcglobal.com";
    const password = "NPC@2025##";

    let admin = await User.findOne({ email });

    if (!admin) {
      const hashed = await bcrypt.hash(password, 10);

      admin = await User.create({
        name: "Admin",
        email,
        password: hashed,
        role: "admin",       // ✅ CORRECT FIELD
      });

      console.log("✔ Admin created:", admin.email);
    } else {
      console.log("✔ Admin already exists:", admin.email);
    }
  } catch (err) {
    console.error("Admin creation error:", err);
  }
}

createAdminUser();

// ------------------------------
// ROUTES
// ------------------------------
app.use('/auth', require('./routes/auth'));
app.use('/forms', require('./routes/forms'));
app.use('/contact', require('./routes/contact'));
app.use('/admin', require('./routes/admin'));
app.use('/payments', require('./routes/payments'));

app.get('/', (req, res) => res.json({ ok: true, message: 'NPC Backend running' }));

// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
