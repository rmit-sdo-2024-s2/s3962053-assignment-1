const express = require("express");
const router = express.Router();
const Note = require("../models/note");

router.get("/new", (req, res) => {
  res.render("new");
});

router.post("/notes", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content
  });
  try {
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
