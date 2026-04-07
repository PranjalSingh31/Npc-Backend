require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

/* ======================================================
   CORS
====================================================== */
const allowedOrigins = [
  "http://localhost:3000",
  "https://npcglobal.in",
  "https://www.npcglobal.in",
  "https://npc-frontend.vercel.app"
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (!allowedOrigins.includes(origin)) return cb(new Error("CORS blocked"), false);
      return cb(null, true);
    },
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.options("*", cors());

/* ======================================================
   JSON PARSER
====================================================== */
app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

/* ======================================================
   DB CONNECT
====================================================== */
connectDB();

/* ======================================================
   AUTO CREATE ADMIN
====================================================== */
const User = require("./models/User");
async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !password) {
    console.log("ℹ️ Admin bootstrap skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to enable).");
    return;
  }

  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash(password, 10),
      role: "admin",
    });
    console.log("✔ Admin Created:", adminEmail);
  } else {
    console.log("✔ Admin Exists:", adminEmail);
  }
}
if (process.env.AUTO_CREATE_ADMIN === "true") {
  createAdmin();
}

/* ======================================================
   STATIC FILES
====================================================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

/* ======================================================
   ROUTES (FINAL ORDER)
====================================================== */

// AUTH
app.use("/auth", require("./routes/auth"));

// MAIN APP ROUTES
app.use("/api/blog", require("./routes/blog"));
app.use("/contact", require("./routes/contact"));
app.use("/admin", require("./routes/admin"));
app.use("/payments", require("./routes/payments"));

app.use("/listings", require("./routes/listings"));
app.use("/upload", require("./routes/upload"));

/* ======================================================
   SERVICE FORMS (Unified System)
====================================================== */
app.use("/forms", require("./routes/forms"));

/* ======================================================
   OPTIONAL — REMOVE IF NOT NEEDED
   Inquiries old file ("formss.js") should NOT be used anymore.
   But if you want to keep it temporarily:
====================================================== */



/* ======================================================
   SERVER STATUS
====================================================== */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "NPC Backend Running 🔥" });
});

/* ======================================================
   START SERVER
====================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🔥 Server LIVE → ${PORT}`));
