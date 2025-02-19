import request from 'supertest';
import app from '../src/config/serverConfig.js';
import User from '../src/models/user.model.js';

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Management', () => {
  it('should create a new user with hashed password', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'test@example.com',
      password: 'securePassword123',
      name: 'Test User',
      role: 'ROLE_CUSTOMER'
    });

    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('password');

    const dbUser = await User.findById(res.body._id);
    expect(dbUser.email).toBe('test@example.com');
    expect(dbUser.password).not.toBe('securePassword123');
  });

  it('should prevent duplicate emails', async () => {
    await User.create({
      email: 'duplicate@test.com',
      password: 'hashedPassword',
      name: 'Original User',
      role: 'ROLE_CUSTOMER'
    });

    const res = await request(app).post('/api/users').send({
      email: 'duplicate@test.com',
      password: 'anotherPassword',
      name: 'Duplicate User',
      role: 'ROLE_CUSTOMER'
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/déjà utilisé/i);
  });
});
