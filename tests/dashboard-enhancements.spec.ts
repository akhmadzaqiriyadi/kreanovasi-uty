import { expect, test } from "@playwright/test";

test.describe("Dashboard Enhancements & Profile E2E", () => {
  test.beforeEach(async ({ page }) => {
    page.on("request", (req) => {
      console.log(`[REQUEST] ${req.method()} ${req.url()}`);
    });
    page.on("response", (res) => {
      console.log(`[RESPONSE] ${res.status()} ${res.url()}`);
    });
  });

  test("should register, show onboarding, complete profile, and update details", async ({
    page,
  }) => {
    // Set up listener BEFORE navigating — refresh response arrives during page hydration
    const initialRefreshPromise = page.waitForResponse(
      "**/api-proxy/auth/refresh",
    );
    await page.goto("/register");
    await initialRefreshPromise;

    const email = `test-user-${Date.now()}@example.com`;
    await page.locator("input#name").fill("John Doe");
    await page.locator("input#email").fill(email);
    await page.locator("input#password").fill("password123");
    await page.locator("input#confirmPassword").fill("password123");

    // Click register and wait for API proxy response
    const submitPromise = page.waitForResponse("**/api-proxy/auth/register");
    await page.getByRole("button", { name: "Daftar", exact: true }).click();
    await submitPromise;

    // 2. Verified onboarding redirect
    await expect(page).toHaveURL(/.*\/dashboard\/welcome/);
    await expect(page.locator("text=Selamat Datang, John Doe!")).toBeVisible();

    // 3. Follow link to profile setup
    await page.locator("text=Lengkapi Profil Saya").click();
    await expect(page).toHaveURL(/.*\/dashboard\/profile/);

    // 4. Submit form name update
    const profileNameInput = page.locator("input#profile-name");
    await expect(profileNameInput).toHaveValue("John Doe");
    await profileNameInput.fill("Johnathan Doe");

    // Wait for patch request
    const patchPromise = page.waitForResponse("**/api-proxy/auth/me");
    await page
      .getByRole("button", { name: "Simpan Perubahan", exact: true })
      .click();
    await patchPromise;

    // 5. Verify updated details reflect in header
    await expect(
      page.locator("h2").filter({ hasText: "Johnathan Doe" }),
    ).toBeVisible();

    // 6. Return back to dashboard
    await page.locator("text=Kembali ke Dashboard").click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
