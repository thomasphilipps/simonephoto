const Gallery = require('../models/gallery.model');
// We inject our Gallery model into the CRUD factory:
const crud = require('../controllers/crud')(Gallery);
const galleryController = require('../controllers/galleryController')();

module.exports = (app) => {
    // Bind each CRUD action to an endpoint
    app.post('/api/galleries', crud.create);
    app.get('/api/galleries', crud.readAll);
    app.get('/api/galleries/:id', galleryController.getGalleryById);
    app.put('/api/galleries/:id', crud.update);
    app.delete('/api/galleries/:id', crud.delete);

};

