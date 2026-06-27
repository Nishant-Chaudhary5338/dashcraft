"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/nav/Navbar";

const NAV = [
  {
    group: "Getting Started",
    links: [
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/api", label: "Quick Start" },
    ],
  },
  {
    group: "Components",
    links: [
      { href: "/docs/components#dashboard", label: "Dashboard" },
      { href: "/docs/components#dashboardcard", label: "DashboardCard" },
      { href: "/docs/components#kpiwidget", label: "KPIWidget" },
      { href: "/docs/components#rechartswidget", label: "RechartsWidget" },
      { href: "/docs/components#hierarchywidget", label: "HierarchyWidget" },
    ],
  },
  {
    group: "Hooks",
    links: [
      { href: "/docs/hooks#useDashboard", label: "useDashboard" },
      { href: "/docs/hooks#useWidgetData", label: "useWidgetData" },
      { href: "/docs/hooks#useWidgetEvents", label: "useWidgetEvents" },
      { href: "/docs/hooks#usePersistence", label: "usePersistence" },
      { href: "/docs/hooks#useDraggable", label: "useDraggable" },
      { href: "/docs/hooks#useResize", label: "useResize" },
    ],
  },
  {
    group: "Guides",
    links: [
      { href: "/docs/guides/persistence", label: "Persistence" },
      { href: "/docs/guides/edit-mode", label: "Edit Mode" },
      { href: "/docs/guides/mcp", label: "MCP Integration" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <aside className="docs-sidebar">
        {NAV.map((section) => (
          <div key={section.group} style={{ marginBottom: "24px" }}>
            <div style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              padding: "0 12px",
              marginBottom: "8px",
            }}>
              {section.group}
            </div>
            {section.links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href.split("#")[0] + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.875rem",
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    background: isActive ? "var(--accent-subtle)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
    </>
  );
}
