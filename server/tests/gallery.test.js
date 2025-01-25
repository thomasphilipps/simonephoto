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

describe('Gallery CRUD', () => {
    let createdGalleryId;

    // CREATE
    it('should create a new gallery (POST /api/galleries)', async () => {
        const pictureId1 = new mongoose.Types.ObjectId();
        const pictureId2 = new mongoose.Types.ObjectId();
        const categoryId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .post('/api/galleries')
            .send({
                title: 'Ma première galerie',
                description: 'Une belle galerie de photos',
                pictures: [pictureId1, pictureId2],
                categories: [categoryId],
            });

        createdGalleryId = response.body._id;
        console.log('CREATED GALLERY _id: ', createdGalleryId);
        expect(response.status).toBe(201);
    });

    // READ (GET ALL)
    it('should return all galleries (GET /api/galleries)', async () => {
        const response = await request(app).get('/api/galleries');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // READ (GET by ID)
    it('should return the created gallery (GET /api/galleries/:id)', async () => {
        const response = await request(app).get(`/api/galleries/${createdGalleryId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(createdGalleryId);
        expect(response.body.title).toBe('Ma première galerie');
    });

    // UPDATE
    it('should update the gallery (PUT /api/galleries/:id)', async () => {
        const response = await request(app)
            .put(`/api/galleries/${createdGalleryId}`)
            .send({
                title: 'Galerie mise à jour',
                description: 'Description modifiée',
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Galerie mise à jour');
        expect(response.body.description).toBe('Description modifiée');
    });

    // DELETE
    it('should delete the gallery (DELETE /api/galleries/:id)', async () => {
        const response = await request(app).delete(`/api/galleries/${createdGalleryId}`);
        expect(response.status).toBe(204);
    });
});
