import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';

export default async function globalSetup() {
  // Démarre le serveur Mongo en mémoire
  const mongoServer = await MongoMemoryServer.create();
  // Stocke l'instance dans une variable globale accessible par le teardown
  global.__MONGOD__ = mongoServer;
  const uri = mongoServer.getUri();

  // On passe l'URI en variable d'environnement (si ton code s'appuie sur process.env.MONGO_URI)
  process.env.MONGO_URI = uri;

  // Connexion à MongoDB
  await mongoose.connect(uri);
  console.log(`Test MongoDB connected: ${uri}`);
}
