import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 1,

  use: {
    baseURL: "http://127.0.0.1:5172",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --strictPort",
    url: "http://127.0.0.1:5172",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
