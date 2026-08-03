import { test, expect } from "@playwright/test";

test("create task", async ({ page }) => {
  await login(page);
  await page.goto("/tasks");

  console.log(await page.url());

  console.log(await page.locator("body").textContent());
  await expect(page.getByRole("button", { name: "Add Task" })).toBeVisible();

  await page
    .getByRole("button", {
      name: "Add Task",
    })
    .click();

  await page.getByLabel("Title").fill("Learn Playwright2");

  await page.getByLabel("Description").fill("Finish E2E tutorial");

  await page.getByLabel("Priority").selectOption("High");
  await page.getByLabel("DueDate").fill("2026-02-02");
  await page.getByLabel("AssignTo").selectOption("6a5eea2ddc18848a4e71ab81");
  await page.getByLabel("Category").selectOption("Work");
  await page.getByLabel("Status").selectOption("Todo");

  await page
    .getByRole("button", {
      name: "Create",
    })
    .click();

  // await expect(page.getByText("Learn Playwright")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Learn Playwright/i }).first(),
  ).toBeVisible();
});

test("delete task", async ({ page }) => {
  await login(page);
  await page.goto("/tasks");

  await page.locator(".delete-btn").first().click();

  await expect(page.getByText(/delete task/i)).toBeVisible();
  await page.getByRole("button", { name: "Delete" }).click();
  // await page
  //   .getByRole("button", {
  //     name: "Delete",
  //   })
  //   .click();

  // await page
  //   .getByRole("button", {
  //     name: "Confirm",
  //   })
  //   .click();
  await expect(page.getByText("uccessfully Deleted a task")).toBeVisible();
  // await expect(page.getByText("Task deleted")).toBeVisible();
});

test("next page", async ({ page }) => {
  await login(page);
  await page.goto("/tasks");

  await page
    .getByRole("button", {
      name: "Next",
    })
    .click();

  await expect(page).toHaveURL(/page=2/);
});

async function login(page) {
  await page.goto("/login");

  await page.getByPlaceholder("Email").fill("admin@taskflow.com");
  await page.getByPlaceholder("Password").fill("Admin1234");

  await page.getByRole("button", { name: "Login" }).click();

  // await expect(page).toHaveURL(/tasks/);
}
