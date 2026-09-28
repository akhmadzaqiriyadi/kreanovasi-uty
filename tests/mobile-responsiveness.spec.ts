import { expect, test } from "@playwright/test";

test.describe("Mobile Responsiveness Audit", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE screen size

  test("should open auth modal and fit within mobile screen bounds", async ({
    page,
  }) => {
    await page.goto("/");
    // On mobile, the Masuk button is rendered directly in header
    const masukBtn = page.getByRole("button", { name: "Masuk" });
    await expect(masukBtn).toBeVisible();
    await masukBtn.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(375);
      expect(box.height).toBeLessThanOrEqual(667);
    }

    // Switch to Register Tab
    await page.getByRole("button", { name: "Daftar Akun" }).click();
    await expect(
      page.getByRole("heading", { name: "Pendaftaran Akun Baru" }),
    ).toBeVisible();

    const regBox = await dialog.boundingBox();
    expect(regBox).not.toBeNull();
    if (regBox) {
      expect(regBox.width).toBeLessThanOrEqual(375);
      expect(regBox.height).toBeLessThanOrEqual(667);
    }

    // Check submit button is accessible
    const submitBtn = page.getByRole("button", { name: "Daftar Sekarang" });
    await expect(submitBtn).toBeVisible();
  });

  test("should render admin dashboard cleanly without horizontal scroll on mobile", async ({
    page,
  }) => {
    // Login as Admin
    await page.goto("/");
    const masukBtn = page.getByRole("button", { name: "Masuk" });
    await expect(masukBtn).toBeVisible();
    await masukBtn.click();

    await page.locator("#loginId").fill("admin@gozaq.com");
    await page.locator("#loginPass").fill("Admin123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    // Wait for auth to complete and navigate to Admin
    await page.waitForTimeout(1000);
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Dashboard Administrator" }),
    ).toBeVisible();

    // Check horizontal overflow on mobile
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Switch tabs to Ruangan on mobile
    await page.getByRole("tab", { name: "Ruangan" }).click();
    const addRoomBtn = page.getByRole("button", { name: "Tambah Ruangan" });
    await expect(addRoomBtn).toBeVisible();

    // Open Tambah Ruangan modal and verify bounds
    await addRoomBtn.click();
    const roomModal = page.getByRole("dialog");
    await expect(roomModal).toBeVisible();

    const roomBox = await roomModal.boundingBox();
    expect(roomBox).not.toBeNull();
    if (roomBox) {
      expect(roomBox.width).toBeLessThanOrEqual(375);
      expect(roomBox.height).toBeLessThanOrEqual(667);
    }
  });
});
