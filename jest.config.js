module.exports = {
    transformIgnorePatterns: [
      "node_modules/(?!(axios)/)" // Transpile axios, add other libraries as necessary
    ],
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest" // Ensure Jest uses babel-jest for transformation
    }
  };
  