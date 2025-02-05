const crud = require('../controllers/crud')(require('../models/user.model'));
const userController = require('../controllers/userController');

module.exports = (app) => {
  app.post('/api/users', userController.createUser);
  app.get('/api/users', crud.readAll);
  app.get('/api/users/:id', crud.readById);
  app.put('/api/users/:id', crud.update);
  app.delete('/api/users/:id', crud.delete);
  
  app.post('/api/login', userController.loginUser);
};
