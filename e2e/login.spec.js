import { test, expect } from "@playwright/test";

test("user logs in", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder(/email/i).fill("admin@taskflow.com");
  await page.getByPlaceholder(/password/i).fill("Admin1234");

  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
  await expect(page.getByRole("link", { name: /logout/i })).toBeVisible({ timeout: 10000 });
});

// tests/login.spec.js
// import { test, expect } from "@playwright/test";

// test("home page opens", async ({ page }) => {
//   await page.goto("http://localhost:5172");
//   await expect(page).toHaveTitle(/Task/i);
// });
