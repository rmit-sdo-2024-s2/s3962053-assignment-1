const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const Note = require("../../models/note");

let server;

describe("Notes API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Start server on a different port
    server = app.listen(4000, () => {
      console.log("Test server started on port 4000");
    });
  });

  beforeEach(async () => {
    await Note.deleteMany({});

    await Note.insertMany([
      { title: "Note 1", content: "Content 1", isImportant: false },
      { title: "Note 2", content: "Content 2", isImportant: false },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve)); // Ensure the server is closed after tests
  });

  test("GET / should return all notes", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true); // Check if the body is an array
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe("Note 1");
    expect(res.body[1].title).toBe("Note 2");
  });

  test("POST /notes should create a new note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "New Note", content: "New Content", isImportant: "true" })
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    const notes = await Note.find();
    expect(notes.length).toBe(3);
    expect(notes[2].title).toBe("New Note");
    expect(notes[2].content).toBe("New Content");
    expect(notes[2].isImportant).toBe(true);
  });

  test("POST /notes/:id/important should mark a note as important", async () => {
    const newNote = await request(app)
      .post("/notes")
      .send({ title: "Another Note", content: "Another Content", isImportant: false })
      .set("Accept", "application/json");

    const noteId = newNote.body._id;

    const markImportant = await request(app)
      .post(`/notes/${noteId}/important`)
      .send();

    expect(markImportant.status).toBe(302);

    const updatedNote = await Note.findById(noteId);
    expect(updatedNote.isImportant).toBe(true);
  });
});
