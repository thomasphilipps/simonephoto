import request from 'supertest';
import app from '../src/config/serverConfig.js';
import Category from '../src/models/category.model.js';

beforeEach(async () => {
  await Category.deleteMany({});
});

describe('Category Hierarchy', () => {
  let rootCategory, childCategory;

  beforeEach(async () => {
    rootCategory = await Category.create({
      title: 'Root',
      description: 'Root Category'
    });

    childCategory = await Category.create({
      title: 'Child',
      description: 'Child Category',
      parent: rootCategory._id
    });
  });

  it('should build a category tree', async () => {
    const res = await request(app).get('/api/categories/tree');

    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Root');
    expect(res.body[0].children[0].title).toBe('Child');
  });
});