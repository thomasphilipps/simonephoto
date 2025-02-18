import request from 'supertest';
import app from '../src/config/serverConfig.js';
import Picture from '../src/models/picture.model.js';

beforeEach(async () => {
  await Picture.deleteMany({});
});

describe('Picture CRUD Operations', () => {
  let testPicture;

  beforeEach(async () => {
    testPicture = await Picture.create({
      title: 'Test Picture',
      uri: 'https://example.com/test.jpg',
      thumb_uri: 'https://example.com/test_thumb.jpg'
    });
  });

  it('should create a new picture', async () => {
    const res = await request(app).post('/api/pictures').send({
      title: 'New Picture',
      uri: 'https://example.com/new.jpg',
      thumb_uri: 'https://example.com/new_thumb.jpg'
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Picture');
  });

  it('should retrieve all pictures', async () => {
    const res = await request(app).get('/api/pictures');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});