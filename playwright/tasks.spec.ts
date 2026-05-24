import { test, expect } from "@playwright/test";

const email = `tasks-e2e-${Date.now()}@test.com`;
const password = "taskspass123";

test.beforeEach(async ({ page }) => {
  await page.goto("/signup");
  await page.getByTestId("name-input").fill("Task E2E User");
  await page.getByTestId("email-input").fill(email);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("signup-button").click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
});

test.describe("Task Management Flow", () => {
  test("task creation flow", async ({ page }) => {
    await page.goto("/tasks");
    await page.getByTestId("create-task-btn").click();
    await expect(page.getByTestId("task-dialog")).toBeVisible();
    await page.getByTestId("task-title").fill("E2E Test Task");
    await page.getByTestId("task-priority").selectOption("high");
    await page.getByTestId("task-status").selectOption("todo");
    await page.getByTestId("task-submit").click();
    await expect(page.getByText("E2E Test Task")).toBeVisible({ timeout: 10000 });
  });

  test("task update flow", async ({ page }) => {
    await page.goto("/tasks");
    await page.getByTestId("create-task-btn").click();
    await page.getByTestId("task-title").fill("Task To Update");
    await page.getByTestId("task-submit").click();
    await expect(page.getByText("Task To Update")).toBeVisible({ timeout: 10000 });
    await page.getByTestId(/edit-task-/).first().click();
    await page.getByTestId("task-status").selectOption("in_progress");
    await page.getByTestId("task-submit").click();
    await expect(page.getByText("in progress")).toBeVisible({ timeout: 10000 });
  });
});
