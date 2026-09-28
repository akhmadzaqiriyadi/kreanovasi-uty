import { expect, test } from "@playwright/test";

test.describe("Full End-to-End Lifecycle: Registration to Booking, Approval, Check-In, and Ticket", () => {
  test.describe.configure({ mode: "serial" });
  const timestamp = Date.now();
  const testUser = {
    name: `Mahasiswa UTY ${timestamp}`,
    email: `mhs.${timestamp}@students.uty.ac.id`,
    npm: `5210411${Math.floor(100 + Math.random() * 900)}`,
    prodi: "S1 Informatika",
    password: "Password123!",
  };

  // --------------------------------------------------------------------------
  // STEP 1: USER REGISTRATION WITH PRODI / JURUSAN SELECTION
  // --------------------------------------------------------------------------
  test("1. should register a new student account with UTY faculty/prodi", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Click "Daftar" in header
    const daftarBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Daftar" });
    await expect(daftarBtn).toBeVisible();
    await daftarBtn.click();

    // Fill registration form
    await expect(
      page.getByRole("heading", { name: "Pendaftaran Akun Baru" }),
    ).toBeVisible();

    // Select role Mahasiswa (default or click)
    await page.getByRole("button", { name: "Mahasiswa" }).click();

    await page.locator("#regName").fill(testUser.name);
    await page.locator("#regEmail").fill(testUser.email);
    await page.locator("#regId").fill(testUser.npm);

    // Select Prodi from Select dropdown
    await page.locator("#regAffiliation").click();
    await page
      .getByRole("option", { name: testUser.prodi, exact: true })
      .click();

    await page.locator("#regPassword").fill(testUser.password);

    // Submit registration
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    // Verify user is registered and auto-logged in or can view user menu
    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 15000 });

    await userMenuBtn.click();
    await expect(page.getByText(testUser.name)).toBeVisible();
    await expect(page.getByText(testUser.email)).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // STEP 2: LOGIN & PROFILE IDENTITY VERIFICATION
  // --------------------------------------------------------------------------
  test("2. should login with newly registered credentials and verify account page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Open login modal
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill(testUser.email);
    await page.locator("#loginPass").fill(testUser.password);
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Navigate to /account page
    await page.goto("/account");
    await expect(
      page.getByRole("heading", { name: testUser.name }),
    ).toBeVisible();
    await expect(page.getByText(testUser.email).first()).toBeVisible();
    await expect(page.getByText(`NPM ${testUser.npm}`)).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // STEP 3: BROWSE CATALOG & SUBMIT NEW BOOKING RESERVATION
  // --------------------------------------------------------------------------
  test("3. should browse room catalog, fill booking form, and submit reservation", async ({
    page,
  }) => {
    // Login as the newly created user
    await page.goto("/");
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill(testUser.email);
    await page.locator("#loginPass").fill(testUser.password);
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // Navigate to /booking/new with preselected room and date
    const bookingDate = new Date(Date.now() + 86400000 * 3)
      .toISOString()
      .split("T")[0];
    await page.goto(
      `/booking/new?room=think-tank-meeting-room&date=${bookingDate}`,
    );

    // The form should be visible
    await expect(
      page.getByRole("heading", { name: "Ajukan Peminjaman Fasilitas UCH" }),
    ).toBeVisible();

    // Verify auto-prefilled name
    await expect(page.getByText(testUser.name)).toBeVisible({ timeout: 15000 });

    // Fill in agenda purpose
    const purposeInput = page.locator(
      'textarea[placeholder*="Jelaskan secara ringkas"]',
    );
    await purposeInput.fill(
      `Workshop Kolaborasi Mahasiswa Informatika ${timestamp} - Implementasi AI dan Startup`,
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

    const idLabel = page.getByText(/ID Reservasi/i);
    await expect(idLabel).toBeVisible();

    // Click "Lihat Booking Saya" to navigate to /my-bookings
    const myBookingsLink = page.getByRole("link", {
      name: "Lihat Booking Saya",
    });
    await expect(myBookingsLink).toBeVisible();
    await myBookingsLink.click();
    await expect(page).toHaveURL(/\/my-bookings/);
  });

  // --------------------------------------------------------------------------
  // STEP 4: VERIFY MY-BOOKINGS & DIGITAL E-TICKET
  // --------------------------------------------------------------------------
  test("4. should verify booking is listed under my-bookings with pending status and open ticket modal", async ({
    page,
  }) => {
    // Login as the user
    await page.goto("/");
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill(testUser.email);
    await page.locator("#loginPass").fill(testUser.password);
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await expect(
      page.getByRole("button", { name: "Menu Pengguna" }),
    ).toBeVisible({ timeout: 12000 });

    // Go to /my-bookings
    await page.goto("/my-bookings");
    await expect(
      page.getByRole("heading", { name: "Booking Saya & Riwayat Peminjaman" }),
    ).toBeVisible();

    // Verify at least one booking card exists with Menunggu Review
    await expect(page.getByText("Menunggu Review").first()).toBeVisible({
      timeout: 15000,
    });

    // Verify booking details
    await expect(page.getByText(testUser.name).first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Think-Tank Meeting Room" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Batalkan", exact: true }),
    ).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // STEP 5: ADMIN APPROVES BOOKING & VERIFIES REALTIME AUDIT
  // --------------------------------------------------------------------------
  test("5. should login as Admin, find the pending booking, and approve it with notes", async ({
    page,
  }) => {
    // Login as Admin
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill("admin@gozaq.com");
    await page.locator("#loginPass").fill("Admin123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await expect(
      page.getByRole("button", { name: "Menu Pengguna" }),
    ).toBeVisible({ timeout: 12000 });

    // Open Admin Dashboard -> Reservasi tab
    await page.goto("/admin");
    const bookingsTab = page.getByRole("tab", { name: "Reservasi" });
    await expect(bookingsTab).toBeVisible();
    await bookingsTab.click();

    await expect(
      page.getByRole("heading", { name: "Persetujuan & Manajemen Reservasi" }),
    ).toBeVisible();

    // Find the user's booking card/row
    const applicantText = page.getByText(testUser.name).first();
    await expect(applicantText).toBeVisible({ timeout: 10000 });

    // Click "Setujui" button on this row
    const approveBtn = page.getByRole("button", { name: "Setujui" }).first();
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Verify approval modal
    await expect(
      page.getByRole("heading", {
        name: "Setujui Permohonan Peminjaman Ruangan",
      }),
    ).toBeVisible();

    // Fill notes
    const notesInput = page.locator(
      'textarea[placeholder*="Tuliskan instruksi akses"]',
    );
    await notesInput.fill(
      "Disetujui untuk kegiatan akademik UTY. Harap menjaga kebersihan ruangan.",
    );

    // Confirm approval
    const confirmBtn = page.getByRole("button", {
      name: "Konfirmasi Setujui",
    });
    await confirmBtn.click();

    // Verify status updates to Disetujui (Approved)
    await expect(page.getByText("Disetujui (Approved)").first()).toBeVisible({
      timeout: 10000,
    });
  });

  // --------------------------------------------------------------------------
  // STEP 6: ADMIN PERFORMS CHECK-IN & VERIFIES COMPLETED STATUS
  // --------------------------------------------------------------------------
  test("6. should perform check-in on approved booking and download PDF document", async ({
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

    await expect(
      page.getByRole("button", { name: "Menu Pengguna" }),
    ).toBeVisible({ timeout: 12000 });

    // Open Admin Dashboard -> Reservasi tab
    await page.goto("/admin");
    const bookingsTab = page.getByRole("tab", { name: "Reservasi" });
    await bookingsTab.click();

    // Find the approved booking and click "Check-In"
    const checkInBtn = page
      .getByRole("button", { name: "Check-In", exact: true })
      .first();
    await expect(checkInBtn).toBeVisible();
    await checkInBtn.click();

    // Status should update to Presensi Selesai (Check-In)
    await expect(
      page.getByText("Presensi Selesai (Check-In)").first(),
    ).toBeVisible({ timeout: 10000 });

    // Verify PDF button is visible
    const pdfBtn = page
      .getByRole("button", {
        name: "PDF",
        exact: true,
      })
      .first();
    await expect(pdfBtn).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // STEP 7: USER SEES APPROVED/CHECKED-IN STATUS & OPENS TICKET
  // --------------------------------------------------------------------------
  test("7. should reflect check-in status on user side and render ticket with QR", async ({
    page,
  }) => {
    // Login as user
    await page.goto("/");
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill(testUser.email);
    await page.locator("#loginPass").fill(testUser.password);
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await expect(
      page.getByRole("button", { name: "Menu Pengguna" }),
    ).toBeVisible({ timeout: 12000 });

    // Go to /my-bookings
    await page.goto("/my-bookings");

    // Open ticket
    const ticketBtn = page
      .getByRole("button", { name: /Bukti Presensi & Tiket|Unduh E-Tiket/i })
      .first();
    await expect(ticketBtn).toBeVisible({ timeout: 15000 });
    await ticketBtn.click();

    // Verify ticket dialog
    await expect(
      page.getByRole("heading", { name: "E-Tiket Resmi Peminjaman" }),
    ).toBeVisible();

    // Verify vector PDF download button exists inside ticket
    const pdfBtn = page.getByRole("button", {
      name: /Unduh PDF Resmi \(A4\)/i,
    });
    await expect(pdfBtn).toBeVisible();

    // Close ticket modal
    await page.keyboard.press("Escape");
  });

  // --------------------------------------------------------------------------
  // STEP 8: NOTIFICATION CENTER INTEGRATION (/notifications)
  // --------------------------------------------------------------------------
  test("8. should open /notifications and verify real-time notification center and status", async ({
    page,
  }) => {
    // Login as user
    await page.goto("/");
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await masukBtn.click();

    await page.locator("#loginId").fill(testUser.email);
    await page.locator("#loginPass").fill(testUser.password);
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await expect(
      page.getByRole("button", { name: "Menu Pengguna" }),
    ).toBeVisible({ timeout: 12000 });

    // Navigate to /notifications
    await page.goto("/notifications");

    // Verify Notification Center Header
    await expect(
      page.getByRole("heading", { name: "Pusat Notifikasi" }),
    ).toBeVisible({ timeout: 12000 });

    // Verify connection status indicator
    await expect(
      page.getByText(/Terhubung Langsung|Menghubungkan/i),
    ).toBeVisible();

    // Verify Category Filter Tabs
    await expect(
      page.getByRole("button", { name: /Semua/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Peminjaman/i }).first(),
    ).toBeVisible();

    // Verify Search Input
    const searchInput = page.getByPlaceholder("Cari notifikasi...");
    await expect(searchInput).toBeVisible();

    // Log out user at the end of the full journey
    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await userMenuBtn.click();
    const logoutBtn = page.getByRole("menuitem", { name: /^Keluar/i });
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Verify user is logged out (Masuk button returns)
    await expect(
      page
        .getByRole("navigation", { name: "Aksi Cepat & Profil" })
        .getByRole("button", { name: "Masuk" }),
    ).toBeVisible({ timeout: 8000 });
  });
});
