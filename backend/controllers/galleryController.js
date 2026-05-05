const fs = require('fs');
const path = require('path');
const { pool } = require('../db');
const { uploadRoot } = require('../middleware/galleryUpload');

function fileUrlFromFilename(filename) {
  if (!filename) return null;
  return `/uploads/gallery/${filename}`;
}

function rowToCase(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    patientUserId: row.patient_user_id || null,
    beforeImageUrl: row.before_image_url,
    afterImageUrl: row.after_image_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function tryUnlinkStoredUrl(urlPath) {
  if (!urlPath || typeof urlPath !== 'string') return;
  if (!urlPath.startsWith('/uploads/gallery/')) return;
  const rel = urlPath.slice('/uploads/'.length);
  const full = path.resolve(path.join(uploadRoot, rel));
  const rootResolved = path.resolve(uploadRoot);
  if (!full.startsWith(rootResolved + path.sep) && full !== rootResolved) return;
  fs.unlink(full, () => {});
}

async function getGallery(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, description, category, patient_user_id, before_image_url, after_image_url, sort_order, created_at
       FROM gallery_cases
       ORDER BY sort_order ASC, created_at DESC`
    );
    res.json(rows.map(rowToCase));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
}

function readPairFromFiles(req) {
  const beforeF = req.files?.beforeImage?.[0];
  const afterF = req.files?.afterImage?.[0];
  return {
    beforeUrl: beforeF ? fileUrlFromFilename(beforeF.filename) : null,
    afterUrl: afterF ? fileUrlFromFilename(afterF.filename) : null,
  };
}

async function createCase(req, res) {
  const isMultipart = !!(req.files?.beforeImage?.[0] || req.files?.afterImage?.[0]);
  let beforeUrl;
  let afterUrl;
  let title;
  let description;
  let category;
  let patientUserId;

  if (isMultipart) {
    const pair = readPairFromFiles(req);
    beforeUrl = pair.beforeUrl;
    afterUrl = pair.afterUrl;
    title = req.body?.title;
    description = req.body?.description;
    category = req.body?.category;
    patientUserId = req.body?.patientUserId;
    if (!beforeUrl || !afterUrl) {
      tryUnlinkStoredUrl(beforeUrl);
      tryUnlinkStoredUrl(afterUrl);
      return res.status(400).json({ error: 'Select both a before and an after image (exactly two files).' });
    }
  } else {
    const body = req.body || {};
    beforeUrl = body.beforeImageUrl ? String(body.beforeImageUrl).trim() : null;
    afterUrl = body.afterImageUrl ? String(body.afterImageUrl).trim() : null;
    title = body.title;
    description = body.description;
    category = body.category;
    patientUserId = body.patientUserId;
  }

  if (!beforeUrl || !afterUrl) {
    return res.status(400).json({
      error: 'Both before and after images are required (upload two files or provide beforeImageUrl and afterImageUrl).',
    });
  }

  try {
    let patientId = null;
    if (patientUserId !== undefined && patientUserId !== null && String(patientUserId).trim() !== '') {
      patientId = String(patientUserId).trim();
      const patientCheck = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND role = 'patient' LIMIT 1",
        [patientId]
      );
      if (!patientCheck.rows.length) {
        if (isMultipart) {
          tryUnlinkStoredUrl(beforeUrl);
          tryUnlinkStoredUrl(afterUrl);
        }
        return res.status(400).json({ error: 'Invalid patient selected' });
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO gallery_cases (title, description, category, patient_user_id, before_image_url, after_image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM gallery_cases gc))
       RETURNING id, title, description, category, patient_user_id, before_image_url, after_image_url, sort_order, created_at`,
      [title ?? null, description ?? null, category ?? null, patientId, beforeUrl, afterUrl]
    );
    res.status(201).json(rowToCase(rows[0]));
  } catch (err) {
    console.error(err);
    if (isMultipart) {
      tryUnlinkStoredUrl(beforeUrl);
      tryUnlinkStoredUrl(afterUrl);
    }
    res.status(400).json({ error: 'Failed to create gallery case' });
  }
}

