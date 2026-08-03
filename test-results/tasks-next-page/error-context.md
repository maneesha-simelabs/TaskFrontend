# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tasks.spec.js >> next page
- Location: e2e\tasks.spec.js:63:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Next' })

```

# Page snapshot

```yaml
- generic [ref=f1e2]:
  - main [ref=f1e4]:
    - complementary [ref=f1e5]:
      - heading "TaskFlow" [level=1] [ref=f1e6]
      - paragraph [ref=f1e7]: Organize your work. Track your progress. Achieve more every day.
      - generic [ref=f1e8]:
        - heading "Today's Progress" [level=2] [ref=f1e9]
        - generic [ref=f1e10]: ✔ Authentication Module
        - generic [ref=f1e11]: ✔ Dashboard UI
        - generic [ref=f1e12]: ○ API Integration
        - generic [ref=f1e13]: ○ Unit Testing
        - generic [ref=f1e15]:
          - generic [ref=f1e16]: Project Progress
          - generic [ref=f1e17]: 74%
    - region [ref=f1e20]:
      - generic [ref=f1e21]:
        - heading "Welcome Back 👋" [level=2] [ref=f1e22]
        - paragraph [ref=f1e23]: Sign in to continue managing your tasks.
        - generic [ref=f1e25]:
          - text: Email
          - textbox "Enter your email" [ref=f1e26]
        - generic [ref=f1e27]:
          - generic [ref=f1e28]:
            - text: Password
            - textbox "Enter password" [ref=f1e29]
          - button "Show password" [ref=f1e30] [cursor=pointer]
        - generic [ref=f1e34]:
          - generic [ref=f1e35]:
            - checkbox "Remember me" [ref=f1e36]
            - text: Remember me
          - button "Forgot Password?" [ref=f1e37]
        - button "Login" [ref=f1e38] [cursor=pointer]
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
  10 |   await expect(page.getByRole("button", { name: "Add Task" })).toBeVisible();
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
> 71 |     .click();
     |      ^ Error: locator.click: Test timeout of 30000ms exceeded.
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