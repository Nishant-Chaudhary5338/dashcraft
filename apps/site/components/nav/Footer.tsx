"use client";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid" style={{ display: "grid", gap: "40px", marginBottom: "40px" }}>
          <div>
            <div style={{ marginBottom: "12px" }}>
              <Logo size={24} />
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
              Screenshot in. Shippable dashboard out. Headless, drag-and-drop,
              and yours to keep.
            </p>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
              Product
            </p>
            {[
              ["Docs", "/docs"],
              ["Installation", "/docs/installation"],
              ["API Reference", "/docs/api"],
              ["Playground", "/playground"],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none", padding: "4px 0", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
              Open Source
            </p>
            {[
              ["GitHub", "https://github.com/Nishant-Chaudhary5338/dashcraft"],
              ["npm", "https://npmjs.com/package/dashcraft-core"],
              ["Report a Bug", "https://github.com/Nishant-Chaudhary5338/dashcraft/issues"],
              ["Contributing", "https://github.com/Nishant-Chaudhary5338/dashcraft/blob/main/CONTRIBUTING.md"],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none", padding: "4px 0", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {label} ↗
              </a>
            ))}
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
              AI Tools
            </p>
            {[
              ["MCP Codegen Server", "https://npmjs.com/package/dashcraft-mcp-codegen"],
              ["llms.txt", "https://dashcraft.digitribe.world/llms.txt"],
              ["AGENTS.md", "https://github.com/Nishant-Chaudhary5338/dashcraft/blob/main/AGENTS.md"],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none", padding: "4px 0", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
            MIT License · Made with care by{" "}
            <a href="https://digitribe.world" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Nishant Chaudhary
            </a>
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", margin: 0 }}>
            dashcraft-core v0.1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
