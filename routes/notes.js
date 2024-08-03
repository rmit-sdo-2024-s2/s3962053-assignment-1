const express = require("express");
const router = express.Router();
const Note = require("../models/note");

// Route to show the form to create a new note
router.get("/new", (req, res) => {
  res.render("new");
});

// Create a new note
router.post("/notes", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    isImportant: req.body.isImportant === "true", // Convert checkbox value to boolean
    createdAt: new Date()
  });

  try {
    await note.save(); // Removed `newNote` assignment
    res.redirect("/");
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
