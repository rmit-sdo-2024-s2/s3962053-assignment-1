module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    "app.js",
    "models/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
  ],
  testMatch: [
    "**/tests/unit/**/*.test.js",
    "**/tests/integration/**/*.test.js"
  ]
};
