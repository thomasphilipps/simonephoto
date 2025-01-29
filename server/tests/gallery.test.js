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
    let createdPictureId1;
    let createdPictureId2;
    let categoryId;

    // CREATE 2 Fakes pictures
    it('should create two pictures (POST /api/pictures)', async () => {
        const pic1 = await request(app).post('/api/pictures').send({
            title: 'Picture #1',
            description: 'La première image',
            uri: 'https://example.com/test1.jpg',
            thumb_uri: 'https://example.com/test1_thumb.jpg',
        });
        expect(pic1.status).toBe(201);
        createdPictureId1 = pic1.body._id;

        const pic2 = await request(app).post('/api/pictures').send({
            title: 'Picture #2',
            description: 'La deuxième image',
            uri: 'https://example.com/test2.jpg',
            thumb_uri: 'https://example.com/test2_thumb.jpg',
        });
        expect(pic2.status).toBe(201);
        createdPictureId2 = pic2.body._id;
    });

    // CREATE
    it('should create a new gallery (POST /api/galleries)', async () => {
        categoryId = new mongoose.Types.ObjectId(); // Exemple de faux ID
        const response = await request(app)
            .post('/api/galleries')
            .send({
                title: 'Ma première galerie',
                description: 'Une belle galerie de photos',
                pictures: [createdPictureId1, createdPictureId2],
                categories: [categoryId],
            });

        expect(response.status).toBe(201);
        createdGalleryId = response.body._id;
        expect(response.body.title).toBe('Ma première galerie');
    });

    // READ (GET ALL)
    it('should return all galleries (GET /api/galleries)', async () => {
        const response = await request(app).get('/api/galleries');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // READ (GET by ID)
    it('should return the created gallery with its pictures (GET /api/galleries/:id)', async () => {
        const response = await request(app).get(`/api/galleries/${createdGalleryId}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(createdGalleryId);
        expect(response.body.title).toBe('Ma première galerie');

        // Vérification que les pictures sont bien présentes
        expect(response.body.pictures).toBeDefined();
        expect(Array.isArray(response.body.pictures)).toBe(true);
        expect(response.body.pictures.length).toBe(2);

        // On vérifie qu'on retrouve bien les IDs créés
        const returnedIds = response.body.pictures.map((pic) => pic._id);
        expect(returnedIds).toContain(createdPictureId1);
        expect(returnedIds).toContain(createdPictureId2);
    });

    // // READ (GET Pictures by ID)
    //TODO: Check if it's really necessary
    //
    // it('should return an array of the pictures IDs of the gallery with ID (GET /api/galleries/:id/pictures) ', async () => {
    //     const response = await request(app).get(`/api/galleries/${createdGalleryId}/pictures`);
    //     expect(response.status).toBe(200);
    //     expect(response.body).toBe([pictureId1, pictureId2])
    // })

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
