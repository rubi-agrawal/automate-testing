import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "src/services/**/*.ts",
    "src/models/**/*.ts",
    "!src/**/*.d.ts",
  ],
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  testPathIgnorePatterns: ["/node_modules/", "/playwright/", "/.next/"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.ts"],
  forceExit: true,
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/integration/**/*.test.ts",
    "<rootDir>/tests/components/**/*.test.tsx",
    "<rootDir>/tests/regression/**/*.test.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
