require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();

// ------------------------------
// ✅ FIXED CORS (THIS IS THE MAIN ISSUE)
// ------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://npcglobal.in",
  "https://www.npcglobal.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps / curl / postman
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        console.log("❌ CORS BLOCKED:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }

      return callback(null, true);
    },
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

// Allow OPTIONS for all routes
app.options("*", cors());

// Parse JSON BEFORE routes (important)
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect DB
connectDB();

// ------------------------------
// 🔥 AUTO CREATE ADMIN
// ------------------------------
const User = require("./models/User");
const bcrypt = require("bcryptjs");

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
        role: "admin",
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
app.use("/auth", require("./routes/auth"));
app.use("/forms", require("./routes/forms"));
app.use("/contact", require("./routes/contact"));
app.use("/admin", require("./routes/admin"));
app.use("/payments", require("./routes/payments"));

app.get("/", (req, res) =>
  res.json({ ok: true, message: "NPC Backend running" })
);

// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Server started and running on port ${PORT}`)
);
