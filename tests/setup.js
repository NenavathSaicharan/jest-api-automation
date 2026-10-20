const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongo;
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterEach(async () => {
  const cols = await mongoose.connection.db.collections();
  for (let i = 0; i < cols.length; i++) {
    await cols[i].deleteMany({});
  }
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});