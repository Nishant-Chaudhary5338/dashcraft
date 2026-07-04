import type { Metadata } from "next";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { Grain } from "@/components/ui/Grain";
import { Hero } from "@/components/landing/Hero";
import { MarqueeBand } from "@/components/landing/MarqueeBand";
import { Wedge } from "@/components/landing/Wedge";
import { ScreenshotToCode } from "@/components/landing/ScreenshotToCode";
import { HeadlessProof } from "@/components/landing/HeadlessProof";
import { SocialProof } from "@/components/landing/SocialProof";
import { BookendCTA } from "@/components/landing/BookendCTA";

export const metadata: Metadata = {
  title: {
    absolute: "dashcraft — Turn a Screenshot into a React Dashboard",
  },
  description:
    "Drop a screenshot or describe a layout and get production-ready React dashboard code you own. dashcraft is a headless, MIT-licensed library (dashcraft-core) with a built-in MCP server — drag-and-drop, resizable widgets, KPI cards, recharts charts. Ship the dashboard, not the prototype.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "dashcraft — Turn a Screenshot into a React Dashboard",
    description:
      "Headless, MIT React dashboard library with screenshot-to-code via MCP. Own your repo, style it yourself, ship faster. dashcraft-core.",
    url: "https://dashcraft.digitribe.world",
  },
};

export default function HomePage() {
  return (
    <>
      <Grain />
      <Navbar />
      <main>
        <Hero />
        <MarqueeBand />
        <Wedge />
        <ScreenshotToCode />
        <HeadlessProof />
        <SocialProof />
        <BookendCTA />
      </main>
      <Footer />
    </>
  );
}
