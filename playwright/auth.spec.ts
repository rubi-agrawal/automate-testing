import { test, expect } from "@playwright/test";

const uniqueEmail = `e2e-${Date.now()}@test.com`;
const password = "e2epassword123";
const name = "E2E Test User";

test.describe("Authentication Flow", () => {
  test("user signup flow", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("name-input").fill(name);
    await page.getByTestId("email-input").fill(uniqueEmail);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("signup-button").click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test("user login flow", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email-input").fill(uniqueEmail);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test("logout flow", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email-input").fill(uniqueEmail);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
