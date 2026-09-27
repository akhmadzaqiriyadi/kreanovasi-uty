import { expect, test } from "@playwright/test";

test.describe("Authentication & Account E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage & sessionStorage before each test so each test starts with clean state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
  });

  // 1. MODAL NAVIGATION & TAB SWITCHING
  test("should open auth modal and switch between Masuk and Daftar tabs", async ({
    page,
  }) => {
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await expect(masukBtn).toBeVisible();
    await masukBtn.click();

    const modalTitle = page.getByRole("heading", {
      name: "Masuk ke Akun Anda",
    });
    await expect(modalTitle).toBeVisible();

    const daftarTabBtn = page.getByRole("button", { name: "Daftar Akun" });
    await daftarTabBtn.click();

    await expect(
      page.getByRole("heading", { name: "Pendaftaran Akun Baru" }),
    ).toBeVisible();

    await expect(page.locator("#regName")).toBeVisible();
    await expect(page.locator("#regEmail")).toBeVisible();
    await expect(page.locator("#regId")).toBeVisible();
    await expect(page.locator("#regAffiliation")).toBeVisible();
    await expect(page.locator("#regPassword")).toBeVisible();

    const masukTabBtn = page.getByRole("button", {
      name: "Masuk",
      exact: true,
    });
    await masukTabBtn.click();
    await expect(
      page.getByRole("heading", { name: "Masuk ke Akun Anda" }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(modalTitle).not.toBeVisible();
  });

  // 2. INVALID LOGIN CASE
  test("should show error toast when login fails with invalid credentials", async ({
    page,
  }) => {
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" })
      .click();

    await page.locator("#loginId").fill("nonexistent.user@uty.ac.id");
    await page.locator("#loginPass").fill("WrongPassword999!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const errorToast = page.locator("[data-sonner-toast]").first();
    await expect(errorToast).toBeVisible({ timeout: 10000 });
  });

  // 3. INVALID REGISTER CASES (Duplicate Email & Short Password)
  test("should reject registration with duplicate email", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Daftar" })
      .click();

    await page.getByRole("button", { name: "Mahasiswa" }).click();
    await page.locator("#regName").fill("Duplikat User");
    await page.locator("#regEmail").fill("zaqi@students.uty.ac.id"); // existing email
    await page.locator("#regId").fill("5210411234");
    await page.locator("#regAffiliation").click();
    await page.getByRole("option", { name: "Informatika" }).click();
    await page.locator("#regPassword").fill("Password123!");

    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible({ timeout: 10000 });
  });

  test("should show validation error for password shorter than 6 characters", async ({
    page,
  }) => {
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Daftar" })
      .click();

    await page.locator("#regName").fill("Short Pass User");
    await page.locator("#regEmail").fill("short.pass@students.uty.ac.id");
    await page.locator("#regPassword").fill("12345"); // 5 chars

    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    // HTML5 client-side minlength validation check
    const isInvalid = await page
      .locator("#regPassword")
      .evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  // 4. ALL ROLES LOGIN
  test("should login as Mahasiswa role (zaqi@students.uty.ac.id) and verify details", async ({
    page,
  }) => {
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" })
      .click();

    await page.locator("#loginId").fill("zaqi@students.uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    await userMenuBtn.click();
    await expect(page.getByText("Akhmad Zaqi Riyadi")).toBeVisible();
    await expect(page.getByText("zaqi@students.uty.ac.id")).toBeVisible();
    await expect(
      page.getByRole("menu").getByText("mahasiswa", { exact: true }),
    ).toBeVisible();
  });

  test("should login as Dosen role (bambang@uty.ac.id) and verify details", async ({
    page,
  }) => {
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" })
      .click();

    await page.locator("#loginId").fill("bambang@uty.ac.id");
    await page.locator("#loginPass").fill("Password123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    await userMenuBtn.click();
    await expect(page.getByText("Dr. Bambang Sutrisno, M.Kom.")).toBeVisible();
    await expect(page.getByText("bambang@uty.ac.id")).toBeVisible();
    await expect(
      page.getByRole("menu").getByText("dosen", { exact: true }),
    ).toBeVisible();
  });

  test("should login as Admin role (admin@gozaq.com)", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" })
      .click();

    await page.locator("#loginId").fill("admin@gozaq.com");
    await page.locator("#loginPass").fill("Admin123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    await userMenuBtn.click();
    await expect(page.getByText("System Administrator")).toBeVisible();
    await expect(
      page.getByRole("menu").getByText("Administrator", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("menu").getByText("Super Admin")).toBeVisible();

    // Verify /account page for Admin role
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "System Administrator" })).toBeVisible();
    await expect(page.getByText("Pengelola UTY Creative Hub").first()).toBeVisible();
    await expect(page.getByText("ID Akses Administrator")).toBeVisible();
    await expect(page.getByText("Hak Akses & Otoritas")).toBeVisible();
    await expect(page.getByText("Mahasiswa Aktif UTY")).not.toBeVisible();
    await expect(page.getByText("NPM 5210411234")).not.toBeVisible();
  });

  test("should register a Non-Civitas (Umum) user with NIK and company", async ({
    page,
  }) => {
    const ts = Date.now();
    const umumUser = {
      name: `Mitra Tech ${ts}`,
      email: `mitra.${ts}@company.id`,
      password: "Password123!",
      nik: "3404123456789012",
      company: "PT Digital Kreasi",
    };

    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Daftar" })
      .click();

    await page.getByRole("button", { name: "Non-Civitas" }).click();
    await page.locator("#regName").fill(umumUser.name);
    await page.locator("#regEmail").fill(umumUser.email);
    await page.locator("#regId").fill(umumUser.nik);
    await page.locator("#regAffiliation").fill(umumUser.company);
    await page.locator("#regPassword").fill(umumUser.password);

    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    await userMenuBtn.click();
    await expect(page.getByText(umumUser.name)).toBeVisible();
    await expect(page.getByText("Non-Civitas")).toBeVisible();
  });

  // 5. EDIT PROFILE & CHANGE PASSWORD ON /account
  test("should edit profile and change password on /account page", async ({
    page,
  }) => {
    const ts = Date.now();
    const dynamicUser = {
      name: `User Edit ${ts}`,
      email: `user.edit.${ts}@students.uty.ac.id`,
      oldPassword: "Password123!",
      newPassword: "NewPassword456!",
      npm: "5210411555",
      prodi: "Informatika",
    };

    // 1. Register new user
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Daftar" })
      .click();

    await page.locator("#regName").fill(dynamicUser.name);
    await page.locator("#regEmail").fill(dynamicUser.email);
    await page.locator("#regId").fill(dynamicUser.npm);
    await page.locator("#regAffiliation").click();
    await page.getByRole("option", { name: "Informatika" }).click();
    await page.locator("#regPassword").fill(dynamicUser.oldPassword);
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });

    // 2. Navigate to /account page
    await page.goto("/account");
    await expect(page.locator("#name")).toBeVisible();

    // 3. Edit profile name
    const updatedName = `${dynamicUser.name} Updated`;
    await page.locator("#name").fill(updatedName);
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();

    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible({ timeout: 10000 });

    // 4. Switch to Keamanan & Sandi tab
    await page.getByRole("button", { name: "Keamanan & Sandi" }).click();
    await expect(page.locator("#oldPassword")).toBeVisible();

    // Try wrong old password first
    await page.locator("#oldPassword").fill("WrongOldPass123!");
    await page.locator("#newPassword").fill(dynamicUser.newPassword);
    await page.locator("#confirmPassword").fill(dynamicUser.newPassword);
    await page.getByRole("button", { name: "Perbarui Kata Sandi" }).click();

    // Expect error toast
    await expect(page.locator("[data-sonner-toast]").first()).toBeVisible({
      timeout: 10000,
    });

    // Now enter correct old password
    await page.locator("#oldPassword").fill(dynamicUser.oldPassword);
    await page.getByRole("button", { name: "Perbarui Kata Sandi" }).click();

    // Expect success toast
    await expect(page.locator("[data-sonner-toast]").first()).toBeVisible({
      timeout: 10000,
    });

    // 5. Logout and login with NEW password
    await userMenuBtn.click();
    await page.getByRole("menuitem", { name: "Keluar" }).click();
    await expect(userMenuBtn).not.toBeVisible();

    // Login with new password
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" })
      .click();

    await page.locator("#loginId").fill(dynamicUser.email);
    await page.locator("#loginPass").fill(dynamicUser.newPassword);
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    // Verify session restored
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });
  });

  // 6. TOKEN EXPIRATION & INVALID TOKEN IN AUTHMIDDLEWARE / CONTEXT
  test("should handle invalid/expired token gracefully and clear session", async ({
    page,
  }) => {
    // Inject invalid / expired token into localStorage
    await page.evaluate(() => {
      localStorage.setItem("uch_access_token", "invalid.jwt.token.here");
      localStorage.setItem(
        "uch_user_profile",
        JSON.stringify({
          name: "Phantom User",
          email: "phantom@students.uty.ac.id",
          role: "mahasiswa",
        }),
      );
    });

    // Reload page
    await page.reload();

    // Since token is invalid, backend 401 triggers clean logout in AuthContext
    // Wait for Masuk button to be visible (not logged in)
    const masukBtn = page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" });
    await expect(masukBtn).toBeVisible({ timeout: 10000 });

    // Verify localStorage tokens are cleaned up
    const token = await page.evaluate(() =>
      localStorage.getItem("uch_access_token"),
    );
    expect(token).toBeNull();
  });

  // 7. ROUTE AUTH GUARD
  test("should show Access Restricted guard on /account when user is not logged in", async ({
    page,
  }) => {
    await page.goto("/account");

    // Must show Akses Akun Terbatas card
    await expect(page.getByText("Akses Akun Terbatas")).toBeVisible();
    const masukSekarangBtn = page.getByRole("button", {
      name: "Masuk Sekarang",
    });
    await expect(masukSekarangBtn).toBeVisible();

    // Clicking Masuk Sekarang opens the login modal
    await masukSekarangBtn.click();
    await expect(
      page.getByRole("heading", { name: "Masuk ke Akun Anda" }),
    ).toBeVisible();
  });

  // 8. PASSWORD VISIBILITY TOGGLES
  test("should toggle password visibility on login, register, and account security fields", async ({
    page,
  }) => {
    // 8.1 Login password toggle
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" })
      .click();

    const loginPass = page.locator("#loginPass");
    await expect(loginPass).toHaveAttribute("type", "password");

    // Click toggle button next to loginPass
    const loginToggleBtn = loginPass.locator("..").getByRole("button");
    await loginToggleBtn.click();
    await expect(loginPass).toHaveAttribute("type", "text");
    await loginToggleBtn.click();
    await expect(loginPass).toHaveAttribute("type", "password");

    // 8.2 Register password toggle
    await page.getByRole("button", { name: "Daftar Akun" }).click();
    const regPass = page.locator("#regPassword");
    await expect(regPass).toHaveAttribute("type", "password");

    const regToggleBtn = regPass.locator("..").getByRole("button");
    await regToggleBtn.click();
    await expect(regPass).toHaveAttribute("type", "text");
    await regToggleBtn.click();
    await expect(regPass).toHaveAttribute("type", "password");

    // Close modal
    await page.keyboard.press("Escape");

    // 8.3 Account page password toggles (login first)
    await page
      .getByRole("navigation", { name: "Aksi Cepat & Profil" })
      .getByRole("button", { name: "Masuk" })
      .click();
    await page.locator("#loginId").fill("admin@gozaq.com");
    await page.locator("#loginPass").fill("Admin123!");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    const userMenuBtn = page.getByRole("button", { name: "Menu Pengguna" });
    await expect(userMenuBtn).toBeVisible({ timeout: 12000 });
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "System Administrator" })).toBeVisible();

    // Go to Keamanan tab
    await page.getByRole("button", { name: "Keamanan" }).click();

    // Verify oldPassword, newPassword, confirmPassword toggles
    for (const id of ["#oldPassword", "#newPassword", "#confirmPassword"]) {
      const input = page.locator(id);
      await expect(input).toHaveAttribute("type", "password");
      const toggleBtn = input.locator("..").getByRole("button");
      await toggleBtn.click();
      await expect(input).toHaveAttribute("type", "text");
      await toggleBtn.click();
      await expect(input).toHaveAttribute("type", "password");
    }
  });
});
