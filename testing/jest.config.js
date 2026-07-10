module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/../backend/src/services/**/*.js'],
  coverageDirectory: 'coverage',
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^bcrypt$': '<rootDir>/node_modules/bcrypt',
    '^jsonwebtoken$': '<rootDir>/node_modules/jsonwebtoken'
  },
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ]
};
