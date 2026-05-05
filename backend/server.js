require('dotenv').config({ path: `${__dirname}/.env` });
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, ensureSchema } = require('./db');
const { validatePassword } = require('./utils/validatePassword');
const { normalizePhone, validatePhoneRequired } = require('./utils/validatePhone');
const { verifyToken, JWT_SECRET } = require('./middleware/auth');
const messageRoutes = require('./routes/messages');
const dashboardRoutes = require('./routes/dashboard');
const galleryRoutes = require('./routes/gallery');
const appointmentRoutes = require('./routes/appointments');
const appointmentBookingRoutes = require('./routes/appointmentBooking');
const testimonialsPublicRoutes = require('./routes/testimonialsPublic');
const testimonialsAdminRoutes = require('./routes/testimonialsAdmin');
const usersAdminRoutes = require('./routes/usersAdmin');
const myPortalRoutes = require('./routes/myPortal');
const { swaggerSpec } = require('./swagger');
const { toThreadRoom, toUserRoom } = require('./utils/realtime');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function ensureDb() {
  await pool.query('SELECT 1');
  await ensureSchema();
}

async function start() {
  try {
    await ensureDb();
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
  }
  server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}

app.post('/register', async (req, res) => {
  const { username: rawUsername, email: rawEmail, password, phone: rawPhone } = req.body;
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
      'SELECT id FROM users WHERE lower(username) = $1 OR lower(email) = $2 LIMIT 1',
      [username, email]
    );
    if (dup.rows.length) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const created = await pool.query(
      'INSERT INTO users (username, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, email, phone, hashedPassword]
    );
    if (created.rows.length) {
      await pool.query(
        `INSERT INTO user_activity_logs (actor_id, user_id, action, details)
         VALUES ($1, $2, $3, $4)`,
        [null, created.rows[0].id, 'user_created', `Registered account ${username}`]
      );
    }
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
      'SELECT id, password_hash, role, is_active FROM users WHERE lower(username) = $1',
      [username]
    );
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.is_active) {
      return res.status(403).json({ message: 'Your account is deactivated' });
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
      'SELECT username, email, phone, role, is_active FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    const u = rows[0];
    if (!u.is_active) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }
    res.json({ username: u.username, email: u.email, phone: u.phone || '', role: u.role, isActive: u.is_active });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/my', myPortalRoutes);
app.use('/api/testimonials', testimonialsPublicRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/appointments/book', appointmentBookingRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin/testimonials', testimonialsAdminRoutes);
app.use('/api/admin/users', usersAdminRoutes);

app.use((req, res, next) => {
  if (res.headersSent) return next();
  return res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
});
app.set('io', io);

io.use((socket, next) => {
  const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization || '';
  const token = String(authHeader).startsWith('Bearer ')
    ? String(authHeader).slice(7)
    : String(authHeader);

  if (!token) return next(new Error('Unauthorized'));
  try {
    const user = jwt.verify(token, JWT_SECRET);
    socket.user = user;
    return next();
  } catch {
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  socket.join(toUserRoom(socket.user.id));

  socket.on('thread:join', async (threadId, ack) => {
    try {
      if (!threadId) {
        if (typeof ack === 'function') ack({ ok: false, error: 'threadId is required' });
        return;
      }
      if (socket.user.role === 'admin') {
        socket.join(toThreadRoom(threadId));
        if (typeof ack === 'function') ack({ ok: true });
        return;
      }

      const { rows } = await pool.query(
        'SELECT 1 FROM messages WHERE thread_id = $1 AND user_id = $2 LIMIT 1',
        [threadId, socket.user.id]
      );
      if (!rows.length) {
        if (typeof ack === 'function') ack({ ok: false, error: 'Forbidden' });
        return;
      }
      socket.join(toThreadRoom(threadId));
      if (typeof ack === 'function') ack({ ok: true });
    } catch {
      if (typeof ack === 'function') ack({ ok: false, error: 'Join failed' });
    }
  });

  socket.on('thread:leave', (threadId) => {
    if (!threadId) return;
    socket.leave(toThreadRoom(threadId));
  });
});

start();
