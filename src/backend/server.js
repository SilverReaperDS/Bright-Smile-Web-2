require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const messageRoutes = require('./routes/messages');
const { verifyToken } = require('./middleware/auth');
const dashboardRoutes = require('./routes/dashboard');
const User = require('./models/User');

const app = express();
const SECRET_KEY = process.env.JWT_SECRET || 'brightsmile-secret-key';
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Register
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
    return res.status(400).json({ message: 'Password must be at least 8 characters and include a number and special character' });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username: rawUsername, password } = req.body;
  const username = rawUsername?.toLowerCase();
  try {
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});
// Me
app.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    res.json({ username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
