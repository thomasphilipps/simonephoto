import User from '../models/user.model.js';
import crud from '../controllers/crud.js';
import userController from '../controllers/userController.js';

const userCrud = crud(User);

export default (app) => {
  app.post('/api/users', userController.createUser);
  app.get('/api/users', userCrud.readAll);
  app.get('/api/users/:id', userCrud.readById);
  app.put('/api/users/:id', userCrud.update);
  app.delete('/api/users/:id', userCrud.delete);
  app.post('/api/login', userController.loginUser);
};