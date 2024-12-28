import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

clientPromise = new MongoClient(uri, options).connect();

export async function connectToDatabase() {
  if (!clientPromise) {
    clientPromise = new MongoClient(uri, options).connect();
  }

  try {
    client = await clientPromise;
    const db = client.db();
    return { db, client };
  } catch (e) {
    console.error(e);
    throw new Error('Failed to connect to database');
  }
}
