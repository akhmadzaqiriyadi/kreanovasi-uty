import { expect, test } from "@playwright/test";

test.describe("Landing Page E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display main heading logo and branding", async ({ page }) => {
    // Check main logo text in header
    const logoText = page.locator("header").first().locator("text=CREATIVE");
    await expect(logoText).toBeVisible();

    // Check UCH and UTY Creative Hub in hero section
    await expect(
      page.locator("text=Innovate. Collaborate. Create.").first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "UTY Creative Hub" }),
    ).toBeVisible();
  });

  test("should display primary action buttons in hero", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Jelajahi Program" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Cek Jadwal" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Book Now" }).first(),
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
