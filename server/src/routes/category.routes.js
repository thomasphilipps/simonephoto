const Category = require('../models/category.model');
const crud = require('../controllers/crud')(Category);
const categoryController = require('../controllers/categoryController')();

module.exports = (app) => {
  app.post('/api/categories', crud.create);
  app.get('/api/categories', crud.readAll);
  app.put('/api/categories/:id', crud.update);
  app.delete('/api/categories/:id', crud.delete);

  app.get('/api/categories/tree', categoryController.getCategoryTree);
};