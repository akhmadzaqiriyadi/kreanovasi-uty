import { expect, test } from "@playwright/test";

test.describe("Events & Agenda Pages E2E Tests", () => {
  test("should load /events without 404 and display catalog with event items", async ({
    page,
  }) => {
    await page.goto("/events");

    // Check main heading in hero
    await expect(
      page.getByRole("heading", {
        name: /Agenda & Program/i,
      }),
    ).toBeVisible();

    // Check timeline filter tabs exist
    await expect(
      page.getByRole("button", { name: /Akan Datang/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Telah Berlalu/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Semua Agenda/i }),
    ).toBeVisible();

    // Check search input exists
    await expect(page.locator("#search-events")).toBeVisible();

    // Check presence of key event cards
    await expect(
      page.getByText("UCH Demo Day & Startup Pitch Fest 2026").first(),
    ).toBeVisible();
    await expect(
      page.getByText("Workshop FastLab: Prototyping Smart IoT & AI").first(),
    ).toBeVisible();
  });

  test("should filter events when searching keyword", async ({ page }) => {
    await page.goto("/events");

    const searchInput = page.locator("#search-events");
    await searchInput.fill("FastLab");

    // FastLab event should be visible
    await expect(
      page.getByText("Workshop FastLab: Prototyping Smart IoT & AI").first(),
    ).toBeVisible();

    // Non-matching events should be hidden
    await expect(
      page.getByText("UCH Demo Day & Startup Pitch Fest 2026"),
    ).not.toBeVisible();
  });

  test("should open event detail page /events/[slug] and display complete details", async ({
    page,
  }) => {
    await page.goto("/events");

    // Click on FastLab event card link
    const eventLink = page
      .getByRole("link", {
        name: /Workshop FastLab: Prototyping Smart IoT & AI/i,
      })
      .first();
    await eventLink.click();

    // Verify URL
    await expect(page).toHaveURL(
      /\/events\/workshop-fastlab-prototyping-iot-dan-ai-dengan-esp32/,
    );

    // Verify event detail elements
    await expect(
      page.getByRole("heading", {
        name: "Workshop FastLab: Prototyping Smart IoT & AI",
      }),
    ).toBeVisible();
    await expect(page.getByText("Tentang Agenda")).toBeVisible();
    await expect(page.getByText("Susunan Rundown Acara")).toBeVisible();
    await expect(page.getByText("Narasumber & Mentor Ahli")).toBeVisible();
    await expect(
      page.getByText("Laboratorium FastLab UCH").first(),
    ).toBeVisible();
  });

  test("should show 'Acara Telah Selesai' for past events", async ({
    page,
  }) => {
    await page.goto(
      "/events/workshop-fastlab-prototyping-iot-dan-ai-dengan-esp32",
    );

    const pastBtn = page.getByRole("button", {
      name: /Acara Telah Selesai/i,
    });
    await expect(pastBtn).toBeVisible();
    await expect(pastBtn).toBeDisabled();
  });

  test("should require login when guest clicks registration button on upcoming event", async ({
    page,
  }) => {
    // Clear storage to ensure guest state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto(
      "/events/creative-talk-ui-ux-design-system-dan-product-scale",
    );

    const loginToRegisterBtn = page.getByRole("button", {
      name: /Masuk untuk Mendaftar/i,
    });
    await expect(loginToRegisterBtn).toBeVisible();
    await loginToRegisterBtn.click();

    // Auth modal should open
    await expect(
      page.getByRole("heading", { name: "Masuk ke Akun Anda" }),
    ).toBeVisible();
  });

  test("should allow authenticated user to register and see e-ticket barcode", async ({
    page,
  }) => {
    // Intercept auth profile to keep mock user logged in
    await page.route("**/auth/profile", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUCCESS",
          message: "User profile",
          data: {
            id: "usr-e2e-123",
            name: "Ahmad Fauzi",
            email: "fauzi@students.uty.ac.id",
            role: "mahasiswa",
            role_label: "Mahasiswa Aktif",
            id_number: "5210411122",
            id_label: "NPM",
            affiliation: "Informatika UTY",
          },
        }),
      });
    });

    // Intercept registration API call with mock success
    await page.route("**/events/*/register", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          code: "CREATED",
          message: "Pendaftaran agenda berhasil dikonfirmasi",
          data: {
            id: "reg-mock-123",
            registration_code: "UCH-EVT-CTALK-2026",
            event_id: "creative-talk-ui-ux-design-system",
            status: "approved",
            full_name: "Ahmad Fauzi",
            institution: "Informatika UTY",
            email: "fauzi@students.uty.ac.id",
            phone: "081234567890",
          },
        }),
      });
    });

    await page.goto("/");

    // Setup authenticated user state in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "uch_access_token",
        "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjI1MjQ2MDgwMDB9.mockSignature",
      );
      localStorage.setItem(
        "uch_user_profile",
        JSON.stringify({
          id: "usr-e2e-123",
          name: "Ahmad Fauzi",
          email: "fauzi@students.uty.ac.id",
          role: "mahasiswa",
          roleLabel: "Mahasiswa Aktif",
          idNumber: "5210411122",
          idLabel: "NPM",
          affiliation: "Informatika UTY",
          npm: "5210411122",
          prodi: "Informatika",
          phone: "081234567890",
          avatarUrl: "/images/room1.jpeg",
          permissions: [],
        }),
      );
    });

    await page.goto(
      "/events/creative-talk-ui-ux-design-system-dan-product-scale",
    );

    // Click Daftar Sekarang button
    const registerBtn = page.getByRole("button", { name: "Daftar Sekarang" });
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    // Dialog should be open with autofilled identity
    await expect(
      page.getByText("Formulir Pendaftaran Agenda Resmi"),
    ).toBeVisible();

    // Check autofill
    await expect(page.locator("#fullName")).toHaveValue("Ahmad Fauzi");
    await expect(page.locator("#email")).toHaveValue(
      "fauzi@students.uty.ac.id",
    );

    // Fill phone if empty
    await page.locator("#phone").fill("081234567890");

    // Submit form
    await page.getByRole("button", { name: /Konfirmasi Pendaftaran/i }).click();

    // Expect success message and confirmation code
    await expect(page.locator("text=Pendaftaran Berhasil")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Nomor Tiket Peserta")).toBeVisible();
    await expect(page.getByText("UCH-EVT-CTALK-2026")).toBeVisible();
  });

  test("should allow authenticated user to view /my-events page with tickets", async ({
    page,
  }) => {
    // Intercept auth profile to keep mock user logged in
    await page.route("**/auth/profile", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUCCESS",
          message: "User profile",
          data: {
            id: "usr-e2e-123",
            name: "Ahmad Fauzi",
            email: "fauzi@students.uty.ac.id",
            role: "mahasiswa",
            role_label: "Mahasiswa Aktif",
            id_number: "5210411122",
            id_label: "NPM",
            affiliation: "Informatika UTY",
          },
        }),
      });
    });

    // Intercept my-event-registrations
    await page.route("**/my-event-registrations*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "SUCCESS",
          message: "Daftar registrasi berhasil diambil",
          data: {
            registrations: [
              {
                id: "reg-mock-123",
                registration_code: "UCH-EVT-CTALK-2026",
                event_id: "creative-talk-ui-ux-design-system",
                event_title:
                  "Creative Talk: Membangun Design System untuk Skala Produk",
                event_slug:
                  "creative-talk-ui-ux-design-system-dan-product-scale",
                event_date: "Sabtu, 10 Oktober 2026",
                event_time: "09:30 - 12:00 WIB",
                event_location: "Coworking Space UTY Creative Hub",
                full_name: "Ahmad Fauzi",
                institution: "Informatika UTY",
                email: "fauzi@students.uty.ac.id",
                phone: "081234567890",
                status: "approved",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ],
            pagination: { page: 1, limit: 20, total_items: 1, total_pages: 1 },
          },
        }),
      });
    });

    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem(
        "uch_access_token",
        "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjI1MjQ2MDgwMDB9.mockSignature",
      );
      localStorage.setItem(
        "uch_user_profile",
        JSON.stringify({
          id: "usr-e2e-123",
          name: "Ahmad Fauzi",
          email: "fauzi@students.uty.ac.id",
          role: "mahasiswa",
          roleLabel: "Mahasiswa Aktif",
          idNumber: "5210411122",
          idLabel: "NPM",
          affiliation: "Informatika UTY",
          avatarUrl: "/images/room1.jpeg",
          permissions: [],
        }),
      );
    });

    await page.goto("/my-events");

    // Check page header
    await expect(
      page.getByRole("heading", { name: "Tiket & Agenda Saya" }),
    ).toBeVisible();

    // Check tabs
    await expect(page.getByRole("button", { name: /Semua/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Tiket Aktif/i }),
    ).toBeVisible();

    // Check ticket item is rendered
    await expect(page.getByText("UCH-EVT-CTALK-2026")).toBeVisible();
    await expect(
      page.getByText(
        "Creative Talk: Membangun Design System untuk Skala Produk",
      ),
    ).toBeVisible();

    // Click Barcode QR button
    const qrBtn = page.getByRole("button", { name: /Buka Barcode QR/i });
    await expect(qrBtn).toBeVisible();
    await qrBtn.click();

    // Modal should show
    await expect(page.getByText("E-Tiket Check-In Resmi")).toBeVisible();
  });

  test("should return 404 for invalid event slug", async ({ page }) => {
    await page.goto("/events/slug-agenda-yang-tidak-ada-sama-sekali");
    await expect(page.locator("text=Halaman Tidak Ditemukan")).toBeVisible();
  });
});
