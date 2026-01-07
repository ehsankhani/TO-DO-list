/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.config.cjs" }],
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(svg|png|jpe?g|gif|webp)$": "<rootDir>/src/shared/test/fileMock.js",
  },
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
  clearMocks: true,
};


