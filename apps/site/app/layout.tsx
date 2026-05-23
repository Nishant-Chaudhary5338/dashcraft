import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "dashcraft — Headless React Dashboard Library",
  description:
    "Build React dashboards via MCP, drag-and-drop, resizable widgets, KPI cards, and chart support in one MIT library. Boolean API. Bring your own styles. AI-native.",
  keywords: [
    "react dashboard library",
    "headless dashboard react",
    "build dashboard via mcp",
    "mcp react dashboard codegen",
    "react drag and drop dashboard",
    "react resizable widgets",
    "dashboard mcp server",
    "mcp codegen dashboard",
    "react KPI card component",
    "react grid layout library",
    "react internal tools library",
    "open source react dashboard",
    "ai-native dashboard library",
  ],
  authors: [{ name: "Nishant Chaudhary" }],
  openGraph: {
    title: "dashcraft — Build React Dashboards with One Prop (or via MCP)",
    description:
      "The headless React dashboard library with drag-and-drop, resizable widgets, recharts + nivo charts, persistent layouts, and a built-in MCP codegen server. Free and open source.",
    url: "https://dashcraft.digitribe.world",
    siteName: "dashcraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dashcraft — Headless React Dashboard Library",
    description:
      "Boolean API. Headless. Chart-agnostic. AI-native with MCP codegen. Build React dashboards without the plumbing.",
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
        {/* Apply stored theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dc-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
