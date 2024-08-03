const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort('-createdAt');
    res.json(notes); // Ensure the response is JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post('/notes', async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote); // Ensure the response is JSON and status is 201
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
