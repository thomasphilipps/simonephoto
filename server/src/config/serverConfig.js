const express = require('express');
const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(express.json()); // For JSON body parsing

// 2) SIMPLE ENDPOINT TO TEST SERVER UP
app.get('/', (req, res) => {
    res.json('API online');
});

// 3) ROUTES (Inject 'app' into the routes module)
const galleryRoutes = require('../routes/gallery.routes');
galleryRoutes(app);

// 4) EXPORT THE CONFIGURED EXPRESS INSTANCE
module.exports = app;
