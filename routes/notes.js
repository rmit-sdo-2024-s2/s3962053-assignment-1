const express = require("express");
const router = express.Router();
const Note = require("../models/note");

router.get("/new", (req, res) => {
  res.render("new");
});

router.post("/notes", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    isImportant: req.body.isImportant === "true"
  });
  try {
    await note.save();
    if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
      res.redirect("/"); // Redirect for normal operation
    } else {
      res.status(201).json(note); // Respond with JSON for tests
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/notes/:id/important", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.isImportant = !note.isImportant;
    await note.save();
    res.redirect("/"); // Redirect for normal flow
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
