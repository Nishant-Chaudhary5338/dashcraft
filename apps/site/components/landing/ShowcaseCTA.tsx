import Link from "next/link";

/**
 * ShowcaseCTA — landing page teaser for the interactive showcase page.
 *
 * Placed between CodeShowcase and PlaygroundCTA.
 * Shows a static preview grid and links to /showcase.
 */
export function ShowcaseCTA() {
  const tiles = [
    { label: "Analytics", color: "#6366f1", w: "2", icon: "📈" },
    { label: "E-commerce", color: "#06b6d4", w: "1", icon: "🛒" },
    { label: "SaaS Metrics", color: "#22c55e", w: "1", icon: "📊" },
  ];

  return (
    <section className="section" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="eyebrow">Interactive Demo</div>
          <h2 className="section-title">
            Try before you install.
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 540, margin: "16px auto 0", lineHeight: 1.7 }}>
            Three production-grade dashboards built entirely with{" "}
            <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "0.9em" }}>@dashcraft/core</code>.
            Drag, resize, delete widgets — then download the code.
          </p>
        </div>

        {/* Preview tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 16,
            marginBottom: 40,
            maxWidth: 840,
            margin: "0 auto 40px",
          }}
        >
          {tiles.map((t) => (
            <Link
              key={t.label}
              href="/showcase"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "28px 24px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                textDecoration: "none",
                transition: "all 0.18s",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "1.6rem" }}>{t.icon}</div>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>{t.label}</div>
              <div
                style={{
                  height: 4, borderRadius: 2,
                  background: `linear-gradient(90deg, ${t.color} 0%, transparent 100%)`,
                }}
              />
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["drag", "resize", "delete"].map((p) => (
                  <span key={p} style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.65rem",
                    background: "var(--bg-surface)", border: "1px solid var(--border)",
                    color: t.color, padding: "2px 7px", borderRadius: 4,
                  }}>{p}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/showcase" className="btn-primary" style={{ display: "inline-block" }}>
            Open Showcase →
          </Link>
          <p style={{ marginTop: 14, fontSize: "0.8rem", color: "var(--text-muted)" }}>
            No install needed · Runs live in your browser · Download full project
          </p>
        </div>
      </div>
    </section>
  );
}
