export default {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/src/function/statistics/median.js',
    'src/src/function/number/isPrime.js',
    'src/src/function/matrix/dotProduct.js',
    'src/src/function/combinatorics/combinations.js'
  ],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testTimeout: 10000
};
