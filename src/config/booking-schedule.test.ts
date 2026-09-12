import { describe, expect, it } from "bun:test";
import { generateInitialSchedule } from "./booking-schedule";

describe("bookingScheduleConfig", () => {
  it("generates initial schedule items relative to given date", () => {
    const baseDate = new Date(2026, 8, 14); // Sep 14, 2026 (Monday)
    const schedule = generateInitialSchedule(baseDate);

    expect(schedule.length).toBeGreaterThan(0);

    const firstItem = schedule[0];
    expect(firstItem.id).toBeDefined();
    expect(firstItem.roomId).toBeDefined();
    expect(firstItem.roomName).toBeDefined();
    expect(firstItem.startTime).toBeDefined();
    expect(firstItem.endTime).toBeDefined();
    expect(firstItem.applicant).toBeDefined();
    expect(firstItem.purpose).toBeDefined();
    expect(firstItem.status).toBe("approved");
  });

  it("covers multiple rooms and days of the week", () => {
    const schedule = generateInitialSchedule(new Date());
    const roomIds = new Set(schedule.map((item) => item.roomId));

    expect(roomIds.size).toBeGreaterThanOrEqual(3);
    expect(roomIds.has("think-tank-1")).toBe(true);
    expect(roomIds.has("coworking-space")).toBe(true);
  });
});
