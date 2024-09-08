// src/config/mongoClient.js
const { MongoClient } = require('mongodb');
const config = require('./config');

let client;

async function connectMongoClient() {
  if (!client) {
    client = new MongoClient(config.mongoose.url);
    await client.connect();
    console.log('Connected to MongoDB using MongoClient');
  }
  return client;
}

async function getCollection(collectionName) {
  const client = await connectMongoClient();
  const database = client.db('Test_Database');  // TO-DEPLOY: the database name should be "Unimelb_Handbook"
  return database.collection(collectionName);
}

module.exports = {
  connectMongoClient,
  getCollection,
};
