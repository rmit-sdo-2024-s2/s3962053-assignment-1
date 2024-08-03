const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Note = require('./models/note');
const notesRouter = require('./routes/notes');
const methodOverride = require('method-override');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json()); // Ensure JSON parsing is enabled
app.use(express.urlencoded({ extended: false })); // Ensure URL-encoded data parsing is enabled
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const notes = await Note.find().sort('-createdAt');
  res.json(notes); // Ensure the response is JSON
});

mongoose.set('strictQuery', true);

mongoose.connect(process.env.SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Has Started`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

app.use('/', notesRouter);

module.exports = app;
