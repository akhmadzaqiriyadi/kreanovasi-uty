import { expect, test } from "@playwright/test";

test.describe("Admin Audit Logs", () => {
  test("should display audit logs with category filter and search", async ({
    page,
  }) => {
    // 1. Login as Admin
    await page.goto("/");
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("admin@gozaq.com");
    await page.locator("#loginPass").fill("Admin123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // 2. Navigate to Admin Dashboard
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Dashboard Administrator" }),
    ).toBeVisible();

    // 3. Switch to Audit Log tab
    const auditTab = page.getByRole("tab", { name: "Audit Log" });
    await expect(auditTab).toBeVisible();
    await auditTab.click();

    // 4. Verify Audit Log header and filter controls
    await expect(
      page.getByText("Audit Trail & Jejak Aktivitas Sistem"),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Cari aksi spesifik (contoh: room, booking, user)...",
      ),
    ).toBeVisible();

    // 5. Check category select trigger exists
    const categorySelect = page.getByRole("combobox").first();
    await expect(categorySelect).toBeVisible();

    // 6. Test searching for "booking"
    const searchInput = page.getByPlaceholder(
      "Cari aksi spesifik (contoh: room, booking, user)...",
    );
    await searchInput.fill("booking");

    // Wait for filtered logs to render
    await page.waitForTimeout(1000);

    // Verify reset filter button appears
    const resetBtn = page.getByRole("button", { name: "Reset Filter" });
    await expect(resetBtn).toBeVisible();

    // Reset filter
    await resetBtn.click();
    await expect(searchInput).toHaveValue("");
  });
});
