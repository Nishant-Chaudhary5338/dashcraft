import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "dashcraft — Headless React Dashboard Library",
  description:
    "Build React dashboards via MCP — describe a dashboard or drop a screenshot and get production-ready code. Drag-and-drop, resizable widgets, KPI cards, recharts support. Boolean API. Headless. MIT.",
  keywords: [
    "react dashboard library",
    "headless dashboard react",
    "build dashboard via mcp",
    "mcp react dashboard codegen",
    "mcp dashboard generator",
    "image to dashboard mcp",
    "ai dashboard builder mcp",
    "mcp server react dashboard",
    "screenshot to dashboard",
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
      "Headless React dashboard library with a built-in MCP server: describe a dashboard or drop a screenshot, get production-ready @dashcraft/core code. Drag-and-drop, resizable widgets, recharts charts. Free, open source, MIT.",
    url: "https://dashcraft.digitribe.world",
    siteName: "dashcraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dashcraft — Headless React Dashboard Library with MCP",
    description:
      "Boolean API. Headless. Chart-agnostic. AI-native: built-in MCP server converts screenshots and descriptions into dashboard code. Build React dashboards without the plumbing.",
  },
  metadataBase: new URL("https://dashcraft.digitribe.world"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
