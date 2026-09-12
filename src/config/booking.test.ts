import { describe, expect, test } from "bun:test";
import { bookingFormSchema } from "@/lib/validations/booking";
import { bookingConfig } from "./booking";

describe("bookingConfig", () => {
  test("contains valid header configuration", () => {
    expect(bookingConfig.header.title).toBeDefined();
    expect(bookingConfig.header.highlight).toBe("UTY Creative Hub");
    expect(bookingConfig.header.description).toBeDefined();
  });

  test("contains valid operational hours", () => {
    expect(bookingConfig.operationalHours.length).toBeGreaterThanOrEqual(3);
    const weekday = bookingConfig.operationalHours.find((h) =>
      h.day.includes("Senin"),
    );
    expect(weekday?.isOpen).toBe(true);
    const holiday = bookingConfig.operationalHours.find((h) =>
      h.day.includes("Minggu"),
    );
    expect(holiday?.isOpen).toBe(false);
  });

  test("contains booking procedures and rules", () => {
    expect(bookingConfig.procedures.length).toBe(4);
    expect(bookingConfig.rules.length).toBeGreaterThanOrEqual(4);
    expect(bookingConfig.timeSlots.length).toBeGreaterThanOrEqual(6);
  });

  test("re-uses rooms from roomsConfig adhering to DRY principles", () => {
    expect(bookingConfig.rooms.length).toBeGreaterThanOrEqual(3);
    for (const room of bookingConfig.rooms) {
      expect(room.id).toBeDefined();
      expect(room.name).toBeDefined();
      expect(room.capacity).toBeDefined();
      expect(room.facilities.length).toBeGreaterThan(0);
    }
  });
});

describe("bookingFormSchema", () => {
  test("validates valid booking payload", () => {
    const validData = {
      role: "mahasiswa" as const,
      room: "think-tank",
      name: "Akhmad Zaqi",
      npm: "5210411234",
      prodi: "Informatika",
      purpose: "Rapat koordinasi tim riset proposal PKM AI dan robotika.",
      audience: 6,
      date: "2026-09-15",
      startTime: "09:00",
      endTime: "11:00",
    };

    const result = bookingFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("rejects invalid payload when endTime is before startTime", () => {
    const invalidData = {
      role: "mahasiswa" as const,
      room: "think-tank",
      name: "Akhmad Zaqi",
      npm: "5210411234",
      prodi: "Informatika",
      purpose: "Rapat koordinasi tim riset proposal PKM.",
      audience: 6,
      date: "2026-09-15",
      startTime: "14:00",
      endTime: "10:00",
    };

    const result = bookingFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.includes("endTime")),
      ).toBe(true);
    }
  });

  test("rejects NPM containing non-numeric characters", () => {
    const invalidData = {
      room: "think-tank",
      name: "Akhmad Zaqi",
      npm: "52104ABCD",
      prodi: "Informatika",
      purpose: "Rapat koordinasi tim riset proposal PKM.",
      audience: 6,
      date: "2026-09-15",
      startTime: "09:00",
      endTime: "11:00",
    };

    const result = bookingFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test("validates valid dosen booking payload with NIDN and role", () => {
    const validDosenData = {
      role: "dosen",
      room: "maker-space",
      name: "Dr. Bambang Sutrisno, M.Kom.",
      npm: "0514088201",
      prodi: "Informatika",
      purpose: "Workshop riset kolaborasi kecerdasan buatan mahasiswa & dosen.",
      audience: 20,
      date: "2026-09-18",
      startTime: "13:00",
      endTime: "16:00",
    };

    const result = bookingFormSchema.safeParse(validDosenData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("dosen");
      expect(result.data.npm).toBe("0514088201");
    }
  });
});
