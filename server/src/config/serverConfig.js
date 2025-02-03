const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'test') {
  require('./database');
}

// 1) GLOBAL MIDDLEWARES
app.use(express.json()); // For JSON body parsing

// 2) SIMPLE ENDPOINT TO TEST SERVER UP
app.get('/', (req, res) => {
  res.json('API online');
});

// 3) ROUTES (Inject 'app' into the routes module)
const galleryRoutes = require('../routes/gallery.routes');
galleryRoutes(app);
const pictureRoutes = require('../routes/picture.routes');
pictureRoutes(app);
const categoryRoutes = require('../routes/category.routes');
categoryRoutes(app);
const reviewRoutes = require('../routes/review.routes');
reviewRoutes(app);

// 4) EXPORT THE CONFIGURED EXPRESS INSTANCE
module.exports = app;
