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
        {/* Page header */}
        <div
          style={{
            padding: "56px 32px 40px",
            textAlign: "center",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-surface)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: 999,
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Live Demo · Powered by @dashcraft/core
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--text-primary)",
              margin: "0 0 16px",
            }}
          >
            Real dashboards. Real code.
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: 560,
              margin: "0 auto 24px",
              lineHeight: 1.7,
            }}
          >
            Three production-grade dashboard layouts built entirely with{" "}
            <code
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--accent-subtle)",
                color: "var(--accent)",
                padding: "1px 6px",
                borderRadius: 4,
              }}
            >
              @dashcraft/core
            </code>
            . Drag widgets, resize them, delete and restore. Hit Download to get a
            full working Vite project.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            {["drag", "resize", "settings", "delete"].map((prop) => (
              <span
                key={prop}
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  color: "var(--accent)",
                }}
              >
                {prop}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive showcase */}
        <ShowcaseLazy />
        <div style={{ paddingBottom: 48 }} />
      </div>
      <Footer />
    </>
  );
}
