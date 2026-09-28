import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { name: "Android Narrow (360x780)", width: 360, height: 780 },
  { name: "iPhone SE (375x667)", width: 375, height: 667 },
  { name: "iPhone 14 / Modern (390x844)", width: 390, height: 844 },
];

const PUBLIC_PAGES = [
  { path: "/", name: "Landing Page" },
  { path: "/booking", name: "Room Catalog" },
  { path: "/booking/new", name: "New Booking Form" },
  { path: "/my-bookings", name: "My Bookings" },
  { path: "/events", name: "Events Catalog" },
  {
    path: "/events/uch-demo-day-dan-startup-pitch-fest-2026",
    name: "Event Detail Page",
  },
  { path: "/articles", name: "Articles Catalog" },
  {
    path: "/articles/pkm-corner-akselerasi-kreativitas-mahasiswa-menuju-pimnas",
    name: "Article Detail Page",
  },
  { path: "/about", name: "About Page" },
  { path: "/notifications", name: "Notifications" },
  { path: "/settings", name: "Settings Page" },
  { path: "/dashboard", name: "User Dashboard" },
];

for (const vp of VIEWPORTS) {
  test.describe(`Responsiveness on ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const p of PUBLIC_PAGES) {
      test(`should render ${p.name} (${p.path}) without horizontal overflow`, async ({
        page,
      }) => {
        await page.goto(p.path, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);

        const overflowInfo = await page.evaluate(() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const bodyScrollWidth = document.body.scrollWidth;

          // Find any overflowing elements
          const overflowingElements: string[] = [];
          const all = document.querySelectorAll("*");
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 1.5) {
              const tag = el.tagName.toLowerCase();
              const cls = (el.className || "").toString().slice(0, 50);
              overflowingElements.push(
                `${tag}.${cls} (right: ${rect.right}, max: ${docWidth})`,
              );
              if (overflowingElements.length >= 3) break;
            }
          }

          return {
            docWidth,
            scrollWidth,
            bodyScrollWidth,
            hasOverflow:
              scrollWidth > docWidth + 1 || bodyScrollWidth > docWidth + 1,
            overflowingElements,
          };
        });

        expect(
          overflowInfo.hasOverflow,
          `Page ${p.path} has horizontal overflow: ${JSON.stringify(overflowInfo)}`,
        ).toBe(false);

        // Verify footer is rendered and fully visible (no opacity: 0 bug)
        const footerLocator = page.locator("#site-footer");
        await expect(footerLocator).toBeVisible();

        const footerInfo = await page.evaluate(() => {
          const footer = document.querySelector("#site-footer");
          if (!footer) return { exists: false, opacity: 0, childrenCount: 0 };
          const style = window.getComputedStyle(footer);
          const grid = footer.querySelector(".grid");
          return {
            exists: true,
            opacity: parseFloat(style.opacity || "1"),
            childrenCount: grid ? grid.children.length : 0,
          };
        });
        expect(footerInfo.exists, `Footer missing on page ${p.path}`).toBe(
          true,
        );
        expect(
          footerInfo.opacity,
          `Footer opacity < 0.9 on page ${p.path}`,
        ).toBeGreaterThan(0.9);
        expect(
          footerInfo.childrenCount,
          `Footer columns missing on page ${p.path}`,
        ).toBe(4);
      });
    }

    test("should render Admin Dashboard all tabs without horizontal overflow", async ({
      page,
    }) => {
      // Login as admin
      await page.goto("/");
      const masukBtn = page.getByRole("button", { name: "Masuk" });
      if (await masukBtn.isVisible()) {
        await masukBtn.click();
        await page.locator("#loginId").fill("admin@gozaq.com");
        await page.locator("#loginPass").fill("Admin123!");
        await page.getByRole("button", { name: "Masuk Sekarang" }).click();
        await page.waitForTimeout(1000);
      }

      await page.goto("/admin", { waitUntil: "domcontentloaded" });
      await expect(
        page.getByRole("heading", { name: "Dashboard Administrator" }),
      ).toBeVisible({ timeout: 10000 });

      // Check all 6 tabs
      const tabs = ["overview", "rooms", "bookings", "users", "roles", "audit"];
      for (const tabValue of tabs) {
        const tabTrigger = page
          .locator(
            `button[role="tab"][data-state][value="${tabValue}"], [role="tab"]:has-text("${tabValue}")`,
          )
          .first();
        if (await tabTrigger.isVisible()) {
          await tabTrigger.click();
          await page.waitForTimeout(300);
        }

        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          return scrollWidth > docWidth + 1;
        });

        expect(
          overflow,
          `Admin tab ${tabValue} caused horizontal overflow on ${vp.name}`,
        ).toBe(false);
      }
    });
  });
}
