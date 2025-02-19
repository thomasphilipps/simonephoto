import mongoose from 'mongoose';

export default async function globalTeardown() {
  // Déconnecte mongoose et arrête le serveur en mémoire
  await mongoose.disconnect();
  await global.__MONGOD__.stop();
  console.log('Test MongoDB disconnected');
}
