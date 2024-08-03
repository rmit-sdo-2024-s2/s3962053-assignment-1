const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Note = require("../../models/note");

let server;

describe("Notes API", () => {
  beforeAll(async () => {
    server = app.listen(4000, () => {
      console.log("Test server started on port 4000");
    });

    await mongoose.connect(process.env.SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
  });

  test("GET / should return all notes", async () => {
    // Seed the database with two notes
    await Note.deleteMany({});
    await Note.create({ title: "Note 1", content: "Content 1" });
    await Note.create({ title: "Note 2", content: "Content 2" });

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
});
