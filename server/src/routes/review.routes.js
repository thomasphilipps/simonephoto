const Review = require('../models/review.model');
const crud = require('../controllers/crud')(Review);

module.exports = (app) => {
  // Bind each CRUD action to an endpoint
  app.post('/api/reviews', crud.create);
  app.get('/api/reviews', crud.readAll);
  app.get('/api/reviews/:id', crud.readById);
  app.put('/api/reviews/:id', crud.update);
  app.delete('/api/reviews/:id', crud.delete);

};