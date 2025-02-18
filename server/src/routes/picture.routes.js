import Picture from '../models/picture.model.js';
import crud from '../controllers/crud.js';
import multer from 'multer';
import pictureController from '../controllers/pictureController.js';

const upload = multer();
const pictureCtrl = pictureController();
const pictureCrud = crud(Picture);

export default (app) => {
  app.post('/api/pictures', pictureCrud.create);
  app.get('/api/pictures', pictureCrud.readAll);
  app.get('/api/pictures/:id', pictureCrud.readById);
  app.put('/api/pictures/:id', pictureCrud.update);
  app.delete('/api/pictures/:id', pictureCrud.delete);
  app.post('/api/pictures/upload', upload.single('image'), pictureCtrl.uploadImage);
};