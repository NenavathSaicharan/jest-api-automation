module.exports = {
  testEnvironment: 'node',
  maxWorkers: 1, // shared memory mongo
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
};
