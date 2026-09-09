import { expect, test } from "@playwright/test";

test.describe("Landing Page E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local home page before each test
    await page.goto("/");
  });

  test("should display main heading logo", async ({ page }) => {
    // Check main logo text
    const logoText = page.locator("header span:has-text('UCH')");
    await expect(logoText).toBeVisible();
  });

  test("should verify anchor link scrolling targets exist", async ({
    page,
  }) => {
    // Check that sections with matching IDs exist in DOM
    await expect(page.locator("section#features")).toBeVisible();
    await expect(page.locator("section#dx")).toBeVisible();
    await expect(page.locator("section#feedback")).toBeVisible();
  });

  test("should trigger form validation errors on invalid inputs", async ({
    page,
  }) => {
    const feedbackSection = page.locator("section#feedback");
    await feedbackSection.scrollIntoViewIfNeeded();

    const nameInput = feedbackSection.locator("input#name");
    const emailInput = feedbackSection.locator("input#email");
    const submitBtn = feedbackSection.locator("button[type='submit']");

    // 1. Submit empty form
    await submitBtn.click();
    await expect(
      feedbackSection.locator("text=Name must be at least"),
    ).toBeVisible();
    await expect(
      feedbackSection.locator("text=Email is required"),
    ).toBeVisible();

    // 2. Fill invalid email format
    await nameInput.fill("Jekz Developer");
    await emailInput.fill("invalid-email-format");
    await submitBtn.click();

    await expect(
      feedbackSection.locator("text=Invalid email address format"),
    ).toBeVisible();
  });

  test("should display custom 404 page for non-existent routes", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("text=Halaman Tidak Ditemukan")).toBeVisible();
    await expect(
      page.locator("text=Maaf, halaman yang Anda cari tidak ada"),
    ).toBeVisible();
  });
});
