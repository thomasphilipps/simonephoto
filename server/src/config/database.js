const mongoose = require('mongoose');

// Environment related connexion URI
const mongoUri =
  process.env.NODE_ENV === 'production'
    ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority&appName=arcadia-zoo`
    : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`;

// MongoDB connexion
mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Connected to MongoDB');
  }
});

// Export the connexion object
// TODO: optional, see if it's useful
module.exports = db;
