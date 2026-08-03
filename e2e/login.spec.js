import { test, expect } from "@playwright/test";

test("user logs in", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("Email").fill("admin@taskflow.com");

  await page.getByPlaceholder("Password").fill("Admin1234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/");
});

// tests/login.spec.js
// import { test, expect } from "@playwright/test";

// test("home page opens", async ({ page }) => {
//   await page.goto("http://localhost:5172");
//   await expect(page).toHaveTitle(/Task/i);
// });
