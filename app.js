const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Note = require("./models/note");
const notesRouter = require("./routes/notes");
const methodOverride = require("method-override");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort("createdAt"); // Sort by createdAt in ascending order
    res.status(200).json(notes); // Ensure notes are returned as JSON
  } catch (err) {
    res.status(500).send(err);
  }
});

mongoose.set("strictQuery", true);

const server = mongoose.connect(process.env.SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
  return app.listen(process.env.PORT || 3000, () => {
    console.log("Server Has Started");
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB", error);
});

app.use("/", notesRouter);

module.exports = { app, server };
