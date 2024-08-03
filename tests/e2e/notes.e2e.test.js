const { test, expect } = require('@playwright/test');
const { exec } = require('child_process');

let serverProcess;

test.beforeAll(async () => {
  serverProcess = exec('node app.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
});

test.afterAll(() => {
  serverProcess.kill();
});

test('E2E Test for Notes Application', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3000');

  // Ensure the page title is correct
  await expect(page).toHaveTitle('Notes Tonight');

  // Ensure the New Note button is visible
  const newNoteButton = await page.locator('a.btn-success');
  await expect(newNoteButton).toBeVisible();

  // Click the New Note button
  await newNoteButton.click();

  // Fill out the new note form
  await page.fill('input[name="title"]', 'E2E Test Note');
  await page.fill('textarea[name="content"]', 'This is a content of E2E Test Note');
  await page.click('button[type="submit"]');

  // Ensure the new note appears in the list
  const noteTitle = await page.locator('h5.card-title');
  await expect(noteTitle).toContainText('E2E Test Note');
  
  // Delete the note
  const deleteButton = await page.locator('button.btn-danger');
  await deleteButton.click();

  // Ensure the note is deleted
  await expect(noteTitle).not.toBeVisible();
});
