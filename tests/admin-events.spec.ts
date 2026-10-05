import { expect, test } from "@playwright/test";

test.describe("Admin & Committee Event Management E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept auth profile to authenticate as admin
    await page.route("**/auth/profile", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUCCESS",
          message: "Admin profile",
          data: {
            id: "usr-admin-123",
            name: "Administrator UCH",
            email: "admin@gozaq.com",
            role: "admin",
            role_label: "System Administrator",
            id_number: "ADM-001",
            id_label: "Admin ID",
            affiliation: "Unit Manajemen Sistem",
            permissions: [
              "events:read",
              "events:manage",
              "events:create",
              "events:update",
              "events:delete",
              "users:read",
              "roles:manage",
            ],
          },
        }),
      });
    });

    // Intercept registrations API
    await page.route("**/events/registrations*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUCCESS",
          message: "Daftar registrasi admin",
          data: {
            registrations: [
              {
                id: "reg-001",
                registration_code: "UCH-EVT-CTALK-2026",
                event_id: "creative-talk-ui-ux-design-system",
                event_title:
                  "Creative Talk: Membangun Design System untuk Skala Produk",
                full_name: "Budi Santoso",
                identity_number: "5210411999",
                institution: "Informatika UTY",
                email: "budi@students.uty.ac.id",
                phone: "081298765432",
                status: "pending_review",
                payment_proof_url: "/images/porto1.jpeg",
                answers: {
                  portfolio_url: "https://dribbble.com/budi",
                  laptop_ready: "Sudah siap",
                },
                notes: "Mohon konfirmasi pendaftaran saya",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: "reg-002",
                registration_code: "UCH-EVT-FASTLAB-2026",
                event_id: "workshop-fastlab-prototyping-iot-dan-ai-dengan-esp32",
                event_title: "Workshop FastLab: Prototyping Smart IoT & AI",
                full_name: "Citra Lestari",
                identity_number: "5210411888",
                institution: "Teknik Elektro UTY",
                email: "citra@students.uty.ac.id",
                phone: "081345678901",
                status: "approved",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ],
            pagination: { page: 1, limit: 10, total_items: 2, total_pages: 1 },
          },
        }),
      });
    });

    // Intercept verification status update
    await page.route("**/events/registrations/*/status", async (route) => {
      const json = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUCCESS",
          message: "Status peserta berhasil diperbarui",
          data: {
            id: "reg-001",
            status: json.status,
            admin_notes: json.admin_notes,
          },
        }),
      });
    });

    // Intercept check-in
    await page.route("**/events/checkin", async (route) => {
      const json = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUCCESS",
          message: `Check-in berhasil! Selamat datang Budi Santoso`,
          data: {
            id: "reg-001",
            registration_code: json.registration_code,
            full_name: "Budi Santoso",
            institution: "Informatika UTY",
            status: "attended",
          },
        }),
      });
    });

    // Intercept create event
    await page.route("**/events", async (route) => {
      if (route.request().method() === "POST") {
        const json = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            code: "CREATED",
            message: "Agenda baru berhasil dipublikasikan",
            data: {
              id: "evt-new-123",
              title: json.title,
              slug: json.slug,
              status: "published",
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Setup localStorage auth credentials
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "uch_access_token",
        "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjI1MjQ2MDgwMDB9.mockSignature",
      );
      localStorage.setItem(
        "uch_user_profile",
        JSON.stringify({
          id: "usr-admin-123",
          name: "Administrator UCH",
          email: "admin@gozaq.com",
          role: "admin",
          roleLabel: "System Administrator",
          idNumber: "ADM-001",
          idLabel: "Admin ID",
          affiliation: "Unit Manajemen Sistem",
          permissions: [
            "events:read",
            "events:manage",
            "events:create",
            "events:update",
            "events:delete",
            "users:read",
            "roles:manage",
          ],
        }),
      );
    });
  });

  test("should render Admin Event tab in /admin dashboard with metrics", async ({
    page,
  }) => {
    await page.goto("/admin");

    // Click Agenda tab
    const agendaTab = page.getByRole("tab", { name: /Agenda/i });
    await expect(agendaTab).toBeVisible();
    await agendaTab.click();

    // Verify main header and controls
    await expect(
      page.getByText("Panel Kendali Panitia Event UCH"),
    ).toBeVisible();

    // Verify metrics cards exist
    await expect(page.getByText("Total Pendaftar")).toBeVisible();
    await expect(page.getByText("Menunggu Verifikasi")).toBeVisible();
    await expect(page.getByText("Tiket Terbit (Aktif)")).toBeVisible();
    await expect(page.getByText("Telah Hadir (Check-In)")).toBeVisible();

    // Verify action buttons
    await expect(
      page.getByRole("button", { name: /Scan Tiket QR/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Tambah Event Baru/i }),
    ).toBeVisible();
  });

  test("should display registrations list and allow viewing participant details", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByRole("tab", { name: /Agenda/i }).click();

    // Verify participant Budi Santoso is rendered
    await expect(page.getByText("Budi Santoso")).toBeVisible();
    await expect(page.getByText("UCH-EVT-CTALK-2026")).toBeVisible();

    // Click Detail button
    const detailButtons = page.getByRole("button", { name: "Detail" });
    await detailButtons.first().click();

    // Dialog should show details
    await expect(
      page.getByRole("heading", { name: "Budi Santoso" }),
    ).toBeVisible();
    await expect(page.getByText("Bukti Pembayaran / Transfer:")).toBeVisible();
    await expect(page.getByText("https://dribbble.com/budi")).toBeVisible();

    // Close detail modal
    await page.getByRole("button", { name: "Tutup" }).first().click();
  });

  test("should allow committee to approve registration", async ({ page }) => {
    await page.goto("/admin");
    await page.getByRole("tab", { name: /Agenda/i }).click();

    // Click Setuju button on pending registration
    const approveBtn = page.getByRole("button", { name: "Setuju" }).first();
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Confirm dialog should open
    await expect(page.getByText("Setujui & Terbitkan Tiket")).toBeVisible();

    // Submit confirmation
    await page.getByRole("button", { name: "Konfirmasi" }).click();

    // Verify toast notification
    await expect(
      page.locator("text=Status peserta berhasil diperbarui"),
    ).toBeVisible({ timeout: 5000 });
  });

  test("should allow committee to request revision with notes", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByRole("tab", { name: /Agenda/i }).click();

    // Click Revisi button
    const revisiBtn = page.getByRole("button", { name: "Revisi" }).first();
    await expect(revisiBtn).toBeVisible();
    await revisiBtn.click();

    // Modal opens
    await expect(page.getByText("Minta Revisi Berkas")).toBeVisible();

    // Type revision notes
    const textarea = page.getByPlaceholder(
      /Bukti transfer tidak jelas/i,
    );
    await textarea.fill("Foto bukti transfer buram, mohon upload ulang.");

    // Submit
    await page.getByRole("button", { name: "Konfirmasi" }).click();

    // Verify toast notification
    await expect(
      page.locator("text=Status peserta berhasil diperbarui"),
    ).toBeVisible({ timeout: 5000 });
  });

  test("should open QR Scanner modal and perform manual ticket check-in", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByRole("tab", { name: /Agenda/i }).click();

    // Open scanner modal
    await page.getByRole("button", { name: /Scan Tiket QR/i }).click();
    await expect(
      page.getByRole("heading", { name: "Scan Tiket Barcode Peserta" }),
    ).toBeVisible();

    // Switch to manual input tab
    await page.getByRole("button", { name: "Ketik Manual" }).click();

    // Type registration code
    const input = page.getByPlaceholder("UCH-EVT-...");
    await input.fill("UCH-EVT-CTALK-2026");

    // Click verify
    await page.getByRole("button", { name: "Verifikasi Tiket" }).click();

    // Confirmation banner should be displayed
    await expect(page.getByText("Kehadiran Terkonfirmasi!")).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page
        .getByLabel("Scan Tiket Barcode Peserta")
        .getByText("Budi Santoso"),
    ).toBeVisible();
  });

  test("should open create event modal and publish new event", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByRole("tab", { name: /Agenda/i }).click();

    // Open create modal
    await page.getByRole("button", { name: /Tambah Event Baru/i }).click();
    await expect(
      page.getByRole("heading", { name: "Publikasikan Event UCH" }),
    ).toBeVisible();

    // Fill form
    await page
      .getByPlaceholder(/AI & IoT FastLab Bootcamp/i)
      .fill("Next-Gen Web & AI Hackathon 2026");

    // Submit
    await page
      .getByRole("button", { name: "Publikasikan Agenda" })
      .click();

    // Toast success
    await expect(
      page.locator("text=Agenda baru berhasil dipublikasikan"),
    ).toBeVisible({ timeout: 5000 });
  });
});
