import { expect, test } from "@playwright/test";

const MOBILE_VIEWPORTS = [
  { name: "Narrow Mobile (360x780)", width: 360, height: 780 },
  { name: "iPhone SE (375x667)", width: 375, height: 667 },
  { name: "iPhone 14 (390x844)", width: 390, height: 844 },
];

for (const vp of MOBILE_VIEWPORTS) {
  test.describe(`Dropdown Responsiveness on ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("should keep Room Select dropdown within viewport bounds on /booking/new", async ({
      page,
    }) => {
      // Mock auth to allow viewing /booking/new without redirect
      await page.addInitScript(() => {
        window.localStorage.setItem("uch_access_token", "mock-token-user");
        window.localStorage.setItem(
          "uch_user_profile",
          JSON.stringify({
            id: "user-1",
            name: "Budi Santoso",
            email: "budi@student.uty.ac.id",
            role: "mahasiswa",
            npm: "5200411100",
            prodi: "Informatika",
          }),
        );
      });

      await page.goto("/booking/new", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      // Locate the room select trigger
      const roomTrigger = page.locator("button", {
        hasText: /pilih ruangan yang ingin dipinjam|co-working/i,
      });

      if (await roomTrigger.isVisible()) {
        await roomTrigger.click();
        await page.waitForTimeout(300);

        // Check dropdown popover bounds
        const bounds = await page.evaluate(() => {
          const docWidth = document.documentElement.clientWidth;
          const popper = document.querySelector(
            "[data-radix-popper-content-wrapper], [role='listbox']",
          );
          if (!popper) return { found: false, overflow: false };
          const rect = popper.getBoundingClientRect();
          return {
            found: true,
            right: rect.right,
            width: rect.width,
            docWidth,
            overflow: rect.right > docWidth + 1,
          };
        });

        expect(bounds.found).toBe(true);
        expect(
          bounds.overflow,
          `Room select dropdown overflows right: ${JSON.stringify(bounds)}`,
        ).toBe(false);
      }
    });

    test("should keep Admin Status Filter select within viewport bounds on /admin", async ({
      page,
    }) => {
      // Admin session
      await page.addInitScript(() => {
        window.localStorage.setItem("uch_access_token", "mock-token-admin");
        window.localStorage.setItem(
          "uch_user_profile",
          JSON.stringify({
            id: "admin-1",
            name: "Zaenal Arif",
            email: "admin@gozaq.com",
            role: "admin",
          }),
        );
      });

      await page.goto("/admin", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      // Open Bookings tab
      const bookingsTab = page.getByRole("tab", { name: "Reservasi" });
      if (await bookingsTab.isVisible()) {
        await bookingsTab.click();
        await page.waitForTimeout(300);

        // Click status filter trigger
        const filterTrigger = page
          .locator("button", {
            hasText: /semua status/i,
          })
          .first();

        if (await filterTrigger.isVisible()) {
          await filterTrigger.click();
          await page.waitForTimeout(300);

          const bounds = await page.evaluate(() => {
            const docWidth = document.documentElement.clientWidth;
            const popper = document.querySelector(
              "[data-radix-popper-content-wrapper], [role='listbox']",
            );
            if (!popper) return { found: false, overflow: false };
            const rect = popper.getBoundingClientRect();
            return {
              found: true,
              right: rect.right,
              width: rect.width,
              docWidth,
              overflow: rect.right > docWidth + 1,
            };
          });

          expect(bounds.found).toBe(true);
          expect(
            bounds.overflow,
            `Admin status filter dropdown overflows right: ${JSON.stringify(bounds)}`,
          ).toBe(false);
        }
      }
    });
  });
}
