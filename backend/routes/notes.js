const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// GET /api/notes - list user's notes (with optional search ?q=)
router.get('/', auth, async (req, res) => {
  const q = (req.query.q || '').trim();
  const filter = { user: req.user._id };
  if (q) filter.title = { $regex: q, $options: 'i' };
  const notes = await Note.find(filter).sort({ updatedAt: -1 });
  res.json(notes);
});

// POST /api/notes - create
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ user: req.user._id, title, content });
  await note.save();
  res.json(note);
});

// PUT /api/notes/:id - update
router.put('/:id', auth, async (req, res) => {
  const { title, content, tags } = req.body;
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  note.title = title ?? note.title;
  note.content = content ?? note.content;
  note.tags = tags ?? note.tags;
  await note.save();
  res.json(note);
});

// DELETE /api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Deleted' });
});

module.exports = router;
