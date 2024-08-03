const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary
const Note = require('../../models/note');
const mockingoose = require('mockingoose');

describe('Notes API', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('GET /', () => {
    it('should return all notes', async () => {
      const notes = [
        { _id: '1', title: 'Note 1', content: 'Content 1' },
        { _id: '2', title: 'Note 2', content: 'Content 2' }
      ];
      mockingoose(Note).toReturn(notes, 'find');

      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBe('Note 1');
      expect(res.body[1].title).toBe('Note 2');
    });
  });

  describe('POST /notes', () => {
    it('should create a new note', async () => {
      const note = { title: 'New Note', content: 'New Content' };
      mockingoose(Note).toReturn(note, 'save');

      const res = await request(app)
        .post('/notes')
        .send(note)
        .set('Accept', 'application/json');

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.title).toBe('New Note');
      expect(res.body.content).toBe('New Content');
    });
  });
});
