import { test, expect } from '@playwright/test';

test('Create, Mark Important, and Delete Note Workflow', async ({ page }) => {
  
  // Step 1: Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Step 2: Create a new note
  await page.click('text=New Note');
  await page.fill('#title', 'CI Pipeline Test Note');
  await page.fill('#content', 'This is a note created to test the CI pipeline.');
  await page.check('#isImportant'); // Mark the note as important
  await page.click('button[type="submit"]');
  
  // Step 3: Verify the note is created, marked as important, and visible
  await expect(page).toHaveURL('http://localhost:3000/');
  const noteCard = await page.locator('.card').filter({ hasText: 'CI Pipeline Test Note' }).first();
  await expect(noteCard).toBeVisible();
  await expect(noteCard.locator('.card-title')).toHaveText('CI Pipeline Test Note');
  await expect(noteCard.locator('.badge-danger')).toBeVisible(); // Verify the note is marked as important
  
  // Step 4: Edit the note to unmark it as important
  await noteCard.locator('text=Mark as Not Important').click();
  await expect(noteCard.locator('.badge-danger')).not.toBeVisible();
  
  // Step 5: Delete the note
  await noteCard.locator('text=Delete').click();
  
  // Step 6: Verify the note is deleted and no longer visible
  await page.reload(); // Ensure the page is refreshed to confirm deletion
  await expect(page.locator('.card').filter({ hasText: 'CI Pipeline Test Note' })).toHaveCount(0);
  
  // Step 7: Ensure no notes are displayed (if only one note existed)
  const remainingNotes = await page.locator('.card').count();
  console.log(`Remaining notes after deletion: ${remainingNotes}`);
  if (remainingNotes === 0) {
    await expect(page.locator('.card')).toHaveCount(0);
  }
});
