const jwt = require('jsonwebtoken');
const SECRET_KEY = 'brightsmile-secret-key';
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const USERS_FILE = './users.json';

app.use(cors());
app.use(bodyParser.json());

// Load users
const loadUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Save users
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  saveUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login
app.post('/login', (req, res) => {
 const { username, password } = req.body;
 const users = loadUsers();
 const user = users.find((u) => u.username === username);

 if (!user || !bcrypt.compareSync(password, user.password)) {
 return res.status(401).json({ message: 'Invalid credentials' });
  }
 const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
 res.json({ message: 'Login successful', token });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
