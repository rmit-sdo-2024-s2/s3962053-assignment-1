// I implemented this test to test the API endpoints of the Note model
// Import the app module and initialize supertest
const app = require('../../app');
const supertest = require('supertest');
const req = supertest(app);
const Note = require("../../models/note");

describe('Note API Integration Tests', () => {

    beforeEach(async () => {
        // Clear the database before each test
        await Note.deleteMany({});
    });

    describe('Add Note', () => {
        it('Should add a new note and redirect to homepage', async () => {
            await req
                .post('/notes')
                .send({
                    title: "[INTEGRATION TEST] New Note",
                    content: "This note was created at " + new Date(),
                })
                .expect(302) // Expect a 302 redirect status
                .expect('Location', '/'); // Expect the redirect location to be the homepage
        });

        it('Should not add a note without a title', async () => {
            const res = await req
                .post('/notes')
                .send({
                    content: "This note is missing a title",
                });

            expect(res.statusCode).toEqual(400); // Expect a 400 Bad Request status
            expect(res.body.errors).toBeDefined(); // Expect errors to be defined in the response body
        });

        it('Should not add a note without content', async () => {
            const res = await req
                .post('/notes')
                .send({
                    title: "[INTEGRATION TEST] Note without content",
                });

            expect(res.statusCode).toEqual(400); // Expect a 400 Bad Request status
            expect(res.body.errors).toBeDefined(); // Expect errors to be defined in the response body
        });
    });

    describe('Toggle Note Importance', () => {
        it('Should toggle the importance of a note', async () => {
            // Create a new note to be toggled
            const note = new Note({
                title: "Note to be toggled",
                content: "This note's importance will be toggled",
                isImportant: false
            });
            await note.save();

            await req
                .post(`/notes/${note._id}/important`)
                .send()
                .expect(302) // Expect a 302 redirect status
                .expect('Location', '/'); // Expect the redirect location to be the homepage

            // Check if the note's importance has been toggled
            const updatedNote = await Note.findById(note._id);
            expect(updatedNote.isImportant).toBe(true); // Expect the note to be marked as important
        });
    });

    describe('Delete Note', () => {
        it('Should delete a note and redirect to homepage', async () => {
            // Create a new note to be deleted
            const note = new Note({
                title: "Note to be deleted",
                content: "This note will be deleted"
            });
            await note.save();

            await req
                .delete(`/${note._id}`)
                .send()
                .expect(302) // Expect a 302 redirect status
                .expect('Location', '/'); // Expect the redirect location to be the homepage

            // Check if the note has been deleted
            const deletedNote = await Note.findById(note._id);
            expect(deletedNote).toBeNull(); // Expect the note to be null (deleted)
        });
    });

    describe('Get Notes', () => {
        it('Should get all notes', async () => {
            // Create multiple notes
            await Note.create([
                { title: "Note 1", content: "Content for note 1" },
                { title: "Note 2", content: "Content for note 2" }
            ]);

            const res = await req.get('/api/notes') // Use the dedicated JSON endpoint
                .set('Accept', 'application/json')
                .expect(200) // Expect a 200 OK status
                .expect('Content-Type', /json/); // Expect the response to be in JSON format

            expect(res.body).toBeDefined(); // Expect the response body to be defined
            expect(res.body.length).toBe(2); // Expect 2 notes in the response
        });
    });
});