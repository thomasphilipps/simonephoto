const request = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const app = require('../src/config/serverConfig');

let mongoServer;

beforeAll(async () => {
  // Spin up an in-memory Mongo server
  mongoServer = await MongoMemoryServer.create();
  // Connect Mongoose to this in-memory server
  await mongoose.connect(mongoServer.getUri(), {});
});

afterAll(async () => {
  // Clean up
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Picture CRUD', () => {
  let createdPictureId;

  // CREATE
  it('should create a new picture (POST /api/pictures)', async () => {
    const response = await request(app).post('/api/pictures').send({
      title: 'Image enregistrée',
      description: 'une belle image',
      uri: 'https://example.com/testimage.jpg',
      thumb_uri: 'https://example.com/testimage_thumbnail.jpg'
    });
    createdPictureId = response.body._id;
    expect(response.status).toBe(201);
  });

  // READ (GET ALL)
  it('should return all pictures (GET /api/pictures)', async () => {
    const response = await request(app).get('/api/pictures');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // READ (GET BY ID)
  it('should return the created picture (GET /api/pictures/:id)', async () => {
    const response = await request(app).get(`/api/pictures/${createdPictureId}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdPictureId);
    expect(response.body.title).toBe('Image enregistrée');
  });

  // UPDATE
  it('should update the image (PUT /api/pictures/:id)', async () => {
    const response = await request(app)
      .put(`/api/pictures/${createdPictureId}`)
      .send({
        title: `Titre de l'image mis à jour`,
        description: `Description de l'image mise à jour`
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(`Titre de l'image mis à jour`);
    expect(response.body.description).toBe(`Description de l'image mise à jour`);
  });
});
