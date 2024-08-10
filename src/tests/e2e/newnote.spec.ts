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
  
  await expect(page.locator('.form-control:invalid')).toHaveCount(2); // Expect 2 invalid fields (Title and Content)

  // Step 4: Fill in the form and create a new note
  await page.locator('#title').fill('E2E Test Title');
  await expect(page.locator('textarea[name="content"]')).toBeVisible();
  await page.locator('textarea[name="content"]').fill('E2E Test Description');
  await page.locator('#isImportant').check(); // Mark the note as important
  await page.locator('button[type="submit"]').click();
  
  // Step 5: Verify that the note is displayed on the homepage
  await expect(page).toHaveURL('http://localhost:3000/');
  const noteCard = page.locator('.card').filter({ hasText: 'E2E Test Title' }).first();
  await expect(noteCard.locator('.card-title')).toBeVisible();
  await expect(noteCard.locator('.badge-danger')).toBeVisible(); // Check that the note is marked as important
  
  // Step 6: Mark the note as not important
  await noteCard.locator('text=Mark as Not Important').click();
  await expect(noteCard.locator('.badge-danger')).not.toBeVisible();
  
  // Step 7: Verify that the note is still present in the list
  await expect(noteCard).toBeVisible();
  
  // Step 8: Delete the note
  await noteCard.locator('text=Delete').click();

  // Step 9: Verify that the note has been removed from the list
  console.log('Checking that the note has been removed...');
  await page.waitForTimeout(2000); // Wait for 2 seconds before checking for deletion
  
  const remainingCards = await page.locator('.card').count();
  console.log(`Remaining cards after deletion: ${remainingCards}`);

  // Explicitly check that the specific card is not present
  await expect(page.locator('.card').filter({ hasText: 'E2E Test Title' })).toHaveCount(0);

  // Step 10: Confirm no notes are displayed if all notes are deleted
  await expect(page.locator('.card')).toHaveCount(0, { timeout: 10000 }); // No cards should be present if no notes exist
});
