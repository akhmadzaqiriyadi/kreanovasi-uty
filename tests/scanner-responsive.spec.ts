import { expect, test } from "@playwright/test";

const MOBILE_VIEWPORTS = [
  { name: "Narrow Mobile (360x780)", width: 360, height: 780 },
  { name: "iPhone SE (375x667)", width: 375, height: 667 },
  { name: "iPhone 14 (390x844)", width: 390, height: 844 },
];

for (const vp of MOBILE_VIEWPORTS) {
  test.describe(`Scanner Modal Responsiveness on ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test.beforeEach(async ({ page }) => {
      // Inject authenticated user session directly into localStorage
      await page.addInitScript(() => {
        window.localStorage.setItem("uch_access_token", "mock-token-admin");
        window.localStorage.setItem(
          "uch_user_profile",
          JSON.stringify({
            id: "admin-1",
            name: "Zaenal Arif",
            email: "admin@gozaq.com",
            role: "admin",
            roleLabel: "System Administrator",
            idLabel: "Admin ID",
            prodi: "Unit Manajemen Sistem",
          }),
        );
      });
    });

    test("should open User Scan Masuk modal without horizontal overflow", async ({
      page,
    }) => {
      await page.goto("/my-bookings", { waitUntil: "domcontentloaded" });
      await expect(
        page.getByRole("heading", { name: /booking saya/i }),
      ).toBeVisible({ timeout: 10000 });

      // Click "Scan Masuk" button
      const scanButton = page.getByRole("button", { name: /scan masuk/i });
      await expect(scanButton).toBeVisible();
      await scanButton.click();

      // Modal dialog should open
      const dialog = page.getByRole("dialog", { name: /scan/i });
      await expect(dialog).toBeVisible({ timeout: 5000 });

      // Check overflow on viewport and dialog
      const layoutCheck = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const dialogEl = document.querySelector("[role='dialog']");
        const dialogWidth = dialogEl ? dialogEl.clientWidth : 0;
        const dialogScrollWidth = dialogEl ? dialogEl.scrollWidth : 0;

        return {
          docWidth,
          scrollWidth,
          dialogWidth,
          dialogScrollWidth,
          hasWindowOverflow: scrollWidth > docWidth + 2,
          hasDialogOverflow: dialogScrollWidth > dialogWidth + 2,
        };
      });

      expect(layoutCheck.hasWindowOverflow).toBe(false);
      expect(layoutCheck.hasDialogOverflow).toBe(false);

      // Verify tabs are visible and switch to manual input
      const manualTab = page.getByRole("button", {
        name: "Input Manual",
        exact: true,
      });
      await expect(manualTab).toBeVisible();
      await manualTab.click({ force: true });

      // Check input manual form fits viewport
      const manualInput = page.getByPlaceholder(/UCH-2026-0001|coworking/i);
      await expect(manualInput).toBeVisible();

      const inputCheck = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const inputEl = document.querySelector("#manual-code");
        if (!inputEl) return false;
        const rect = inputEl.getBoundingClientRect();
        return rect.right <= docWidth;
      });
      expect(inputCheck).toBe(true);

      // Close modal
      const closeButton = page.getByRole("button", { name: /batal/i });
      await closeButton.click();
      await expect(dialog).not.toBeVisible();
    });

    test("should open Admin Scan QR modal without horizontal overflow", async ({
      page,
    }) => {
      await page.goto("/admin", { waitUntil: "domcontentloaded" });
      await expect(
        page.getByRole("heading", { name: "Dashboard Administrator" }),
      ).toBeVisible({ timeout: 10000 });

      // Click Bookings (Reservasi) tab
      const bookingsTab = page.getByRole("tab", { name: "Reservasi" });
      await expect(bookingsTab).toBeVisible({ timeout: 5000 });
      await bookingsTab.click();

      // Click "Scan QR" button
      const scanQrBtn = page.getByRole("button", { name: /scan qr/i });
      await expect(scanQrBtn).toBeVisible({ timeout: 5000 });
      await scanQrBtn.click();

      // Check admin scanner dialog
      const dialog = page.getByRole("dialog", { name: /check-in/i });
      await expect(dialog).toBeVisible({ timeout: 5000 });

      const layoutCheck = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const dialogEl = document.querySelector("[role='dialog']");
        const dialogWidth = dialogEl ? dialogEl.clientWidth : 0;
        const dialogScrollWidth = dialogEl ? dialogEl.scrollWidth : 0;

        return {
          docWidth,
          scrollWidth,
          dialogWidth,
          dialogScrollWidth,
          hasWindowOverflow: scrollWidth > docWidth + 2,
          hasDialogOverflow: dialogScrollWidth > dialogWidth + 2,
        };
      });

      expect(layoutCheck.hasWindowOverflow).toBe(false);
      expect(layoutCheck.hasDialogOverflow).toBe(false);

      // Switch to manual input
      const manualTab = page.getByRole("button", {
        name: "Input Manual",
        exact: true,
      });
      await expect(manualTab).toBeVisible();
      await manualTab.click({ force: true });

      const cancelBtn = page.getByRole("button", { name: /batal/i });
      await cancelBtn.click();
      await expect(dialog).not.toBeVisible();
    });
  });
}
