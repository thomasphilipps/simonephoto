import mongoose from 'mongoose';

const {NODE_ENV, MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_DB_NAME} = process.env;

const mongoUri = NODE_ENV === 'production'
  ? `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=arcadia-zoo`
  : `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB_NAME}`;

mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  if (NODE_ENV !== 'production') {
    console.log('Connected to MongoDB');
  }
});

export default db;