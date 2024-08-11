import { test, expect } from '@playwright/test';

test('Complete Note Management Workflow', async ({ page }) => {
  // Step 1: Go to the homepage
  await page.goto('http://localhost:3000/');
  
  // Step 2: Click on "New Note"
  await page.locator('text=New Note').click();
  await expect(page).toHaveURL('http://localhost:3000/new');

  // Step 3: Attempt to submit an empty form to trigger validation
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.form-control:invalid')).toHaveCount(2);

  // Step 4: Fill in the form and create a new note
  await page.locator('#title').fill('E2E Test Title');
  await expect(page.locator('textarea[name="content"]')).toBeVisible();
  await page.locator('textarea[name="content"]').fill('E2E Test Description');
  await page.locator('#isImportant').check();
  await page.locator('button[type="submit"]').click();
  
  // Step 5: Verify that the note is displayed on the homepage
  await expect(page).toHaveURL('http://localhost:3000/');
  const noteCard = page.locator('.card').filter({ hasText: 'E2E Test Title' }).first();
  await expect(noteCard.locator('.card-title')).toBeVisible();
  await expect(noteCard.locator('.badge-danger')).toBeVisible();
  
  // Step 6: Mark the note as not important
  await noteCard.locator('text=Mark as Not Important').click();
  await expect(noteCard.locator('.badge-danger')).not.toBeVisible();
  
  // Step 7: Verify that the note is still present in the list
  await expect(noteCard).toBeVisible();
  
  // Step 8: Delete the note
  await noteCard.locator('text=Delete').click();

  // Step 9: Wait for the deletion to be reflected in the UI
  await page.waitForTimeout(2000); // Wait for 2 seconds to let the deletion process complete

  // Explicitly wait for the note card to be removed from the DOM
  await expect(noteCard).toBeHidden({ timeout: 10000 });

  // Step 10: Confirm no notes are displayed if all notes are deleted
  const remainingCards = await page.locator('.card').count();
  console.log(`Remaining cards after deletion: ${remainingCards}`);
  await expect(page.locator('.card')).toHaveCount(0, { timeout: 15000 });
});
