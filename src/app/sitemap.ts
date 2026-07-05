import type { MetadataRoute } from "next";

const BASE = "https://gaita-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/partnerships", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.5,
  }));
}
