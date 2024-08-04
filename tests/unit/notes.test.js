const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");

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

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve)); // Ensure the server is closed after tests
  });

  test("GET / should return all notes", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe("Note 1");
    expect(res.body[1].title).toBe("Note 2");
  });

  test("POST /notes should create a new note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "New Note", content: "New Content" })
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.title).toBe("New Note");
    expect(res.body.content).toBe("New Content");
  });

  test("POST /notes/:id/important should mark a note as important", async () => {
    const newNote = await request(app)
      .post("/notes")
      .send({ title: "Another Note", content: "Another Content" })
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
