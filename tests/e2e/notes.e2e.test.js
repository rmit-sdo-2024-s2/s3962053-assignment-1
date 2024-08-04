// tests/e2e/notes.e2e.test.js
const { test, expect } = require('@playwright/test');
const mongoose = require('mongoose');
const app = require('../../app');

let server;

test.describe('E2E Test for Notes Application', () => {
  test.beforeAll(async () => {
    await mongoose.connect(process.env.SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Start server on a different port
    server = app.listen(4000, () => {
      console.log('E2E Test server started on port 4000');
    });
  });

  test.afterAll(async () => {
    await mongoose.connection.close();
    await new Promise((resolve) => server.close(resolve));
  });

  test('should load the homepage and show the correct title', async ({ page }) => {
    await page.goto('http://localhost:4000');
    await expect(page).toHaveTitle('Notes Tonight');
    const newNoteButton = await page.locator('a.btn-success');
    await expect(newNoteButton).toBeVisible();
  });

  test('should create a new note', async ({ page }) => {
    await page.goto('http://localhost:4000/new');
    await page.fill("input[name='title']", 'Test Note');
    await page.fill("textarea[name='content']", 'This is a test note.');
    await page.check("input[name='isImportant']");
    await page.click("button[type='submit']");

    const fetch = await import('node-fetch').then((mod) => mod.default);
    const response = await fetch('http://localhost:4000/api/notes');
    const notes = await response.json();

    expect(notes.length).toBeGreaterThan(0);
    expect(notes[notes.length - 1].title).toBe('Test Note');
    expect(notes[notes.length - 1].content).toBe('This is a test note.');
    expect(notes[notes.length - 1].isImportant).toBe(true);
  });

  test('should mark a note as important', async ({ page }) => {
    const fetch = await import('node-fetch').then((mod) => mod.default);

    // Create a new note via API
    const createNoteResponse = await fetch('http://localhost:4000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'API Test Note',
        content: 'This is a test note created via API.',
        isImportant: false,
      }),
    });
    const createdNote = await createNoteResponse.json();

    await page.goto('http://localhost:4000');
    const noteCards = await page.locator('.card');
    await noteCards.first().scrollIntoViewIfNeeded();
    await noteCards.first().locator("form[action*='important']").click({ force: true });

    // Fetch the updated note
    const updatedNoteResponse = await fetch('http://localhost:4000/api/notes');
    const updatedNotes = await updatedNoteResponse.json();

    const updatedNote = updatedNotes.find((note) => note._id === createdNote._id);
    expect(updatedNote.isImportant).toBe(true);
  });
});
