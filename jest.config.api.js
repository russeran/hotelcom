// Jest config for backend/API tests (run via `npm run test:api`), kept separate
// from Create React App's own Jest (which runs the frontend `npm test`).
module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testTimeout: 30000,
};
