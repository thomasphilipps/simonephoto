import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

let mongoServer;

export default async function globalSetup() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  console.log(`Test MongoDB connected: ${uri}`);

  return async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Test MongoDB disconnected');
  };
}