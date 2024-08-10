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
                .expect(302)
                .expect('Location', '/');
        });

        it('Should not add a note without a title', async () => {
            const res = await req
                .post('/notes')
                .send({
                    content: "This note is missing a title",
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toBeDefined();
        });

        it('Should not add a note without content', async () => {
            const res = await req
                .post('/notes')
                .send({
                    title: "[INTEGRATION TEST] Note without content",
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('Toggle Note Importance', () => {
        it('Should toggle the importance of a note', async () => {
            const note = new Note({
                title: "Note to be toggled",
                content: "This note's importance will be toggled",
                isImportant: false
            });
            await note.save();

            await req
                .post(`/notes/${note._id}/important`)
                .send()
                .expect(302)
                .expect('Location', '/');

            // Check if the note's importance has been toggled
            const updatedNote = await Note.findById(note._id);
            expect(updatedNote.isImportant).toBe(true);
        });
    });

    describe('Delete Note', () => {
        it('Should delete a note and redirect to homepage', async () => {
            const note = new Note({
                title: "Note to be deleted",
                content: "This note will be deleted"
            });
            await note.save();

            await req
                .delete(`/${note._id}`)
                .send()
                .expect(302)
                .expect('Location', '/');

            // Check if the note has been deleted
            const deletedNote = await Note.findById(note._id);
            expect(deletedNote).toBeNull();
        });
    });

    describe('Get Notes', () => {
        it('Should get all notes', async () => {
            await Note.create([
                { title: "Note 1", content: "Content for note 1" },
                { title: "Note 2", content: "Content for note 2" }
            ]);

            const res = await req.get('/api/notes')  // Use the dedicated JSON endpoint
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/);

            expect(res.body).toBeDefined();
            expect(res.body.length).toBe(2); // Expect 2 notes in the response
        });
    });
});
