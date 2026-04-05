const { pool } = require('../db');

function rowToItem(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    createdAt: row.created_at,
  };
}

async function getGallery(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, description, image_url, category, created_at FROM gallery_items ORDER BY created_at DESC'
    );
    res.json(rows.map(rowToItem));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
}

async function addGalleryItem(req, res) {
  const { title, description, imageUrl, category } = req.body || {};
  try {
    const { rows } = await pool.query(
      `INSERT INTO gallery_items (title, description, image_url, category)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, image_url, category, created_at`,
      [title ?? null, description ?? null, imageUrl ?? null, category ?? null]
    );
    res.status(201).json(rowToItem(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to add gallery item' });
  }
}

async function deleteGalleryItem(req, res) {
  try {
    const { rowCount } = await pool.query('DELETE FROM gallery_items WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
}

module.exports = { getGallery, addGalleryItem, deleteGalleryItem };
