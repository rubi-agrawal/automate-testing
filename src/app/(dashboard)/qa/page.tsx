"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  GitBranch,
  TestTube2,
  Layers,
  Monitor,
  RefreshCw,
} from "lucide-react";

const testSuites = [
  {
    name: "Unit Tests",
    framework: "Jest",
    path: "tests/unit/",
    description: "Utility functions, auth logic, API validations",
    command: "npm run test:unit",
    coverage: "85%",
    icon: TestTube2,
  },
  {
    name: "Integration Tests",
    framework: "Jest + Supertest",
    path: "tests/integration/",
    description: "API routes with MongoDB Memory Server",
    command: "npm run test:integration",
    coverage: "78%",
    icon: Layers,
  },
  {
    name: "Frontend Tests",
    framework: "React Testing Library",
    path: "tests/components/",
    description: "Component rendering, forms, validation",
    command: "npm run test:components",
    coverage: "82%",
    icon: Monitor,
  },
  {
    name: "E2E Tests",
    framework: "Playwright",
    path: "playwright/",
    description: "Signup, login, task CRUD, logout flows",
    command: "npm run test:e2e",
    coverage: "72%",
    icon: FlaskConical,
  },
];

const regressionWorkflow = [
  "Reusable test suites in tests/regression/",
  "Automated re-run on every push via GitHub Actions",
  "Coverage reports uploaded as CI artifacts",
  "Build fails if any test suite fails",
];

export default function QAPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">QA & Testing Module</h2>
        <p className="text-muted-foreground">
          Complete automated testing architecture for regression and quality assurance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {testSuites.map((suite) => {
          const Icon = suite.icon;
          return (
            <Card key={suite.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {suite.name}
                  </CardTitle>
                  <Badge variant="success">{suite.coverage}</Badge>
                </div>
                <CardDescription>{suite.framework}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{suite.description}</p>
                <p className="text-xs text-muted-foreground font-mono">{suite.path}</p>
                <code className="block rounded bg-muted px-2 py-1 text-xs">{suite.command}</code>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Regression Testing Workflow
          </CardTitle>
          <CardDescription>
            Ensures old features continue working after updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {regressionWorkflow.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            CI/CD Pipeline
          </CardTitle>
          <CardDescription>GitHub Actions workflow at .github/workflows/ci.yml</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {["Install dependencies", "Run ESLint", "Run unit tests", "Run integration tests", "Run Playwright E2E", "Generate coverage reports"].map(
              (step) => (
                <div key={step} className="flex items-center gap-2 rounded-lg border p-2">
                  <Badge variant="outline">Step</Badge>
                  {step}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coverage Reports</CardTitle>
          <CardDescription>Generated after running npm run test:coverage</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-1 font-mono text-muted-foreground">
          <p>coverage/lcov-report/index.html — HTML report</p>
          <p>coverage/coverage-summary.json — JSON summary</p>
          <p>Console output — displayed during CI runs</p>
        </CardContent>
      </Card>
    </div>
  );
}
