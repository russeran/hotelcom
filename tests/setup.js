// Shared setup for API tests: connect to a dedicated test database, wipe data
// between tests, and tear down afterwards. Uses the locally running mongod.
process.env.NODE_ENV = 'test';
process.env.SECRET = process.env.SECRET || 'test_secret';

const mongoose = require('mongoose');

const TEST_DB = process.env.TEST_DATABASE_URL || 'mongodb://127.0.0.1:27017/hotelcom_test';

beforeAll(async () => {
    await mongoose.connect(TEST_DB);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

// Helpers shared by tests.
global.decodeToken = (token) =>
    JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
