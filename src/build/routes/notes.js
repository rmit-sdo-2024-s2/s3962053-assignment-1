const express = require("express");
const router = express.Router();
const Note = require("../models/note");

// Existing HTML/JSON hybrid route
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).render("index", { notes });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Dedicated JSON route for testing
router.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes); // Always respond with JSON
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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
        res.status(302).redirect("/");
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.post("/notes/:id/important", async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        note.isImportant = !note.isImportant;
        await note.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
