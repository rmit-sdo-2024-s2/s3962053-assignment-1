const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Note = require("../../models/note");

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe("Notes API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Note.deleteMany({});

    await Note.create([
      { title: "Note 1", content: "Content 1", createdAt: new Date() },
      { title: "Note 2", content: "Content 2", createdAt: new Date() },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET / should return all notes", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe("Note 1");
    expect(res.body[1].title).toBe("Note 2");
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
});
