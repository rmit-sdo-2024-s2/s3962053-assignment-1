const { test, expect } = require("@playwright/test");
const mongoose = require("mongoose");
const app = require("../../app");

let server;

test.describe("E2E Test for Notes Application", () => {
  test.beforeAll(async () => {
    await mongoose.connect(process.env.SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Start server on a different port
    server = app.listen(4000, () => {
      console.log("E2E Test server started on port 4000");
    });
  });

  test.afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
  });

  test("should load the homepage and show the correct title", async ({ page }) => {
    await page.goto("http://localhost:4000");
    await expect(page).toHaveTitle("Notes Tonight");
    const newNoteButton = await page.locator("a.btn-success");
    await expect(newNoteButton).toBeVisible();
  });

  test("should create a new note", async ({ page }) => {
    const fetch = await import("node-fetch").then(mod => mod.default);

    await page.goto("http://localhost:4000/new");
    await page.fill("input[name='title']", "Test Note");
    await page.fill("textarea[name='content']", "This is a test note.");
    await page.click("button[type='submit']");

    const response = await fetch("http://localhost:4000");
    const notes = await response.json();

    expect(notes.length).toBeGreaterThan(0);
    expect(notes[notes.length - 1].title).toBe("Test Note");
    expect(notes[notes.length - 1].content).toBe("This is a test note.");
  });

  test("should mark a note as important", async ({ page }) => {
    await page.goto("http://localhost:4000");
    const noteCards = await page.locator(".card");
    await noteCards.first().locator("form[action*='important']").click();

    const fetch = await import("node-fetch").then(mod => mod.default);
    const response = await fetch("http://localhost:4000");
    const notes = await response.json();

    expect(notes[0].isImportant).toBe(true);
  });
});
