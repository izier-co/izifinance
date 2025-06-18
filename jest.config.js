export default {
  rootDir: ".",
  transform: {},
  moduleFileExtensions: ["mjs", "js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
