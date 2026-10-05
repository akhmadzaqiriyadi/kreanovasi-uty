import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E testing configurations
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3005",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev -- -p 3005",
    url: "http://localhost:3005",
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
  },
});
