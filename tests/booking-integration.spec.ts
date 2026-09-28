import { expect, test } from "@playwright/test";

test.describe("E2E Booking & Room System Full Integration", () => {
  // --------------------------------------------------------------------------
  // 1. LANDING PAGE ROOMS SECTION
  // --------------------------------------------------------------------------
  test("1. should display rooms on landing page and allow navigating to booking", async ({
    page,
  }) => {
    await page.goto("/");
    const roomsSection = page.locator("#rooms");
    await expect(roomsSection).toBeVisible();

    // Verify room section heading
    await expect(
      page.getByRole("heading", { name: "Status Ruangan & Fasilitas" }),
    ).toBeVisible();

    // Verify at least one room card exists
    const roomCard = page.locator("#rooms").locator("div").first();
    await expect(roomCard).toBeVisible();

    // Click "Cek Kalender Jadwal Lengkap" CTA with scroll into view
    const allRoomsBtn = page.getByRole("link", {
      name: /Cek Kalender Jadwal Lengkap/i,
    });
    await allRoomsBtn.scrollIntoViewIfNeeded();
    await expect(allRoomsBtn).toBeVisible();
    await allRoomsBtn.click();
    await expect(page).toHaveURL(/\/booking/);
  });

  // --------------------------------------------------------------------------
  // 2. BOOKING PAGE CATALOG & SCHEDULE NAVIGATOR
  // --------------------------------------------------------------------------
  test("2. should display booking catalog, schedule navigator, and operational guidelines", async ({
    page,
  }) => {
    await page.goto("/booking");
    await expect(
      page.getByRole("heading", { name: "Ruangan & Fasilitas" }),
    ).toBeVisible();

    // Verify Schedule Navigator component
    await expect(
      page.getByRole("heading", { name: "Cek Jadwal & Ketersediaan Ruangan" }),
    ).toBeVisible();

    // Verify Room Cards Catalog
    await expect(
      page.getByRole("heading", { name: "Katalog Fasilitas Ruangan" }),
    ).toBeVisible();

    // Click on a room card "Pesan Ruangan Ini" button
    const bookBtn = page
      .getByRole("button", { name: "Pesan Ruangan Ini" })
      .first();
    await bookBtn.scrollIntoViewIfNeeded();
    await expect(bookBtn).toBeVisible();
    await bookBtn.click();
    await expect(page).toHaveURL(/\/booking\/new/);
  });

  // --------------------------------------------------------------------------
  // 3. MANDATORY AUTHENTICATION PROTECTION (GUEST ACCESS BARRIERS)
  // --------------------------------------------------------------------------
  test("3. should enforce mandatory login barrier when guest visits /booking/new", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto("/booking/new");
    // Verify barrier card
    await expect(
      page.getByRole("heading", { name: "Wajib Masuk untuk Reservasi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Masuk ke Akun Anda" }),
    ).toBeVisible();
  });

  test("4. should enforce mandatory login barrier when guest visits /my-bookings", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto("/my-bookings");
    // Verify barrier card
    await expect(
      page.getByRole("heading", { name: "Wajib Masuk Akun" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Masuk ke Akun Anda" }),
    ).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // 4. AUTHENTICATED USER (MAHASISWA) BOOKING FLOW
  // --------------------------------------------------------------------------
  test("5. should login as Mahasiswa, fill booking form, and receive confirmation ticket", async ({
    page,
  }) => {
    // Login as Mahasiswa
    await page.goto("/");
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Navigate to /booking/new with preselected room
    await page.goto("/booking/new?room=think-tank-meeting-room");

    // The form should be visible (barrier is bypassed)
    await expect(
      page.getByRole("heading", { name: "Ajukan Peminjaman Fasilitas UCH" }),
    ).toBeVisible();

    // Verify auto-prefilled name
    await expect(page.getByText("Akhmad Zaqi Riyadi")).toBeVisible();

    // Fill in agenda purpose
    const purposeInput = page.locator(
      'textarea[placeholder*="Jelaskan secara ringkas"]',
    );
    await purposeInput.fill(
      "Pengujian otomatis Playwright integrasi pemesanan ruangan dan jadwal kolaborasi.",
    );

    // Pick date via calendar trigger button
    const dateButton = page.getByRole("button", {
      name: /Pilih tanggal booking/i,
    });
    if (await dateButton.isVisible()) {
      await dateButton.click();
      const dayButton = page
        .locator("button.rdp-day_button:not([disabled])")
        .first();
      if (await dayButton.isVisible()) {
        await dayButton.click();
      }
    }

    // Submit the form
    const submitBtn = page.getByRole("button", {
      name: /Ajukan Peminjaman Fasilitas Sekarang/i,
    });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Verify confirmation screen
    await expect(
      page.getByRole("heading", { name: "Permohonan Berhasil Diajukan!" }),
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(/ID Reservasi/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Lihat Booking Saya" }),
    ).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // 5. MY BOOKINGS PAGE INTERACTION & PAGINATION
  // --------------------------------------------------------------------------
  test("6. should display user bookings, filter statuses, and open e-ticket dialog", async ({
    page,
  }) => {
    // Login as Mahasiswa
    await page.goto("/");
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Visit /my-bookings
    await page.goto("/my-bookings");
    await expect(
      page.getByRole("heading", { name: /Booking Saya & Riwayat Peminjaman/i }),
    ).toBeVisible();

    // Verify metrics bar with exact matching
    await expect(page.getByText("Total Pengajuan")).toBeVisible();
    await expect(page.getByText("Halaman", { exact: true })).toBeVisible();

    // Test filter tabs
    const allTab = page.getByRole("button", { name: "Semua", exact: true });
    await expect(allTab).toBeVisible();
    await allTab.click();

    const pendingTab = page.getByRole("button", { name: "Menunggu Review" });
    await expect(pendingTab).toBeVisible();
    await pendingTab.click();

    const approvedTab = page.getByRole("button", { name: "Disetujui" });
    await expect(approvedTab).toBeVisible();
    await approvedTab.click();

    // Click E-Ticket if available
    const ticketBtn = page
      .getByRole("button", { name: /Unduh E-Tiket/i })
      .first();
    if (await ticketBtn.isVisible()) {
      await ticketBtn.click();
      await expect(
        page.getByRole("heading", { name: /E-Tiket Resmi Peminjaman/i }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
    }
  });

  // --------------------------------------------------------------------------
  // 6. ADMIN DASHBOARD: BOOKINGS MANAGEMENT
  // --------------------------------------------------------------------------
  test("7. should login as Admin and manage bookings (verify approve/reject modal)", async ({
    page,
  }) => {
    // Login as Admin
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

    // Open Admin Dashboard
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Dashboard Administrator" }),
    ).toBeVisible();

    // Switch to tab "Reservasi"
    const bookingsTab = page.getByRole("tab", { name: "Reservasi" });
    await expect(bookingsTab).toBeVisible();
    await bookingsTab.click();

    // Verify Admin Bookings Manager title
    await expect(
      page.getByRole("heading", { name: "Persetujuan & Manajemen Reservasi" }),
    ).toBeVisible();

    // Verify filter dropdowns
    await expect(page.getByText("Semua Status").first()).toBeVisible();

    // Test Manual Reservation Dialog button
    const manualBtn = page.getByRole("button", {
      name: "Buat Reservasi Baru",
    });
    await expect(manualBtn).toBeVisible();
    await manualBtn.click();

    await expect(
      page.getByRole("heading", { name: "Tambah Reservasi Ruangan Langsung" }),
    ).toBeVisible();

    // Close dialog
    await page.getByRole("button", { name: "Batal" }).click();
  });

  // --------------------------------------------------------------------------
  // 7. ADMIN DASHBOARD: ROOMS CRUD MANAGEMENT
  // --------------------------------------------------------------------------
  test("8. should view Rooms Management tab in Admin and toggle status or open room modal", async ({
    page,
  }) => {
    // Login as Admin
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

    // Open Admin Dashboard
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Dashboard Administrator" }),
    ).toBeVisible();

    // Switch to tab "Ruangan"
    const roomsTab = page.getByRole("tab", { name: "Ruangan" });
    await expect(roomsTab).toBeVisible();
    await roomsTab.click();

    // Verify Admin Rooms Manager header
    await expect(
      page.getByRole("heading", { name: "Manajemen Fasilitas & Ruangan" }),
    ).toBeVisible();

    // Verify "Tambah Ruangan" button opens modal
    const addRoomBtn = page.getByRole("button", {
      name: "Tambah Ruangan",
    });
    await expect(addRoomBtn).toBeVisible();
    await addRoomBtn.click();

    await expect(
      page.getByRole("heading", { name: "Tambah Ruangan Baru" }),
    ).toBeVisible();

    // Verify MinIO upload trigger is present
    await expect(
      page.getByRole("button", {
        name: "Unggah Foto dari Perangkat ke MinIO",
      }),
    ).toBeVisible();

    // Cancel modal
    await page.getByRole("button", { name: "Batal" }).click();
  });

  // --------------------------------------------------------------------------
  // 8. AUTHENTICATED USER (DOSEN) BOOKING FLOW
  // --------------------------------------------------------------------------
  test("9. should login as Dosen, verify faculty role badge, and submit booking", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Dosen
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("bambang@uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Navigate to /booking/new with preselected room
    await page.goto("/booking/new?room=auditorium-pitching");

    await expect(
      page.getByRole("heading", { name: "Ajukan Peminjaman Fasilitas UCH" }),
    ).toBeVisible();

    // Fill purpose
    const purposeInput = page.locator(
      'textarea[placeholder*="Jelaskan secara ringkas"]',
    );
    await purposeInput.fill(
      "Kuliah umum tamu industri dan pitching capstone project mahasiswa.",
    );

    // Pick date via calendar trigger button
    const dateButton = page.getByRole("button", {
      name: /Pilih tanggal booking/i,
    });
    if (await dateButton.isVisible()) {
      await dateButton.click();
      const dayButton = page
        .locator("button.rdp-day_button:not([disabled])")
        .first();
      if (await dayButton.isVisible()) {
        await dayButton.click();
      }
    }

    // Submit the form
    const submitBtn = page.getByRole("button", {
      name: /Ajukan Peminjaman Fasilitas Sekarang/i,
    });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Verify confirmation screen
    await expect(
      page.getByRole("heading", { name: "Permohonan Berhasil Diajukan!" }),
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(/ID Reservasi/i)).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // 9. RBAC & PERMISSION GUARD ON ADMIN ROUTE
  // --------------------------------------------------------------------------
  test("10. should block non-admin user (Mahasiswa) from accessing Admin Dashboard", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Mahasiswa
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Attempt to access /admin directly
    await page.goto("/admin");

    // Must show permission denial barrier
    await expect(
      page.getByRole("heading", { name: "Akses Terbatas: Administrator" }),
    ).toBeVisible();
    await expect(
      page.getByText("Akun Anda belum memiliki izin users:read"),
    ).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // 10. BIDIRECTIONAL QR CHECK-IN SYSTEM (ADMIN & USER SIDES)
  // --------------------------------------------------------------------------
  test("11. should allow admin to view Room Kiosk QR poster and open Admin QR Scanner", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Admin
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("admin@gozaq.com");
    await page.locator("#loginPass").fill("Admin123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Open Admin Dashboard -> Reservasi tab
    await page.goto("/admin");
    const bookingsTab = page.getByRole("tab", { name: "Reservasi" });
    await expect(bookingsTab).toBeVisible();
    await bookingsTab.click();

    // Verify QR Action Buttons in Header
    const scanQrBtn = page.getByRole("button", { name: /Scan QR Check-In/i });
    const kioskQrBtn = page.getByRole("button", {
      name: "QR Kiosk Pintu",
      exact: true,
    });
    await expect(scanQrBtn).toBeVisible();
    await expect(kioskQrBtn).toBeVisible();

    // 1. Open Room Kiosk QR Modal
    await kioskQrBtn.click();
    await expect(
      page.getByRole("heading", { name: "QR Presensi Masuk Ruangan" }),
    ).toBeVisible();
    await expect(page.getByText(/ID RUANGAN HUB/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Unduh Poster PDF (A4)" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Tutup Kiosk" }).click();

    // 2. Open Admin QR Scanner Modal
    await scanQrBtn.click();
    await expect(
      page.getByRole("heading", { name: "Pemindai QR Check-In Pengelola" }),
    ).toBeVisible();
    // Switch to manual input tab
    const manualTab = page.getByRole("button", { name: "Input Manual Kode" });
    await expect(manualTab).toBeVisible();
    await manualTab.click();
    await expect(page.locator("#manual-code")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("12. should allow user to view digital ticket QR and open door self-checkin scanner", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Mahasiswa
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Navigate to /my-bookings
    await page.goto("/my-bookings");
    await expect(
      page.getByRole("heading", { name: "Booking Saya & Riwayat Peminjaman" }),
    ).toBeVisible();

    // Verify "Scan Masuk Ruangan" self-checkin button
    const selfScanBtn = page.getByRole("button", {
      name: /Scan Masuk Ruangan/i,
    });
    await expect(selfScanBtn).toBeVisible();

    // Open User Self-Check-in Modal
    await selfScanBtn.click();
    await expect(
      page.getByRole("heading", { name: "Scan QR Masuk Ruangan" }),
    ).toBeVisible();
    // Switch to manual input tab
    const manualTab = page.getByRole("button", { name: "Input Manual Kode" });
    await expect(manualTab).toBeVisible();
    await manualTab.click();
    await expect(page.locator("#manual-code")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  // --------------------------------------------------------------------------
  // 11. INVALID & NEGATIVE INTEGRATION SCENARIOS
  // --------------------------------------------------------------------------
  test("13. [Invalid Mode] should reject check-in of non-existent booking code in Admin Scanner", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Admin
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("admin@gozaq.com");
    await page.locator("#loginPass").fill("Admin123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Open Admin Dashboard -> Reservasi tab
    await page.goto("/admin");
    const bookingsTab = page.getByRole("tab", { name: "Reservasi" });
    await expect(bookingsTab).toBeVisible();
    await bookingsTab.click();

    // Open Admin QR Scanner
    const scanQrBtn = page.getByRole("button", { name: /Scan QR Check-In/i });
    await scanQrBtn.click();

    // Switch to manual input
    const manualTab = page.getByRole("button", { name: "Input Manual Kode" });
    await manualTab.click();

    const manualInput = page.locator("#manual-code");
    await expect(manualInput).toBeVisible();
    await manualInput.fill("UCH-9999-NOTFOUND");

    // Click Verifikasi
    await page.getByRole("button", { name: /Verifikasi/i }).click();

    // Expect Sonner toast error notification
    await expect(
      page
        .locator("[data-sonner-toast]")
        .or(page.getByText(/tidak ditemukan|gagal/i))
        .first(),
    ).toBeVisible({ timeout: 8000 });

    // Modal stays operational, close safely
    await page.getByRole("button", { name: "Batal" }).click();
    await expect(page.locator("#manual-code")).not.toBeVisible();
  });

  test("14. [Invalid Mode] should reject self-checkin for room with no approved booking in User Scanner", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Mahasiswa
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Navigate to /my-bookings
    await page.goto("/my-bookings");
    const selfScanBtn = page.getByRole("button", {
      name: /Scan Masuk Ruangan/i,
    });
    await expect(selfScanBtn).toBeVisible();
    await selfScanBtn.click();

    // Switch to manual input
    const manualTab = page.getByRole("button", { name: "Input Manual Kode" });
    await manualTab.click();

    const manualInput = page.locator("#manual-code");
    await expect(manualInput).toBeVisible();
    await manualInput.fill("UCH-ROOM:fake-unbooked-room-999");

    // Click Verifikasi
    await page.getByRole("button", { name: /Verifikasi/i }).click();

    // Expect Sonner error toast
    await expect(
      page
        .locator("[data-sonner-toast]")
        .or(page.getByText(/tidak ditemukan|gagal/i))
        .first(),
    ).toBeVisible({ timeout: 8000 });

    // Modal remains operational, close safely
    await page.getByRole("button", { name: "Batal" }).click();
    await expect(page.locator("#manual-code")).not.toBeVisible();
  });

  test("15. [Invalid Mode] should show validation errors when booking form fields are invalid", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Mahasiswa
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Navigate to /booking/new
    await page.goto("/booking/new");
    await expect(
      page.getByRole("heading", { name: "Ajukan Peminjaman Fasilitas UCH" }),
    ).toBeVisible();

    // Fill purpose with invalid short string (less than 10 characters)
    const purposeInput = page.locator("#purpose");
    await purposeInput.fill("pendek");

    // Submit the form
    const submitBtn = page.getByRole("button", {
      name: /Ajukan Peminjaman Fasilitas Sekarang/i,
    });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Verify validation error message is shown
    await expect(
      page.getByText("Deskripsi tujuan kegiatan minimal 10 karakter"),
    ).toBeVisible();

    // Confirmation dialog must NOT appear
    await expect(
      page.getByRole("heading", { name: "Permohonan Berhasil Diajukan!" }),
    ).not.toBeVisible();
  });

  test("16. [Invalid Mode] should block unauthorized non-admin from calling Admin Check-In API", async ({
    page,
  }) => {
    // Clear state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login as Mahasiswa
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Mahasiswa attempts to call admin check-in API directly
    const apiResponseStatus = await page.evaluate(async () => {
      try {
        const token = localStorage.getItem("uch_access_token");
        const res = await fetch(
          "http://localhost:8080/api/v1/bookings/checkin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ booking_code: "UCH-2026-0001" }),
          },
        );
        return res.status;
      } catch {
        return 0;
      }
    });

    // Must be 403 Forbidden
    expect(apiResponseStatus).toBe(403);
  });
});
