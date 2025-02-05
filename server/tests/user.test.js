// tests/user.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const app = require('../src/config/serverConfig');
const User = require('../src/models/user.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User entity particularities', () => {
  it('should create a user with valid data, hash the password and lowercase/trim the email', async () => {
    const res = await request(app).post('/api/users').send({
      email: '  Test@Example.com  ',
      password: 'mysecretpassword',
      name: 'John Doe',
      role: 'ROLE_CUSTOMER'
    });
    expect(res.status).toBe(201);
    // Check that the email is lowercased and trimmed
    expect(res.body.email).toBe('test@example.com');
    // Check that password is not returned in the response
    expect(res.body).not.toHaveProperty('password');

    // Verify in the DB that the password is hashed
    const userInDb = await User.findOne({email: 'test@example.com'});
    expect(userInDb).toBeTruthy();
    expect(userInDb.password).not.toBe('mysecretpassword');
  });

  it('should fail when a required field is missing', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'user@example.com',
      // Missing password
      name: 'Jane Doe',
      role: 'ROLE_CUSTOMER'
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  it('should fail when the email format is invalid', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'invalid-email',
      password: 'password123',
      name: 'Jane Doe',
      role: 'ROLE_CUSTOMER'
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  it('should fail when the role is not valid', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'user2@example.com',
      password: 'password123',
      name: 'John Smith',
      role: 'ROLE_UNKNOWN'
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/role/i);
  });

  it('should fail when trying to create a user with a duplicate email', async () => {
    // Create the first user
    await request(app).post('/api/users').send({
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'First User',
      role: 'ROLE_CUSTOMER'
    });

    // Attempt to create a second user with the same email
    const res = await request(app).post('/api/users').send({
      email: 'duplicate@example.com',
      password: 'password456',
      name: 'Second User',
      role: 'ROLE_CUSTOMER'
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/déjà utilisé/i);
  });
});
