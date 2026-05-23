import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dashcraft — Headless React Dashboard Library",
  description:
    "Drag-and-drop grids, resizable widgets, KPI cards, and chart support in one MIT React library. Boolean API. Bring your own styles. AI-native with llms.txt and MCP server.",
  keywords: [
    "react dashboard library",
    "headless dashboard react",
    "react drag and drop dashboard",
    "react resizable widgets",
    "dashboard mcp",
    "mcp react dashboard",
    "react KPI card component",
    "react grid layout library",
    "react internal tools library",
    "open source react dashboard",
  ],
  authors: [{ name: "Nishant Chaudhary" }],
  openGraph: {
    title: "dashcraft — Build React Dashboards with One Prop",
    description:
      "The headless React dashboard library with drag-and-drop, resizable widgets, recharts + nivo charts, and persistent layouts. Free and open source.",
    url: "https://dashcraft.digitribe.world",
    siteName: "dashcraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dashcraft — Headless React Dashboard Library",
    description:
      "Boolean API. Headless. Chart-agnostic. AI-native. Build React dashboards without the plumbing.",
  },
  metadataBase: new URL("https://dashcraft.digitribe.world"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
