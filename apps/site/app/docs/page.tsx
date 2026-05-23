"use client";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      links: [
        { href: "/docs/installation", label: "Installation", desc: "Install @dashcraft/core and peer deps" },
        { href: "/docs/api", label: "Quick Start", desc: "Your first dashboard in 5 minutes" },
      ],
    },
    {
      title: "Components",
      links: [
        { href: "/docs/components#dashboard", label: "Dashboard", desc: "Root layout container" },
        { href: "/docs/components#dashboardcard", label: "DashboardCard", desc: "Widget wrapper with boolean behaviour props" },
        { href: "/docs/components#kpiwidget", label: "KPIWidget", desc: "Metric cards with trend indicators" },
        { href: "/docs/components#rechartswidget", label: "RechartsWidget", desc: "recharts integration" },
        { href: "/docs/components#nivowidget", label: "NivoWidget", desc: "@nivo integration" },
      ],
    },
    {
      title: "Hooks",
      links: [
        { href: "/docs/hooks#useDashboard", label: "useDashboard", desc: "Access dashboard state and edit mode" },
        { href: "/docs/hooks#useWidgetData", label: "useWidgetData", desc: "Subscribe to widget data" },
        { href: "/docs/hooks#usePersistence", label: "usePersistence", desc: "Manual layout persistence" },
      ],
    },
    {
      title: "Guides",
      links: [
        { href: "/docs/guides/persistence", label: "Persistence", desc: "Saving and restoring layouts" },
        { href: "/docs/guides/edit-mode", label: "Edit Mode", desc: "Toggle drag-drop and resize at runtime" },
        { href: "/docs/guides/mcp", label: "MCP Integration", desc: "AI-powered dashboard generation" },
      ],
    },
  ];

  return (
    <div className="docs-page">
      <div className="docs-eyebrow">Documentation</div>
      <h1 className="docs-h1">dashcraft docs</h1>
      <p className="docs-lead">
        Everything you need to build production-grade React dashboards with{" "}
        <code>@dashcraft/core</code>.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginTop: "40px" }}>
        {sections.map((section) => (
          <div key={section.title} style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
          }}>
            <h2 style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
            }}>
              {section.title}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    display: "block",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    <div style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9rem" }}>{link.label}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>{link.desc}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
