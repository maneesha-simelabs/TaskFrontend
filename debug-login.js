const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("console", (msg) => console.log("BROWSER", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGEERROR", err.message));
  page.on("requestfailed", (req) =>
    console.log("FAILED", req.url(), req.failure()?.errorText),
  );
  page.on("response", async (res) => {
    if (res.url().includes("/auth/login")) {
      console.log("LOGIN_RESPONSE", res.status(), await res.text());
    }
  });

  await page.goto("http://127.0.0.1:5172/login");
  await page
    .locator('input[placeholder="Enter your email"]')
    .fill("admin@taskflow.com");
  await page.locator('input[placeholder="Enter password"]').fill("Admin1234");
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForTimeout(4000);
  console.log("URL_AFTER_LOGIN", page.url());
  console.log("BODY", await page.locator("body").textContent());
  await browser.close();
})();
