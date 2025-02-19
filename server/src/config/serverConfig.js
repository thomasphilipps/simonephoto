import express from 'express';
import db from './database.js';
import galleryRoutes from '../routes/gallery.routes.js';
import pictureRoutes from '../routes/picture.routes.js';
import categoryRoutes from '../routes/category.routes.js';
import reviewRoutes from '../routes/review.routes.js';
import userRoutes from '../routes/user.routes.js';

const app = express();

if (process.env.NODE_ENV !== 'test') {
  await db;
}

app.use(express.json());

app.get('/', (req, res) => {
  res.json('API online');
});

galleryRoutes(app);
pictureRoutes(app);
categoryRoutes(app);
reviewRoutes(app);
userRoutes(app);

export default app;