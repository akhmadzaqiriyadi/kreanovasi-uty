import { describe, expect, it } from "bun:test";
import { roomsConfig } from "./rooms";

describe("roomsConfig", () => {
  it("has valid header configuration", () => {
    expect(roomsConfig.header.title).toBe("Status Ruangan & Fasilitas");
    expect(roomsConfig.header.subtitle).toContain("co-working space");
  });

  it("contains exactly 3 curated rooms for landing page", () => {
    expect(roomsConfig.rooms.length).toBe(3);
  });

  it("ensures each room has complete data, facilities, and valid status", () => {
    for (const room of roomsConfig.rooms) {
      expect(room.id).toBeDefined();
      expect(room.slug).toBeDefined();
      expect(room.name.length).toBeGreaterThan(10);
      expect(room.type).toBeDefined();
      expect(room.description.length).toBeGreaterThan(20);
      expect(room.capacity).toBeDefined();
      expect(room.location).toBeDefined();
      expect(room.coverImage).toBeDefined();
      expect(room.facilities.length).toBeGreaterThanOrEqual(3);
      expect(room.status.state).toMatch(/^(available|in-use|reserved-soon)$/);
      expect(room.status.label).toBeDefined();
      expect(room.status.timeSlotInfo).toBeDefined();
    }
  });

  it("has valid CTA link to booking page", () => {
    expect(roomsConfig.cta.href).toBe("/booking");
    expect(roomsConfig.cta.label).toBeDefined();
  });
});
