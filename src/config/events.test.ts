import { describe, expect, it } from "bun:test";
import { eventsConfig } from "./events";

describe("eventsConfig", () => {
  it("has valid header configuration", () => {
    expect(eventsConfig.header.title).toBe("Agenda & Events Mendatang");
    expect(eventsConfig.header.subtitle).toContain("UTY Creative Hub");
  });

  it("contains exactly 3 curated events for landing page", () => {
    expect(eventsConfig.events.length).toBe(3);
  });

  it("ensures each event has complete date, location, category, and cover image", () => {
    for (const event of eventsConfig.events) {
      expect(event.id).toBeDefined();
      expect(event.slug).toBeDefined();
      expect(event.title.length).toBeGreaterThan(10);
      expect(event.description.length).toBeGreaterThan(20);
      expect(event.date.day).toBeDefined();
      expect(event.date.month).toBeDefined();
      expect(event.date.year).toBeDefined();
      expect(event.time).toContain("WIB");
      expect(event.location.name).toBeDefined();
      expect(event.location.type).toMatch(/^(offline|online|hybrid)$/);
      expect(event.category.name).toBeDefined();
      expect(event.category.variant).toMatch(/^(primary|secondary|accent)$/);
      expect(event.coverImage).toBeDefined();
    }
  });

  it("has valid CTA link to events page", () => {
    expect(eventsConfig.cta.href).toBe("/events");
    expect(eventsConfig.cta.label).toBeDefined();
  });
});
