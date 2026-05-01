require("dotenv").config({ path: `${__dirname}/.env` });
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool, ensureSchema } = require("./db");
const { validatePassword } = require("./utils/validatePassword");
const {
  normalizePhone,
  validatePhoneRequired,
} = require("./utils/validatePhone");
const { verifyToken, JWT_SECRET } = require("./middleware/auth");
const messageRoutes = require("./routes/messages");
const dashboardRoutes = require("./routes/dashboard");
const galleryRoutes = require("./routes/gallery");
const appointmentRoutes = require("./routes/appointments");
const appointmentBookingRoutes = require("./routes/appointmentBooking");
const testimonialsPublicRoutes = require("./routes/testimonialsPublic");
const testimonialsAdminRoutes = require("./routes/testimonialsAdmin");
const usersAdminRoutes = require("./routes/usersAdmin");
const myPortalRoutes = require("./routes/myPortal");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function ensureDb() {
  await pool.query("SELECT 1");
  await ensureSchema();
}

async function start() {
  try {
    await ensureDb();
    console.log("✅ PostgreSQL connected");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  }
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`),
  );
}

app.post("/register", async (req, res) => {
  const {
    username: rawUsername,
    email: rawEmail,
    password,
    phone: rawPhone,
  } = req.body;
  const username = rawUsername?.toLowerCase();
  const email = rawEmail?.toLowerCase();
  const phone = normalizePhone(rawPhone);
  const pwdMsg = validatePassword(password);
  if (pwdMsg) {
    return res.status(400).json({ message: pwdMsg });
  }
  const phoneMsg = validatePhoneRequired(phone);
  if (phoneMsg) {
    return res.status(400).json({ message: phoneMsg });
  }
  try {
    const dup = await pool.query(
      "SELECT id FROM users WHERE lower(username) = $1 OR lower(email) = $2 LIMIT 1",
      [username, email],
    );
    if (dup.rows.length) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query(
      "INSERT INTO users (username, email, phone, password_hash) VALUES ($1, $2, $3, $4)",
      [username, email, phone, hashedPassword],
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});
app.post("/login", async (req, res) => {
  const { username: rawUsername, password } = req.body;
  const username = rawUsername?.toLowerCase();

  try {
    const { rows } = await pool.query(
      "SELECT id, password_hash, role, is_active FROM users WHERE lower(username) = $1",
      [username],
    );

    const user = rows[0];

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.is_active === false) {
      return res.status(403).json({ message: "Your account is deactivated" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});
app.get("/me", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT username, email, phone, role FROM users WHERE id = $1",
      [req.user.id],
    );
    if (!rows.length) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    const u = rows[0];
    res.json({
      username: u.username,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/my", myPortalRoutes);
app.use("/api/testimonials", testimonialsPublicRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/appointments/book", appointmentBookingRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin/testimonials", testimonialsAdminRoutes);
app.use("/api/admin/users", usersAdminRoutes);

start();
