const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'brightsmile-secret-key';

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

/** If Authorization Bearer is valid patient/staff, sets req.optionalUserId (does not 401 if missing). */
function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'patient' || decoded.role === 'staff') {
      req.optionalUserId = decoded.id;
    }
  } catch {
    /* ignore invalid token for public contact */
  }
  next();
}

function isPatientOrStaff(req, res, next) {
  if (req.user.role === 'admin') {
    return res.status(403).json({ error: 'Use the admin dashboard for clinic tools' });
  }
  next();
}

module.exports = { verifyToken, isAdmin, optionalAuth, isPatientOrStaff, JWT_SECRET };
