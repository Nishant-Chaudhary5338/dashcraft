import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { JsonLd, type JsonLdSchema } from "@/components/seo/JsonLd";

const SITE_URL = "https://dashcraft.digitribe.world";
const GITHUB_URL = "https://github.com/Nishant-Chaudhary5338/dashcraft";
const NPM_URL = "https://www.npmjs.com/package/dashcraft-core";

// Display (kinetic headlines), body/UI, and mono (data · eyebrows · code).
// Self-hosted via next/font — no render-blocking Google Fonts @import.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "dashcraft — Headless React Dashboard Library",
    template: "%s — dashcraft",
  },
  description:
    "Turn a screenshot into a working React dashboard. dashcraft is a headless, MIT-licensed library (dashcraft-core) with a built-in MCP server — drop an image or describe a layout, get production-ready code you own. Drag-and-drop, resizable widgets, KPI cards, recharts support, boolean API.",
  applicationName: "dashcraft",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
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
  creator: "Nishant Chaudhary",
  publisher: "Digitribe",
  category: "technology",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "dashcraft",
    title: "dashcraft — Build React Dashboards with One Prop (or via MCP)",
    description:
      "Headless React dashboard library with a built-in MCP server: describe a dashboard or drop a screenshot, get production-ready dashcraft-core code you own. Drag-and-drop, resizable widgets, recharts charts. Free, open source, MIT.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "dashcraft — Headless React Dashboard Library with MCP",
    description:
      "Boolean API. Headless. Chart-agnostic. AI-native: built-in MCP server converts screenshots and descriptions into dashboard code you own. Ship the dashboard, not the prototype.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0E0C0A" },
    { media: "(prefers-color-scheme: light)", color: "#FBFAF8" },
  ],
  colorScheme: "dark light",
};

const organization: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Digitribe",
  url: SITE_URL,
  founder: { "@type": "Person", name: "Nishant Chaudhary" },
};

const website: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "dashcraft",
  description:
    "Headless, MIT-licensed React dashboard library with a built-in MCP server that turns screenshots and descriptions into production-ready code.",
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/docs?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareApplication: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "dashcraft",
  alternateName: "dashcraft-core",
  description:
    "Headless React dashboard library with a built-in MCP server. Drop a screenshot or describe a layout and get production-ready dashcraft-core code you own — drag-and-drop, resizable widgets, KPI cards, and recharts-backed charts via a boolean API.",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "React component library",
  operatingSystem: "Web, Node.js, any OS running React 18+ or React 19",
  softwareVersion: "0.1.0",
  license: "https://opensource.org/licenses/MIT",
  url: SITE_URL,
  downloadUrl: NPM_URL,
  codeRepository: GITHUB_URL,
  programmingLanguage: "TypeScript",
  author: { "@type": "Person", name: "Nishant Chaudhary" },
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "Free / open source (MIT)",
  },
};

const faqPage: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What is dashcraft?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "dashcraft is a headless, MIT-licensed React dashboard library published as dashcraft-core. It handles layout, drag-and-drop, resizing, persistence, and widget state so you can build admin panels, analytics dashboards, and internal tools without the plumbing — while bringing your own styles.",
      },
    },
    {
      "@type": "Question",
      name: "Is dashcraft free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. dashcraft is free and open source under the MIT license. There is no paid tier, seat pricing, or usage cap — you install dashcraft-core from npm and use it in commercial or personal projects at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "How does dashcraft turn a screenshot into code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "dashcraft ships an MCP server, dashcraft-mcp-codegen. Its analyze_dashboard tool inspects a screenshot and maps the widgets to dashcraft-core components, generate_code emits the TSX, and generate_project returns a complete runnable Vite project. You can also do this in the browser via the site's screenshot-to-code tool.",
      },
    },
    {
      "@type": "Question",
      name: "Is dashcraft headless?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. dashcraft is headless — it provides behaviour (layout, drag, resize, persistence, widget state) but ships unstyled by default. You control all visuals with your own CSS, design tokens, or component styles, so dashboards match your product instead of looking like a template.",
      },
    },
    {
      "@type": "Question",
      name: "Do I own the generated code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. dashcraft generates plain TSX using dashcraft-core and writes it into your repository. There is no lock-in, no proprietary runtime, and no hosted backend — the code is yours to edit, commit, and deploy however you want.",
      },
    },
    {
      "@type": "Question",
      name: "What is dashcraft-core?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "dashcraft-core is the npm package that is dashcraft's React library. It exports components like Dashboard, DashboardCard, KPIWidget, RechartsWidget, and HierarchyWidget, plus hooks such as useDashboard and usePersistence. Every interactive behaviour is a boolean prop, e.g. <DashboardCard drag resize settings delete>.",
      },
    },
    {
      "@type": "Question",
      name: "How is dashcraft different from Tremor, v0, or Retool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike styled kits such as Tremor, dashcraft is headless, so you own the look. Unlike v0's one-off generation, it pairs an MCP codegen server with a real component library, so output stays consistent and maintainable. Unlike Retool's hosted, proprietary platform, dashcraft is MIT open source that lives in your own repo with no runtime lock-in.",
      },
    },
    {
      "@type": "Question",
      name: "What charts does dashcraft support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "dashcraft is chart-agnostic. Its RechartsWidget renders bar, line, area, pie, scatter, and radar charts via recharts, and HierarchyWidget adds treemap and sunburst plus a dependency-free heatmap. recharts is an optional peer dependency, so you only install it if you use those widgets.",
      },
    },
  ],
};

const siteSchemas: JsonLdSchema[] = [
  organization,
  website,
  softwareApplication,
  faqPage,
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/* Apply stored theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dc-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
        <JsonLd data={siteSchemas} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
