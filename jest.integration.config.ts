import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  displayName: "integration",
  testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
  testEnvironment: "node",
  globalSetup: "<rootDir>/tests/setup/globalSetup.ts",
  globalTeardown: "<rootDir>/tests/setup/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/integration.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  forceExit: true,
};

export default createJestConfig(config);
