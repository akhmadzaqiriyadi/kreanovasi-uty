import { expect, test } from "@playwright/test";

test.describe("System Pages E2E Tests", () => {
  test("should display custom error boundary page on error", async ({
    page,
  }) => {
    // Suppress console error logs for this test to avoid polluting output
    page.on("pageerror", () => {});

    await page.goto("/test-error");

    // Check error page header and warning state
    await expect(page.locator("text=Terjadi Kesalahan Aplikasi")).toBeVisible();
    await expect(
      page.locator(
        "text=Maaf atas ketidaknyamanan ini. Sistem mengalami kendala saat",
      ),
    ).toBeVisible();
  });

  test("should display custom loading skeleton then show content", async ({
    page,
  }) => {
    // Firefox loading test is slow under parallel browser execution on dev server.
    // Mark as slow to triple default timeout (30s -> 90s).
    test.slow();

    // "domcontentloaded" fires after RSC stream completes — #loaded-heading is in the
    // streamed HTML so it's already in DOM at this point, without waiting for JS chunks.
    // "load" blocks on Firefox until all 40+ Turbopack chunks download (can exceed 30s).
    await page.goto("/test-loading", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    // Content is server-streamed — assert it's present after streaming resolves (1500ms delay).
    // Firefox reports each RSC chunk as a navigation event (~11 events), toBeVisible waits for
    // pending navigations, so we need a generous timeout to cover all streaming events.
    await expect(page.locator("#loaded-heading")).toBeVisible({
      timeout: 30000,
    });
    await expect(
      page.locator("text=Loaded Content Successfully"),
    ).toBeVisible();
  });

  test("should display custom 404 page on non-existent routes", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist-at-all");

    await expect(page.locator("text=Halaman Tidak Ditemukan")).toBeVisible();
    await expect(
      page.locator(
        "text=Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan",
      ),
    ).toBeVisible();
  });
});
