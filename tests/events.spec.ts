import { expect, test } from "@playwright/test";

test.describe("Events & Agenda Pages E2E Tests", () => {
  test("should load /events without 404 and display catalog with event items", async ({
    page,
  }) => {
    await page.goto("/events");

    // Check main heading in hero
    await expect(
      page.getByRole("heading", {
        name: "Agenda & Program Kolaboratif UTY Creative Hub",
      }),
    ).toBeVisible();

    // Check search input exists
    await expect(page.locator("#search-events")).toBeVisible();

    // Check presence of key curated event cards
    await expect(
      page.getByText("UCH Demo Day & Startup Pitch Fest 2026"),
    ).toBeVisible();
    await expect(
      page.getByText("Workshop FastLab: Prototyping Smart IoT & AI"),
    ).toBeVisible();
    await expect(
      page.getByText("Klinik Proposal PKM: Bedah Ide Menuju PIMNAS"),
    ).toBeVisible();
  });

  test("should filter events when searching keyword", async ({ page }) => {
    await page.goto("/events");

    const searchInput = page.locator("#search-events");
    await searchInput.fill("FastLab");

    // FastLab event should still be visible
    await expect(
      page.getByText("Workshop FastLab: Prototyping Smart IoT & AI"),
    ).toBeVisible();

    // Non-matching events should be hidden
    await expect(
      page.getByText("Klinik Proposal PKM: Bedah Ide Menuju PIMNAS"),
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
    await expect(page.getByText("Tentang Agenda Ini")).toBeVisible();
    await expect(page.getByText("Susunan Acara (Rundown)")).toBeVisible();
    await expect(page.getByText("Narasumber & Mentor")).toBeVisible();
    await expect(
      page.getByText("Laboratorium FastLab UCH").first(),
    ).toBeVisible();
  });

  test("should allow user to open registration modal and complete registration", async ({
    page,
  }) => {
    await page.goto(
      "/events/workshop-fastlab-prototyping-iot-dan-ai-dengan-esp32",
    );

    // Click Daftar Sekarang button
    const registerBtn = page.getByRole("button", { name: "Daftar Sekarang" });
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    // Dialog should be open
    await expect(page.getByText("Formulir Pendaftaran Agenda")).toBeVisible();

    // Fill form
    await page.locator("#fullName").fill("Ahmad Fauzi");
    await page.locator("#identityNumber").fill("5210411122");
    await page.locator("#institution").fill("Informatika UTY");
    await page.locator("#email").fill("fauzi@students.uty.ac.id");
    await page.locator("#phone").fill("081234567890");

    // Submit form
    await page.getByRole("button", { name: "Konfirmasi Pendaftaran" }).click();

    // Expect success message and confirmation code
    await expect(page.getByText("Pendaftaran Berhasil Diterima")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Kode Registrasi Peserta")).toBeVisible();
  });

  test("should return 404 for invalid event slug", async ({ page }) => {
    await page.goto("/events/slug-agenda-yang-tidak-ada-sama-sekali");
    await expect(page.locator("text=Halaman Tidak Ditemukan")).toBeVisible();
  });
});
