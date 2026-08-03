// import { defineConfig } from "@playwright/test";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  use: {
    baseURL: "http://localhost:5172",
    headless: false,
  },
});

// import { defineConfig } from "@playwright/test";

// export default defineConfig({
//   use: {
//     baseURL: "http://localhost:5172",
//   },

//   webServer: {
//     command: "npm run dev",
//     url: "http://localhost:5172",
//     reuseExistingServer: true,
//   },
// });

// export default defineConfig({
//   testDir: "./tests",

//   use: {
//     baseURL: "http://localhost:5172",
//     headless: false,
//     screenshot: "only-on-failure",
//     video: "retain-on-failure",
//   },
// });
