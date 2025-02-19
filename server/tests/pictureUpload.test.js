import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/config/serverConfig.js';
import path from 'path';
import fs from 'fs';

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Picture Upload', () => {

  it('should return an error if no file is provided', async () => {
    const response = await request(app)
      .post('/api/pictures/upload')
      .expect(400);

    expect(response.body.error).toBe('No file provided');
  });

  it('should return an error if the file format is not supported', async () => {
    const response = await request(app)
      .post('/api/pictures/upload')
      .attach('image', path.join(__dirname, 'fixtures', 'wrongFormatImage.gif'))
      .expect(415);

    expect(response.body.error).toBe('Unsupported file format');
  });

  it('should return an error if the MIME type and extension do not match', async () => {
    const response = await request(app)
      .post('/api/pictures/upload')
      .attach('image', path.join(__dirname, 'fixtures', 'fakejpg.jpg'))
      .expect(415);

    expect(response.body.error).toBe('MIME type and file extension do not match');
  });

  it('should return an error if the file is too large', async () => {
    // Création d'un faux fichier de grande taille
    const largeFilePath = path.join(__dirname, 'fixtures', 'fake.jpg');
    fs.writeFileSync(largeFilePath, Buffer.alloc(6 * 1024 * 1024));

    const response = await request(app)
      .post('/api/pictures/upload')
      .attach('image', largeFilePath)
      .expect(413);

    expect(response.body.error).toBe('File size exceeds the allowed limit');

    // Nettoyage du fichier de test
    fs.unlinkSync(largeFilePath);
  });

  // (Les autres tests décrits dans les commentaires pourront être ajoutés au fur et à mesure)
});
