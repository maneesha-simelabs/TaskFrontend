# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tasks.spec.js >> create task
- Location: e2e\tasks.spec.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Add Task' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Add Task' })

```

```yaml
- main:
  - complementary:
    - heading "TaskFlow" [level=1]
    - paragraph: Organize your work. Track your progress. Achieve more every day.
    - heading "Today's Progress" [level=2]
    - text: ✔ Authentication Module ✔ Dashboard UI ○ API Integration ○ Unit Testing Project Progress 74%
  - region "Welcome Back 👋":
    - heading "Welcome Back 👋" [level=2]
    - paragraph: Sign in to continue managing your tasks.
    - text: Email
    - textbox "Enter your email"
    - text: Password
    - textbox "Enter password"
    - button "Show password"
    - checkbox "Remember me"
    - text: Remember me
    - button "Forgot Password?"
    - button "Login"
- region "Notifications Alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("create task", async ({ page }) => {
  4  |   await login(page);
  5  |   await page.goto("/tasks");
  6  | 
  7  |   console.log(await page.url());
  8  | 
  9  |   console.log(await page.locator("body").textContent());
> 10 |   await expect(page.getByRole("button", { name: "Add Task" })).toBeVisible();
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  11 | 
  12 |   await page
  13 |     .getByRole("button", {
  14 |       name: "Add Task",
  15 |     })
  16 |     .click();
  17 | 
  18 |   await page.getByLabel("Title").fill("Learn Playwright2");
  19 | 
  20 |   await page.getByLabel("Description").fill("Finish E2E tutorial");
  21 | 
  22 |   await page.getByLabel("Priority").selectOption("High");
  23 |   await page.getByLabel("DueDate").fill("2026-02-02");
  24 |   await page.getByLabel("AssignTo").selectOption("6a5eea2ddc18848a4e71ab81");
  25 |   await page.getByLabel("Category").selectOption("Work");
  26 |   await page.getByLabel("Status").selectOption("Todo");
  27 | 
  28 |   await page
  29 |     .getByRole("button", {
  30 |       name: "Create",
  31 |     })
  32 |     .click();
  33 | 
  34 |   // await expect(page.getByText("Learn Playwright")).toBeVisible();
  35 |   await expect(
  36 |     page.getByRole("heading", { name: /Learn Playwright/i }).first(),
  37 |   ).toBeVisible();
  38 | });
  39 | 
  40 | test("delete task", async ({ page }) => {
  41 |   await login(page);
  42 |   await page.goto("/tasks");
  43 | 
  44 |   await page.locator(".delete-btn").first().click();
  45 | 
  46 |   await expect(page.getByText(/delete task/i)).toBeVisible();
  47 |   await page.getByRole("button", { name: "Delete" }).click();
  48 |   // await page
  49 |   //   .getByRole("button", {
  50 |   //     name: "Delete",
  51 |   //   })
  52 |   //   .click();
  53 | 
  54 |   // await page
  55 |   //   .getByRole("button", {
  56 |   //     name: "Confirm",
  57 |   //   })
  58 |   //   .click();
  59 |   await expect(page.getByText("uccessfully Deleted a task")).toBeVisible();
  60 |   // await expect(page.getByText("Task deleted")).toBeVisible();
  61 | });
  62 | 
  63 | test("next page", async ({ page }) => {
  64 |   await login(page);
  65 |   await page.goto("/tasks");
  66 | 
  67 |   await page
  68 |     .getByRole("button", {
  69 |       name: "Next",
  70 |     })
  71 |     .click();
  72 | 
  73 |   await expect(page).toHaveURL(/page=2/);
  74 | });
  75 | 
  76 | async function login(page) {
  77 |   await page.goto("/login");
  78 | 
  79 |   await page.getByPlaceholder("Email").fill("admin@taskflow.com");
  80 |   await page.getByPlaceholder("Password").fill("Admin1234");
  81 | 
  82 |   await page.getByRole("button", { name: "Login" }).click();
  83 | 
  84 |   // await expect(page).toHaveURL(/tasks/);
  85 | }
  86 | 
```