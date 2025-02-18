import Review from '../models/review.model.js';
import crud from '../controllers/crud.js';

const reviewCrud = crud(Review);

export default (app) => {
  app.post('/api/reviews', reviewCrud.create);
  app.get('/api/reviews', reviewCrud.readAll);
  app.get('/api/reviews/:id', reviewCrud.readById);
  app.put('/api/reviews/:id', reviewCrud.update);
  app.delete('/api/reviews/:id', reviewCrud.delete);
};