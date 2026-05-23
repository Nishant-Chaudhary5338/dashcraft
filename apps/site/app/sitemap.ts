import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dashcraft.digitribe.world";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/playground`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/installation`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/api`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/components`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/hooks`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs/guides/persistence`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs/guides/edit-mode`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs/guides/mcp`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
