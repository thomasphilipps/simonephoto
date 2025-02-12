const Picture = require('../models/picture.model');
// We inject our Gallery model into the CRUD factory:
const crud = require('../controllers/crud')(Picture);
const multer = require('multer');
const upload = multer();
const pictureController = require('../controllers/pictureController')();

module.exports = (app) => {
  // Bind each CRUD action to an endpoint
  app.post('/api/pictures', crud.create);
  app.get('/api/pictures', crud.readAll);
  app.get('/api/pictures/:id', crud.readById);
  app.put('/api/pictures/:id', crud.update);
  app.delete('/api/pictures/:id', crud.delete);
  app.post('/api/pictures/upload', upload.single('image'), pictureController.uploadImage);

};

