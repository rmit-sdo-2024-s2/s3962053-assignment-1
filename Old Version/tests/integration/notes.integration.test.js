const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Note = require("../../models/note");

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  server = app.listen(4000, () => {
    console.log("Integration Test server started on port 4000");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => server.close(resolve));
});

describe("Notes API Integration Tests", () => {
  test("GET /api/notes should return all notes", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /notes should create a new note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "New Note", content: "New Content", isImportant: false })
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.title).toBe("New Note");
    expect(res.body.content).toBe("New Content");
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
