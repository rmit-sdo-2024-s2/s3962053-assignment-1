const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Note = require("../../models/note");

jest.setTimeout(60000);

describe("Notes API Integration Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Note.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET / should return an empty array initially", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("POST /notes should create a new note", async () => {
    const newNote = { title: "Integration Test Note", content: "Integration Test Content", isImportant: false };
    const res = await request(app)
      .post("/notes")
      .send(newNote)
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.title).toBe(newNote.title);
    expect(res.body.content).toBe(newNote.content);
  });

  test("GET / should return the newly created note", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Integration Test Note");
    expect(res.body[0].content).toBe("Integration Test Content");
  });

  test("DELETE /:id should delete the created note", async () => {
    const noteToDelete = await Note.findOne({ title: "Integration Test Note" });
    const res = await request(app)
      .delete(`/${noteToDelete._id}`)
      .set("Accept", "application/json");

    expect(res.status).toBe(302); // Expecting a redirect status code

    const remainingNotes = await request(app).get("/");
    expect(remainingNotes.body.length).toBe(0);
  });
});
