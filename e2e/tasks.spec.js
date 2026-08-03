import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("create task", async ({ page }) => {
  await login(page);
  await page.goto("/tasks");

  await expect(page.getByRole("button", { name: /add task/i })).toBeVisible();

  await page.getByRole("button", { name: /add task/i }).click();

  await page.getByLabel(/title/i).fill("Learn Playwright2");
  await page.getByLabel(/description/i).fill("Finish E2E tutorial");
  await page.getByLabel(/priority/i).selectOption("High");
  await page.getByLabel(/duedate/i).fill("2026-02-02");

  const assignSelect = page.locator('select[name="assignedTo"]');
  await expect(assignSelect).toBeVisible({ timeout: 10000 });
  const assignOptionCount = await assignSelect
    .locator("option")
    .count()
    .catch(() => 0);
  if (assignOptionCount > 1) {
    await assignSelect.selectOption({ index: 1 });
  } else {
    await assignSelect.selectOption({ value: "" });
  }

  const categorySelect = page.locator('select[name="category"]');
  await expect(categorySelect).toBeVisible({ timeout: 10000 });
  const categoryOptionCount = await categorySelect
    .locator("option")
    .count()
    .catch(() => 0);
  if (categoryOptionCount > 1) {
    await categorySelect.selectOption({ index: 1 });
  } else {
    await categorySelect.selectOption({ value: "" });
  }

  await page.locator('select[name="status"]').selectOption("Todo");

  await page.getByRole("button", { name: /create/i }).click();

  await expect(page.locator("body")).toContainText(
    /learn playwright2|finish e2e tutorial/i,
    { timeout: 10000 },
  );
});

test("delete task", async ({ page }) => {
  await login(page);
  await page.goto("/tasks");

  await expect(page.locator(".delete-btn").first()).toBeVisible();
  await page.locator(".delete-btn").first().click();

  await expect(page.getByText(/delete task/i)).toBeVisible();
  await page.getByRole("button", { name: /^delete$/i }).click();
  await expect(page.getByText("uccessfully Deleted a task")).toBeVisible();
});

test("next page", async ({ page }) => {
  await login(page);
  await page.goto("/tasks");

  const nextButton = page.getByRole("button", { name: /^next$/i });

  if (await nextButton.isVisible().catch(() => false)) {
    await nextButton.click();
    await expect(page).toHaveURL(/page=2/);
  } else {
    await expect(page).toHaveURL(/\/tasks(\?.*)?$/);
  }
});

async function login(page) {
  await page.goto("/login");

  await page.getByPlaceholder(/email/i).fill("admin@taskflow.com");
  await page.getByPlaceholder(/password/i).fill("Admin1234");

  await page.getByRole("button", { name: /login/i }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
  await expect(page.getByRole("link", { name: /logout/i })).toBeVisible({
    timeout: 10000,
  });
}
