import { test, expect } from '@playwright/test';

test('Complete Note Management Workflow', async ({ page }) => {
  
  // Step 1: Go to the homepage
  await page.goto('http://localhost:3000/');
  
  // Step 2: Click on "New Note"
  await page.locator('text=New Note').click();
  await expect(page).toHaveURL('http://localhost:3000/new');

  // Step 3: Attempt to submit an empty form to trigger validation
  await page.locator('text=Save').click();
  await expect(page.locator('.form-control:invalid')).toHaveCount(2); // Expect 2 invalid fields (Title and Content)

  // Step 4: Fill in the form and create a new note
  await page.locator('[placeholder="Enter Note Title"]').fill('E2E Test Title');
  await page.locator('textarea[name="description"]').fill('E2E Test Description');
  await page.locator('#isImportant').check(); // Mark the note as important
  await page.locator('text=Save').click();
  
  // Step 5: Verify that the note is displayed on the homepage
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.locator('.card-title', { hasText: 'E2E Test Title' })).toBeVisible();
  await expect(page.locator('.badge-danger')).toBeVisible(); // Check that the note is marked as important
  
  // Step 6: Mark the note as not important
  await page.locator('text=Mark as Not Important').click();
  await expect(page.locator('.badge-danger')).not.toBeVisible();
  
  // Step 7: Verify that the note is still present in the list
  await expect(page.locator('.card-title', { hasText: 'E2E Test Title' })).toBeVisible();
  
  // Step 8: Delete the note
  await page.locator('text=Delete').click();
  
  // Step 9: Verify that the note has been removed from the list
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.locator('.card-title', { hasText: 'E2E Test Title' })).not.toBeVisible();

  // Step 10: Confirm no notes are displayed if all notes are deleted
  await expect(page.locator('.card')).toHaveCount(0); // No cards should be present if no notes exist
  
});
