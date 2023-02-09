/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["ts", "js"],
  testMatch: ['**/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  // clearMocks: true,
};