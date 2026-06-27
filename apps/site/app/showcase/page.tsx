import type { Metadata } from "next";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { ShowcaseLazy } from "@/components/showcase/ShowcaseLazy";

export const metadata: Metadata = {
  title: "Showcase — dashcraft",
  description:
    "Three production-ready dashboard layouts built entirely with @dashcraft/core. Drag, resize, delete, and download the code.",
};

export default function ShowcasePage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 60 }}>
        {/* Tight page header — product speaks for itself below */}
        <div
          style={{
            padding: "32px 32px 24px",
            textAlign: "center",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-surface)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "3px 12px",
              borderRadius: 999,
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Live Demo · @dashcraft/core
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Real dashboards. Real code.
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              margin: "10px auto 0",
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            Drag, resize, delete widgets — then grab the full Vite project in one click.
          </p>
        </div>

        {/* Interactive showcase */}
        <ShowcaseLazy />
        <div style={{ paddingBottom: 48 }} />
      </div>
      <Footer />
    </>
  );
}
