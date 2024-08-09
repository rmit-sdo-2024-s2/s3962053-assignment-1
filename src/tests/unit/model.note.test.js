const mockingoose = require('mockingoose');
const Note = require("../../models/note");

// Unit Tests for Note Model Validation
describe('Note Model Validation', () => {
    beforeEach(() => {
        mockingoose.resetAll();
        jest.clearAllMocks();
    });

    describe("Valid Note", () => {
        it('should validate a note with title and content', async () => {
            const validNote = new Note({
                title: "Valid Note Title",
                content: "Valid Note Content"
            });

            const result = await validNote.validateSync();
            expect(result).toBe(undefined);
        });
    });

    describe("Invalid Note", () => {
        it('should fail validation if title is missing', async () => {
            const invalidNote = new Note({
                content: "This is a note without a title"
            });

            const result = await invalidNote.validateSync();
            expect(result.errors.title).toBeDefined();
        });

        it('should fail validation if content is missing', async () => {
            const invalidNote = new Note({
                title: "Title without content"
            });

            const result = await invalidNote.validateSync();
            expect(result.errors.content).toBeDefined();
        });

        it('should fail validation if title is an empty string', async () => {
            const invalidNote = new Note({
                title: "",
                content: "This note has an empty title"
            });

            const result = await invalidNote.validateSync();
            expect(result.errors.title).toBeDefined();
        });

        it('should fail validation if content is an empty string', async () => {
            const invalidNote = new Note({
                title: "This note has an empty content",
                content: ""
            });

            const result = await invalidNote.validateSync();
            expect(result.errors.content).toBeDefined();
        });
    });

    describe("Default Values", () => {
        it('should set isImportant to false by default', async () => {
            const note = new Note({
                title: "A Note",
                content: "A note without specifying importance"
            });

            await note.validateSync();
            expect(note.isImportant).toBe(false);
        });

        it('should set createdAt to the current date by default', async () => {
            const note = new Note({
                title: "A Note",
                content: "A note without specifying createdAt"
            });

            await note.validateSync();
            expect(note.createdAt).toBeDefined();
        });
    });
});
