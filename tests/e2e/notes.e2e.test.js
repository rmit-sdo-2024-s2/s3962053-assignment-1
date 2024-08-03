const { test, expect } = require("@playwright/test");
const { exec, execSync } = require("child_process");
const fetch = require("node-fetch");

let serverProcess;

function killPort(port) {
  try {
    const pids = execSync(`lsof -t -i:${port}`).toString().trim().split('\n');
    pids.forEach(pid => {
      if (pid) {
        execSync(`kill -9 ${pid}`);
      }
    });
  } catch (error) {
    console.error(`Error killing process on port ${port}: ${error}`);
  }
}

async function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
      // Ignore errors
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retrying
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

test.beforeAll(async () => {
  // Kill any process running on port 4000
  killPort(4000);

  serverProcess = exec("PORT=4000 node app.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  // Wait for the server to be ready
  await waitForServer("http://localhost:4000", 30000); // Increase timeout to 30 seconds
});

test.afterAll(() => {
  serverProcess.kill();
});

test("E2E Test for Notes Application", async ({ page }) => {
  // Navigate to the application
  await page.goto("http://localhost:4000");

  // Ensure the page title is correct with increased timeout
  await expect(page).toHaveTitle("Notes Tonight", { timeout: 15000 });

  // Ensure the New Note button is visible
  const newNoteButton = await page.locator("a.btn-success");
  await expect(newNoteButton).toBeVisible();

  // Click the New Note button
  await newNoteButton.click();

  // Fill out the new note form
  await page.fill('input[name="title"]', "E2E Test Note");
  await page.fill('textarea[name="content"]', "This is a content of E2E Test Note");
  await page.click('button[type="submit"]');

  // Ensure the new note appears in the list
  const noteTitle = await page.locator("h5.card-title");
  await expect(noteTitle).toContainText("E2E Test Note");
  
  // Delete the note
  const deleteButton = await page.locator("button.btn-danger");
  await deleteButton.click();

  // Ensure the note is deleted
  await expect(noteTitle).not.toBeVisible();
});
