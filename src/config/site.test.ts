import { describe, expect, it } from "bun:test";
import { navItems, programItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";

describe("siteConfig", () => {
  it("has valid base properties", () => {
    expect(siteConfig.name).toBe("UTY Creative Hub");
    expect(siteConfig.shortName).toBe("UCH");
    expect(siteConfig.url).toBeDefined();
    expect(siteConfig.organization.name).toContain(
      "Universitas Teknologi Yogyakarta",
    );
  });

  it("contains all required social links", () => {
    expect(siteConfig.socials.instagram).toContain("instagram.com");
    expect(siteConfig.socials.facebook).toContain("facebook.com");
    expect(siteConfig.socials.twitter).toContain("twitter.com");
    expect(siteConfig.socials.youtube).toContain("youtube.com");
  });
});

describe("navigationConfig", () => {
  it("contains primary navigation items", () => {
    expect(navItems.length).toBeGreaterThan(0);
    const homeItem = navItems.find((item) => item.href === "/");
    expect(homeItem).toBeDefined();
  });

  it("contains program navigation items", () => {
    expect(programItems.length).toBeGreaterThan(0);
  });
});
