require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');
const { verifyToken, JWT_SECRET } = require('./middleware/auth');
const messageRoutes = require('./routes/messages');
const dashboardRoutes = require('./routes/dashboard');
const galleryRoutes = require('./routes/gallery');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

async function ensureDb() {
  await pool.query('SELECT 1');
}

ensureDb()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err.message));

app.post('/register', async (req, res) => {
  const { username: rawUsername, email: rawEmail, password } = req.body;
  const username = rawUsername?.toLowerCase();
  const email = rawEmail?.toLowerCase();
  if (
    !password ||
    password.length < 8 ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include a number and special character',
    });
  }
  try {
    const dup = await pool.query(
      'SELECT id FROM users WHERE lower(username) = $1 OR lower(email) = $2 LIMIT 1',
      [username, email]
    );
    if (dup.rows.length) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { username: rawUsername, password } = req.body;
  const username = rawUsername?.toLowerCase();
  try {
    const { rows } = await pool.query(
      'SELECT id, password_hash, role FROM users WHERE lower(username) = $1',
      [username]
    );
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.get('/me', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT username, role FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    res.json({ username: rows[0].username, role: rows[0].role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/gallery', galleryRoutes);

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
