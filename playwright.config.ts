import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E testing configurations
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // retries: 1 in dev catches chunk load flakiness from Turbopack under parallel browser load
  retries: process.env.CI ? 2 : 1,
  // Cap dev workers at 3 to avoid overloading Turbopack dev server with chunk requests
  workers: process.env.CI ? 1 : 3,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
});
