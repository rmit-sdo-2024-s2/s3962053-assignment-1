const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Note = require("./models/note");
const notesRouter = require("./routes/notes");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort("createdAt"); // Sort by createdAt in ascending order
    res.status(200).render("index", { notes }); // Render the index page with notes
  } catch (err) {
    res.status(500).send(err);
  }
});

// Separate route for JSON response (for testing)
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort("createdAt");
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.use("/", notesRouter);

mongoose.set("strictQuery", true);

if (require.main === module) {
  mongoose.connect(process.env.SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server Has Started");
    });
  }).catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });
}

module.exports = app;
