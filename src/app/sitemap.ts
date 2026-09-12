import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/programs", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/booking", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/booking/new", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/articles", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/events", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/fastlab", priority: 0.8, changeFrequency: "monthly" as const },
    {
      path: "/notifications",
      priority: 0.7,
      changeFrequency: "daily" as const,
    },
    { path: "/account", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/my-bookings", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/settings", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
