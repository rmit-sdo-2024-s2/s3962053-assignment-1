// I implemented this test to test the Note model itself and its validation and logic
// Import mockingoose to mock mongoose models
const mockingoose = require('mockingoose');
// Import the Note model
const Note = require("../../models/note");

// Unit Tests for Note Model Validation
describe('Note Model Validation', () => {
    beforeEach(() => {
        // Reset all mocks and clear all jest mocks before each test
        mockingoose.resetAll();
        jest.clearAllMocks();
    });

    describe("Valid Note", () => {
        it('should validate a note with title and content', async () => {
            // Create a valid note instance
            const validNote = new Note({
                title: "Valid Note Title",
                content: "Valid Note Content"
            });

            // Validate the note instance
            const result = await validNote.validateSync();
            // Expect no validation errors
            expect(result).toBe(undefined);
        });
    });

    describe("Invalid Note", () => {
        it('should fail validation if title is missing', async () => {
            // Create an invalid note instance without a title
            const invalidNote = new Note({
                content: "This is a note without a title"
            });

            // Validate the note instance
            const result = await invalidNote.validateSync();
            // Expect validation errors for the title field
            expect(result.errors.title).toBeDefined();
        });

        it('should fail validation if content is missing', async () => {
            // Create an invalid note instance without content
            const invalidNote = new Note({
                title: "Title without content"
            });

            // Validate the note instance
            const result = await invalidNote.validateSync();
            // Expect validation errors for the content field
            expect(result.errors.content).toBeDefined();
        });

        it('should fail validation if title is an empty string', async () => {
            // Create an invalid note instance with an empty title
            const invalidNote = new Note({
                title: "",
                content: "This note has an empty title"
            });

            // Validate the note instance
            const result = await invalidNote.validateSync();
            // Expect validation errors for the title field
            expect(result.errors.title).toBeDefined();
        });

        it('should fail validation if content is an empty string', async () => {
            // Create an invalid note instance with empty content
            const invalidNote = new Note({
                title: "This note has an empty content",
                content: ""
            });

            // Validate the note instance
            const result = await invalidNote.validateSync();
            // Expect validation errors for the content field
            expect(result.errors.content).toBeDefined();
        });
    });

    describe("Default Values", () => {
        it('should set isImportant to false by default', async () => {
            // Create a note instance without specifying isImportant
            const note = new Note({
                title: "A Note",
                content: "A note without specifying importance"
            });

            // Validate the note instance
            await note.validateSync();
            // Expect isImportant to be false by default
            expect(note.isImportant).toBe(false);
        });

        it('should set createdAt to the current date by default', async () => {
            // Create a note instance without specifying createdAt
            const note = new Note({
                title: "A Note",
                content: "A note without specifying createdAt"
            });

            // Validate the note instance
            await note.validateSync();
            // Expect createdAt to be defined (current date)
            expect(note.createdAt).toBeDefined();
        });
    });
});