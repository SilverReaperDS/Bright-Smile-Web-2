const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadRoot = path.join(__dirname, '..', 'uploads');
const galleryDir = path.join(uploadRoot, 'gallery');
fs.mkdirSync(galleryDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, galleryDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safe = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, `${crypto.randomUUID()}${safe}`);
  },
});

function fileFilter(_, file, cb) {
  if (/^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, GIF, or WebP images are allowed'));
}

const limits = { fileSize: 12 * 1024 * 1024 };

const uploadPair = multer({ storage, fileFilter, limits }).fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 },
]);

function runUploadPair(req, res, next) {
  return uploadPair(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
    next();
  });
}

function multipartPair(req, res, next) {
  const ct = req.headers['content-type'] || '';
  if (ct.includes('multipart/form-data')) return runUploadPair(req, res, next);
  next();
}

module.exports = {
  uploadRoot,
  galleryDir,
  multipartPair,
  runUploadPair,
};
