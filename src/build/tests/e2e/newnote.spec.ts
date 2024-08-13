// Self-made test case by me to test the Create, Mark Important, and Delete Note workflow
import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import Note from '../../models/note';

mongoose.set('strictQuery', true);

// Before all tests, connect to MongoDB
test.beforeAll(async () => {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/notesdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
});

// Before each test, delete all existing notes
test.beforeEach(async () => {
    console.log('Deleting all existing notes...');
    await Note.deleteMany({});
    console.log('All existing notes deleted.');
});

// After all tests, disconnect from MongoDB
test.afterAll(async () => {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
});

// Test case: Create, Mark Important, and Delete Note Workflow
test('Create, Mark Important, and Delete Note Workflow', async ({ page }) => {
    // Step 1: Navigate to the homepage
    console.log('Navigating to the homepage...');
    await page.goto('http://localhost:3000/');
    console.log('Homepage loaded.');

    // Step 2: Create a new note
    console.log('Creating a new note...');
    await page.click('text=New Note');
    await page.fill('#title', 'CI Pipeline Test Note');
    await page.fill('#content', 'This is a note created to test the CI pipeline.');
    await page.check('#isImportant'); // Mark the note as important
    console.log('Submitting the note creation form...');
    await page.click('button[type="submit"]');
    console.log('Note creation form submitted.');

    // Step 3: Verify the note is created, marked as important, and visible
    console.log('Verifying the newly created note is displayed...');
    await expect(page).toHaveURL('http://localhost:3000/');
    const noteCard = await page.locator('.card').filter({ hasText: 'CI Pipeline Test Note' }).first();
    await expect(noteCard).toBeVisible();
    await expect(noteCard.locator('.card-title')).toHaveText('CI Pipeline Test Note');
    await expect(noteCard.locator('.badge-danger')).toBeVisible(); // Verify the note is marked as important
    console.log('Note is created and marked as important.');

    // Step 4: Edit the note to unmark it as important
    console.log('Unmarking the note as important...');
    await noteCard.locator('text=Mark as Not Important').click();
    await expect(noteCard.locator('.badge-danger')).not.toBeVisible();
    console.log('Note is unmarked as important.');

    // Step 5: Delete the note
    console.log('Deleting the note...');
    await noteCard.locator('text=Delete').click();
    console.log('Delete button clicked.');

    // Step 6: Verify the note is deleted from the UI
    console.log('Verifying that the note is deleted from the UI...');
    const deletedNoteCountUI = await page.locator('.card').filter({ hasText: 'CI Pipeline Test Note' }).count();
    console.log(`UI note count after deletion attempt: ${deletedNoteCountUI}`);
    expect(deletedNoteCountUI).toBe(0);

    // Step 7: Verify the note is deleted from the database
    console.log('Verifying that the note is deleted from the database...');
    const deletedNoteFromDB = await Note.findOne({ title: 'CI Pipeline Test Note' });
    expect(deletedNoteFromDB).toBeNull();
    console.log('Note deletion confirmed from database.');

    // Step 8: Ensure no notes are displayed (if only one note existed)
    const remainingNotes = await page.locator('.card').count();
    console.log(`Remaining notes after deletion: ${remainingNotes}`);
    if (remainingNotes > 0) {
        console.log('There are still notes remaining on the page.');
    } else {
        console.log('All notes deleted successfully.');
        await expect(page.locator('.card')).toHaveCount(0);
    }
});