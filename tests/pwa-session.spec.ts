import { expect, test } from "@playwright/test";

test.describe("PWA & Persistent Session Integration", () => {
  test("1. should serve PWA manifest with correct icons and metadata", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify Manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", "/manifest.webmanifest");

    // Fetch and verify manifest JSON content
    const manifestResponse = await page.request.get("/manifest.webmanifest");
    expect(manifestResponse.ok()).toBeTruthy();
    const manifestJson = await manifestResponse.json();
    expect(manifestJson.name).toBe("UTY Creative Hub");
    expect(manifestJson.short_name).toBe("UCH Apps");
    expect(manifestJson.display).toBe("standalone");
    expect(manifestJson.icons.length).toBeGreaterThanOrEqual(4);

    // Verify Apple touch icon
    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleIcon).toHaveAttribute("href", "/apple-touch-icon.png");

    // Verify theme color meta
    const themeColorMeta = page.locator('meta[name="theme-color"]').first();
    await expect(themeColorMeta).toBeAttached();
  });

  test("2. should automatically restore session using refresh token on page load", async ({
    page,
  }) => {
    // 1. Perform login via API to obtain fresh credentials
    const loginRes = await page.request.post(
      "http://localhost:8080/api/v1/auth/login",
      {
        data: {
          email: "zaqi@students.uty.ac.id",
          password: "Password123!",
        },
      },
    );
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const { refresh_token, user } = loginData.data;

    // 2. Open page as guest, but inject refresh_token into localStorage (simulating returning user after access token expiry)
    await page.goto("/");
    await page.evaluate(
      ({ rToken, userData }) => {
        // Purposely do not provide access token or provide expired token
        localStorage.removeItem("uch_access_token");
        localStorage.setItem("uch_refresh_token", rToken);
        localStorage.setItem("uch_user_profile", JSON.stringify(userData));
      },
      { rToken: refresh_token, userData: user },
    );

    // 3. Reload page and verify that user profile is automatically verified and session is active
    await page.reload();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 10000 });

    // Verify that a new valid access token was silently obtained and stored
    const storedAccessToken = await page.evaluate(() =>
      localStorage.getItem("uch_access_token"),
    );
    expect(storedAccessToken).toBeTruthy();
  });
});
