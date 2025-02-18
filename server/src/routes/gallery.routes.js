import Gallery from '../models/gallery.model.js';
import crud from '../controllers/crud.js';
import galleryController from '../controllers/galleryController.js';

const galleryCtrl = galleryController();
const galleryCrud = crud(Gallery);

export default (app) => {
  app.post('/api/galleries', galleryCrud.create);
  app.get('/api/galleries', galleryCrud.readAll);
  app.get('/api/galleries/:id', galleryCtrl.getGalleryById);
  app.put('/api/galleries/:id', galleryCrud.update);
  app.delete('/api/galleries/:id', galleryCrud.delete);
};