async function updateCase(req, res) {
  const id = req.params.id;
  const isMultipart = req.files && (req.files.beforeImage?.[0] || req.files.afterImage?.[0]);

  let title;
  let description;
  let category;
  let beforeUrl;
  let afterUrl;
  let patientUserId;

  if (isMultipart) {
    title = req.body?.title;
    description = req.body?.description;
    category = req.body?.category;
    if (req.body?.beforeImageUrl !== undefined) beforeUrl = req.body.beforeImageUrl;
    if (req.body?.afterImageUrl !== undefined) afterUrl = req.body.afterImageUrl;
    if (req.body?.patientUserId !== undefined) patientUserId = req.body.patientUserId;
  } else {
    const body = req.body || {};
    title = body.title;
    description = body.description;
    category = body.category;
    beforeUrl = body.beforeImageUrl;
    afterUrl = body.afterImageUrl;
    patientUserId = body.patientUserId;
  }

  const pair = readPairFromFiles(req);
  if (pair.beforeUrl) beforeUrl = pair.beforeUrl;
  if (pair.afterUrl) afterUrl = pair.afterUrl;

  if (beforeUrl !== undefined && (beforeUrl === null || (typeof beforeUrl === 'string' && !beforeUrl.trim()))) {
    if (pair.beforeUrl) tryUnlinkStoredUrl(pair.beforeUrl);
    return res.status(400).json({ error: 'before image URL cannot be empty' });
  }

  const sets = [];
  const values = [];
  let n = 1;

  if (title !== undefined) {
    sets.push(`title = $${n++}`);
    values.push(title);
  }
  if (description !== undefined) {
    sets.push(`description = $${n++}`);
    values.push(description);
  }
  if (category !== undefined) {
    sets.push(`category = $${n++}`);
    values.push(category);
  }
  if (patientUserId !== undefined) {
    const trimmed = patientUserId == null ? "" : String(patientUserId).trim();
    if (!trimmed) {
      sets.push(`patient_user_id = NULL`);
    } else {
      const patientCheck = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND role = 'patient' LIMIT 1",
        [trimmed]
      );
      if (!patientCheck.rows.length) {
        if (pair.beforeUrl) tryUnlinkStoredUrl(pair.beforeUrl);
        if (pair.afterUrl) tryUnlinkStoredUrl(pair.afterUrl);
        return res.status(400).json({ error: 'Invalid patient selected' });
      }
      sets.push(`patient_user_id = $${n++}`);
      values.push(trimmed);
    }
  }
  if (beforeUrl !== undefined) {
    sets.push(`before_image_url = $${n++}`);
    values.push(beforeUrl);
  }
  if (afterUrl !== undefined) {
    sets.push(`after_image_url = $${n++}`);
    values.push(afterUrl === '' || afterUrl === null ? null : afterUrl);
  }

  if (!sets.length) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const prev = await client.query(
      'SELECT before_image_url, after_image_url FROM gallery_cases WHERE id = $1',
      [id]
    );
    if (!prev.rows.length) {
      await client.query('ROLLBACK');
      if (pair.beforeUrl) tryUnlinkStoredUrl(pair.beforeUrl);
      if (pair.afterUrl) tryUnlinkStoredUrl(pair.afterUrl);
      return res.status(404).json({ error: 'Not found' });
    }

    const oldBefore = prev.rows[0].before_image_url;
    const oldAfter = prev.rows[0].after_image_url;

    const { rows } = await client.query(
      `UPDATE gallery_cases SET ${sets.join(', ')}
       WHERE id = $${n}
       RETURNING id, title, description, category, patient_user_id, before_image_url, after_image_url, sort_order, created_at`,
      values
    );
    await client.query('COMMIT');

    if (pair.beforeUrl && oldBefore && oldBefore !== pair.beforeUrl) tryUnlinkStoredUrl(oldBefore);
    if (pair.afterUrl && oldAfter && oldAfter !== pair.afterUrl) tryUnlinkStoredUrl(oldAfter);

    res.json(rowToCase(rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    if (pair.beforeUrl) tryUnlinkStoredUrl(pair.beforeUrl);
    if (pair.afterUrl) tryUnlinkStoredUrl(pair.afterUrl);
    console.error(err);
    res.status(400).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
}

async function reorderGallery(req, res) {
  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return res.status(400).json({ error: 'orderedIds (non-empty array) required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < orderedIds.length; i += 1) {
      const { rowCount } = await client.query('UPDATE gallery_cases SET sort_order = $1 WHERE id = $2', [
        i,
        orderedIds[i],
      ]);
      if (!rowCount) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Invalid gallery case id: ${orderedIds[i]}` });
      }
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Reorder failed' });
  } finally {
    client.release();
  }
}

async function deleteCase(req, res) {
  const id = req.params.id;
  try {
    const { rows } = await pool.query(
      'SELECT before_image_url, after_image_url FROM gallery_cases WHERE id = $1',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const { before_image_url: b, after_image_url: a } = rows[0];
    await pool.query('DELETE FROM gallery_cases WHERE id = $1', [id]);
    tryUnlinkStoredUrl(b);
    tryUnlinkStoredUrl(a);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete gallery case' });
  }
}

module.exports = {
  getGallery,
  createCase,
  updateCase,
  reorderGallery,
  deleteCase,
};
