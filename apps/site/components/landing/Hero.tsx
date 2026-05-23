"use client";
import Link from "next/link";
import { CopyButton } from "@/components/ui/CopyButton";

function MiniDashboard() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gridTemplateRows: "auto auto",
      gap: 10,
      padding: 20,
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
    }}>
      {/* KPI 1 */}
      <div className="float-in-1" style={{
        background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "var(--radius-md)", padding: "16px",
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", margin: "0 0 6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Revenue</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.03em" }}>$124.5k</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--success)", margin: 0 }}>↑ 27.1%</p>
      </div>

      {/* KPI 2 — spans 2 cols */}
      <div className="float-in-2" style={{
        gridColumn: "span 2",
        background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)",
        borderRadius: "var(--radius-md)", padding: "16px", display: "flex", flexDirection: "column", gap: 8,
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>Monthly Sales</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 52, flex: 1 }}>
          {[38, 62, 45, 80, 55, 72, 90, 66, 85, 100, 78, 95].map((h, i) => (
            <div key={i} style={{
              flex: 1, background: `rgba(99,102,241,${0.3 + (h / 100) * 0.5})`,
              borderRadius: "2px 2px 0 0", height: `${h}%`,
              transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
              animationDelay: `${0.3 + i * 0.04}s`,
            }} />
          ))}
        </div>
      </div>

      {/* KPI 3 */}
      <div className="float-in-3" style={{
        background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.18)",
        borderRadius: "var(--radius-md)", padding: "16px",
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", margin: "0 0 6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Users</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.03em" }}>12,847</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--success)", margin: 0 }}>↑ 8.3%</p>
      </div>

      {/* Chart — spans 2 cols */}
      <div className="float-in-4" style={{
        gridColumn: "span 2",
        background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)",
        borderRadius: "var(--radius-md)", padding: "16px",
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", margin: "0 0 8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Active Sessions</p>
        <svg viewBox="0 0 200 50" style={{ width: "100%", height: 50 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 40 C20 35,30 20,50 22 C70 24,80 15,100 18 C120 21,130 10,150 8 C170 6,180 12,200 5 L200 50 L0 50 Z"
            fill="url(#areaGrad)" />
          <path d="M0 40 C20 35,30 20,50 22 C70 24,80 15,100 18 C120 21,130 10,150 8 C170 6,180 12,200 5"
            fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section style={{ paddingTop: 160, paddingBottom: 100 }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

        {/* Left column */}
        <div>
          <div className="fade-up fade-up-1">
            <span className="badge badge-accent" style={{ marginBottom: 28 }}>
              <span className="badge-dot" />
              Open Source · Headless · MIT
            </span>
          </div>

          <h1 className="display-xl fade-up fade-up-2" style={{ marginBottom: 24 }}>
            Build React<br />
            <span style={{ color: "var(--accent-hover)" }}>Dashboards</span><br />
            with One Prop.
          </h1>

          <p className="fade-up fade-up-3" style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
            Stop wiring react-grid-layout from scratch. dashcraft gives you draggable, resizable, chart-ready dashboard widgets with a boolean API that reads like plain English — and zero opinions about your styles.
          </p>

          <div className="fade-up fade-up-4" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            <Link href="/docs/installation" className="btn btn-primary btn-lg">
              Get Started Free →
            </Link>
            <Link href="/playground" className="btn btn-ghost btn-lg">
              Try Playground
            </Link>
          </div>

          <div className="fade-up fade-up-5">
            <div className="install-snippet">
              <span className="prompt">$</span>
              <span className="pkg">npm install @dashcraft/core</span>
              <CopyButton text="npm install @dashcraft/core" />
            </div>
          </div>
        </div>

        {/* Right column — code + mini dashboard */}
        <div className="fade-up fade-up-3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Code window */}
          <div className="code-window">
            <div className="code-window-bar">
              <div className="code-window-dots">
                <span className="code-dot code-dot-red" />
                <span className="code-dot code-dot-yellow" />
                <span className="code-dot code-dot-green" />
              </div>
              <span className="code-filename">Dashboard.tsx</span>
              <CopyButton text={`<Dashboard id="sales" persist="sales-v1">
  <DashboardCard id="revenue" drag resize>
    <KPIWidget title="Revenue" value={124500} format="currency" />
  </DashboardCard>
  <DashboardCard id="chart" drag resize settings>
    <RechartsWidget chartType="bar" data={salesData} series={series} />
  </DashboardCard>
</Dashboard>`} />
            </div>
            <div className="code-content">
              <pre>
                <span className="tok-keyword">import</span>
                {" { "}
                <span className="tok-component">Dashboard</span>
                {", "}
                <span className="tok-component">DashboardCard</span>
                {" } "}
                <span className="tok-keyword">from</span>
                {" '"}
                <span className="tok-string">@dashcraft/core</span>
                {"'\n"}
                <span className="tok-keyword">import</span>
                {" { "}
                <span className="tok-component">KPIWidget</span>
                {", "}
                <span className="tok-component">RechartsWidget</span>
                {" } "}
                <span className="tok-keyword">from</span>
                {" '"}
                <span className="tok-string">@dashcraft/core</span>
                {"'\n\n"}
                <span className="tok-keyword">export function</span>
                {" "}
                <span className="tok-component">SalesDashboard</span>
                {"() {\n"}
                {"  "}
                <span className="tok-keyword">return</span>
                {" (\n    "}
                <span className="tok-punct">&lt;</span>
                <span className="tok-component">Dashboard</span>
                {" "}
                <span className="tok-prop">id</span>
                <span className="tok-punct">=</span>
                <span className="tok-string">"sales"</span>
                {" "}
                <span className="tok-prop">persist</span>
                <span className="tok-punct">=</span>
                <span className="tok-string">"sales-v1"</span>
                <span className="tok-punct">&gt;</span>
                {"\n      "}
                <span className="tok-punct">&lt;</span>
                <span className="tok-component">DashboardCard</span>
                {" "}
                <span className="tok-prop">id</span>
                <span className="tok-punct">=</span>
                <span className="tok-string">"revenue"</span>
                {" "}
                <span className="tok-attr">drag</span>
                {" "}
                <span className="tok-attr">resize</span>
                <span className="tok-punct">&gt;</span>
                {"\n        "}
                <span className="tok-punct">&lt;</span>
                <span className="tok-component">KPIWidget</span>
                {"\n          "}
                <span className="tok-prop">title</span>
                <span className="tok-punct">=</span>
                <span className="tok-string">"Revenue"</span>
                {" "}
                <span className="tok-prop">value</span>
                <span className="tok-punct">={"{"}{"{"}</span>
                <span className="tok-number">124500</span>
                <span className="tok-punct">{"}"}{"}"}{"}"}</span>
                {"\n          "}
                <span className="tok-prop">format</span>
                <span className="tok-punct">=</span>
                <span className="tok-string">"currency"</span>
                {" "}
                <span className="tok-prop">previousValue</span>
                <span className="tok-punct">={"{"}{"{"}</span>
                <span className="tok-number">98000</span>
                <span className="tok-punct">{"}"}{"}"}{"}"}</span>
                {"\n        "}
                <span className="tok-punct">/&gt;</span>
                {"\n      "}
                <span className="tok-punct">&lt;/</span>
                <span className="tok-component">DashboardCard</span>
                <span className="tok-punct">&gt;</span>
                {"\n      "}
                <span className="tok-punct">&lt;</span>
                <span className="tok-component">DashboardCard</span>
                {" "}
                <span className="tok-prop">id</span>
                <span className="tok-punct">=</span>
                <span className="tok-string">"chart"</span>
                {" "}
                <span className="tok-attr">drag</span>
                {" "}
                <span className="tok-attr">resize</span>
                {" "}
                <span className="tok-attr">settings</span>
                <span className="tok-punct">&gt;</span>
                {"\n        "}
                <span className="tok-punct">&lt;</span>
                <span className="tok-component">RechartsWidget</span>
                {" "}
                <span className="tok-prop">chartType</span>
                <span className="tok-punct">=</span>
                <span className="tok-string">"bar"</span>
                {" "}
                <span className="tok-attr">...</span>
                {" "}
                <span className="tok-punct">/&gt;</span>
                {"\n      "}
                <span className="tok-punct">&lt;/</span>
                <span className="tok-component">DashboardCard</span>
                <span className="tok-punct">&gt;</span>
                {"\n    "}
                <span className="tok-punct">&lt;/</span>
                <span className="tok-component">Dashboard</span>
                <span className="tok-punct">&gt;</span>
                {"\n  )\n}"}
              </pre>
            </div>
          </div>

          {/* Live dashboard preview */}
          <MiniDashboard />
        </div>
      </div>
    </section>
  );
}
