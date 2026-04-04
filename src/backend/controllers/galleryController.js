const Gallery = require('../models/Gallery');

async function getGallery(req, res) {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.json(items);
}

async function addGalleryItem(req, res) {
  const newItem = new Gallery(req.body);
  await newItem.save();
  res.status(201).json(newItem);
}

async function deleteGalleryItem(req, res) {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}

module.exports = { getGallery, addGalleryItem, deleteGalleryItem };