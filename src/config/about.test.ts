import { describe, expect, it } from "bun:test";
import { aboutConfig } from "./about";

describe("aboutConfig", () => {
  it("has valid header configuration", () => {
    expect(aboutConfig.header.title).toBe("About Us");
    expect(aboutConfig.header.subtitle).toContain(
      "Universitas Teknologi Yogyakarta",
    );
  });

  it("contains official narrative matching requirements", () => {
    expect(aboutConfig.narrative.welcome).toContain(
      "Selamat datang di UTY Creative Hub",
    );
    expect(aboutConfig.narrative.description).toContain(
      "Dengan fasilitas modern dan program-program yang inspiratif",
    );
  });

  it("contains valid action buttons", () => {
    expect(aboutConfig.actions.length).toBeGreaterThanOrEqual(2);
    expect(aboutConfig.actions[0].href).toBe("/programs");
    expect(aboutConfig.actions[1].href).toBe("/booking");
  });

  it("contains 3 focus areas and 3 pillars", () => {
    expect(aboutConfig.focusAreas.length).toBe(3);
    expect(aboutConfig.pillarsSection.pillars.length).toBe(3);
  });

  it("configures video correctly with 20% initial volume level", () => {
    expect(aboutConfig.video.src).toBe("/videos/uch-profile.mp4");
    expect(aboutConfig.video.defaultVolume).toBe(0.2);
    expect(aboutConfig.video.driveUrl).toContain("drive.google.com");
  });
});
