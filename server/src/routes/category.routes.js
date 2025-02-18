import Category from '../models/category.model.js';
import crud from '../controllers/crud.js';
import categoryController from '../controllers/categoryController.js';

const categoryCtrl = categoryController();
const categoryCrud = crud(Category);

export default (app) => {
  app.post('/api/categories', categoryCrud.create);
  app.get('/api/categories', categoryCrud.readAll);
  app.put('/api/categories/:id', categoryCrud.update);
  app.delete('/api/categories/:id', categoryCrud.delete);
  app.get('/api/categories/tree', categoryCtrl.getCategoryTree);
};