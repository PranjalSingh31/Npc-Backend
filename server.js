require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");

const app = express();

// ──────────────────────────────────────────
// 🚀 CORS (Vercel + Domain + Google Login Support)
// ──────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "https://npcglobal.in",
  "https://www.npcglobal.in",
  "https://npc-frontend.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin))
      return callback(new Error("CORS blocked"), false);
    return callback(null, true);
  },
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
}));

app.options("*", cors()); 

// ──────────────────────────────────────────
// JSON & Body Parser
// ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ──────────────────────────────────────────
// Connect DB
// ──────────────────────────────────────────
connectDB();

// ──────────────────────────────────────────
// 🔥 Auto Create Admin One-Time
// ──────────────────────────────────────────
const User = require("./models/User");
async function createAdminUser() {
  const adminEmail = "Nitish@npcglobal.com";
  const password = "NPC@2025##";
  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash(password, 10),
      role: "admin"
    });
    console.log(`✔ Admin Created → ${adminEmail}`);
  } else {
    console.log(`✔ Admin Exists → ${adminEmail}`);
  }
}
createAdminUser();

// ──────────────────────────────────────────
// ROUTES
// ──────────────────────────────────────────
app.use("/auth", require("./routes/auth"));
app.use("/auth/google", require("./routes/googleAuth"));  // SINGLE Google Auth Route

app.use("/forms", require("./routes/forms"));
app.use("/contact", require("./routes/contact"));
app.use("/admin", require("./routes/admin"));
app.use("/payments", require("./routes/payments"));
app.use("/listings", require("./routes/listings")); // <── BLOG/FRANCHISE/BUSINESS/INVESTOR
app.use("/upload", require("./routes/upload"));
app.use("/blog", require("./routes/blog"));


// ──────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ ok: true, message: "NPC Backend Running 🔥" });
});

// ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server LIVE → PORT ${PORT}`));
