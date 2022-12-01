module.exports = {
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/test/cssTransform.ts',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.(ts|tsx)'],
};
