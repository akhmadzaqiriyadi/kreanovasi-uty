import { expect, test } from "@playwright/test";

test.describe("Authentication E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    page.on("request", (req) => {
      console.log(`[REQUEST] ${req.method()} ${req.url()}`);
    });
    page.on("response", (res) => {
      console.log(`[RESPONSE] ${res.status()} ${res.url()}`);
    });
  });

  test("should redirect unauthenticated guest users trying to access dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator("text=Selamat Datang Kembali")).toBeVisible();
  });

  test("should successfully login, access dashboard, and logout", async ({
    page,
  }) => {
    // Set up listener BEFORE navigating — refresh response arrives during page hydration
    const initialRefreshPromise = page.waitForResponse(
      "**/api-proxy/auth/refresh",
    );
    await page.goto("/login");
    await initialRefreshPromise;

    const emailInput = page.locator("input#email");
    const passwordInput = page.locator("input#password");
    const submitBtn = page.getByRole("button", { name: "Masuk", exact: true });

    // 1. Submit incorrect credentials
    let responsePromise = page.waitForResponse("**/api-proxy/auth/login");
    await emailInput.fill("invalid-user@example.com");
    await passwordInput.fill("wrongpassword");
    await submitBtn.click();
    await responsePromise;
    await expect(
      page.locator("text=Email atau password salah").first(),
    ).toBeVisible();

    // 2. Submit correct credentials
    responsePromise = page.waitForResponse("**/api-proxy/auth/login");
    await emailInput.fill("user@example.com");
    await passwordInput.fill("password123");
    await submitBtn.click();
    await responsePromise;

    // Should be redirected to /dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator("text=Admin Panel").first()).toBeVisible();
    await expect(page.locator("text=Jekz Dev").first()).toBeVisible();

    // 3. Prevent logged-in users from accessing login again
    await page.goto("/login");
    await expect(page).toHaveURL(/.*\/dashboard/);

    // 4. Logout
    const logoutResponsePromise = page.waitForResponse(
      "**/api-proxy/auth/logout",
    );
    const logoutBtn = page.locator("button[title='Keluar']").first();
    await logoutBtn.click();
    await logoutResponsePromise;
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("should automatically perform silent token refresh on 401 response", async ({
    page,
  }) => {
    // Set up listener BEFORE navigating — response arrives during page load
    const initialRefreshPromise = page.waitForResponse(
      "**/api-proxy/auth/refresh",
    );

    await page.goto("/login");
    await initialRefreshPromise;

    const loginResponsePromise = page.waitForResponse(
      "**/api-proxy/auth/login",
    );
    await page.locator("input#email").fill("user@example.com");
    await page.locator("input#password").fill("password123");
    await page.getByRole("button", { name: "Masuk", exact: true }).click();
    await loginResponsePromise;
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Set up listeners BEFORE reload — responses arrive immediately after
    const refreshResponsePromise = page.waitForResponse(
      "**/api-proxy/auth/refresh",
    );
    const meResponsePromise = page.waitForResponse("**/api-proxy/auth/me");

    await page.reload();

    const refreshRes = await refreshResponsePromise;
    const meRes = await meResponsePromise;

    expect(refreshRes.status()).toBe(200);
    expect(meRes.status()).toBe(200);
    await expect(page.locator("text=Admin Panel").first()).toBeVisible();
  });
});
