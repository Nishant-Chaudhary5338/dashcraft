import type { MetadataRoute } from "next";

const BASE = "https://dashcraft.digitribe.world";

// AI / answer-engine crawlers explicitly allowed so dashcraft content is
// eligible for citations in ChatGPT, Claude, Perplexity, Google AI Overviews,
// Apple Intelligence, and model training corpora (GEO).
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers: allow everything except server-only API routes.
      { userAgent: "*", allow: "/", disallow: "/api/" },
      // Answer engines: full access to the public content surface.
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
