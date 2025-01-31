const request = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const app = require('../src/config/serverConfig');
const Category = require('../src/models/category.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Category Tree building', () => {
  let rootCategoryId;
  let childCategoryId;

  // Clean collection before tests
  beforeEach(async () => {
    await Category.deleteMany({});


    // Create some categories manually
    const rootCategory = await Category.create({
      title: 'Root category',
      description: 'Top-level category description',
      parent: null
    });
    rootCategoryId = rootCategory._id;

    const childCategory = await Category.create({
      title: 'Child category',
      description: 'Child category description',
      parent: rootCategoryId
    });
    childCategoryId = childCategory._id;

    await Category.create({
      title: 'SubChild Category',
      description: 'A child of the child category',
      parent: childCategoryId
    });
  });

  it('should return a nested category tree', async () => {
    const response = await request(app).get('/api/categories/tree');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const tree = response.body;
    expect(tree.length).toBe(1);
    expect(tree[0].title).toBe('Root category');

    const rootChildren = tree[0].children;
    expect(rootChildren.length).toBe(1);
    expect(rootChildren[0].title).toBe('Child category');

    const subChildren = rootChildren[0].children;
    expect(subChildren.length).toBe(1);
    expect(subChildren[0].children.length).toBe(0);
    expect(subChildren[0].title).toBe('SubChild Category');

  });

});