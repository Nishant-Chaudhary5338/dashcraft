"use client";
import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

const TABS = [
  {
    id: "basic",
    label: "Dashboard",
    code: `<Dashboard id="analytics" persist="analytics-v1">
  <DashboardCard id="revenue" drag resize>
    <KPIWidget
      title="Revenue"
      value={124500}
      format="currency"
      previousValue={98000}
    />
  </DashboardCard>

  <DashboardCard id="users" drag resize>
    <KPIWidget
      title="Active Users"
      value={12847}
      format="number"
      previousValue={11200}
    />
  </DashboardCard>

  <DashboardCard id="chart" drag resize settings>
    <RechartsWidget
      chartType="bar"
      title="Monthly Revenue"
      data={monthlyData}
      series={[{ key: 'revenue', name: 'Revenue', color: '#6366f1' }]}
      xAxisKey="month"
    />
  </DashboardCard>
</Dashboard>`,
    vizTitle: "Live Dashboard",
    vizDesc: "Three widgets: two KPIs + a bar chart. All draggable and resizable.",
  },
  {
    id: "edit",
    label: "Edit Mode",
    code: `import { useDashboard } from '@dashcraft/core'

function EditToggle() {
  const { isEditMode, toggleEditMode } = useDashboard()

  return (
    <button
      onClick={toggleEditMode}
      style={{
        background: isEditMode ? '#22c55e' : 'transparent',
        border: '1px solid var(--border)',
        padding: '8px 16px',
        borderRadius: 8,
      }}
    >
      {isEditMode ? '✓ Done Editing' : '✎ Edit Dashboard'}
    </button>
  )
}

// In edit mode: widgets show drag handles,
// resize corners, delete buttons, and
// settings gear icons. In view mode:
// everything is hidden and locked.`,
    vizTitle: "Edit / View Toggle",
    vizDesc: "One hook. isEditMode controls all widget chrome simultaneously.",
  },
  {
    id: "http",
    label: "Live Data",
    code: `import { useWidgetData } from '@dashcraft/core'

function LiveRevenueCard() {
  const { data, loading, error, refetch } = useWidgetData({
    endpoint: '/api/revenue',
    polling: 30000,        // refetch every 30s
    cache: true,
    cacheDuration: 5000,
  })

  if (loading) return <Spinner />
  if (error)   return <ErrorCard message={error.message} />

  return (
    <KPIWidget
      title="Live Revenue"
      value={data?.total ?? 0}
      format="currency"
      previousValue={data?.previousTotal}
    />
  )
}`,
    vizTitle: "Live Data",
    vizDesc: "Built-in polling, caching, and error handling. No extra wiring.",
  },
];

export function CodeShowcase() {
  const [active, setActive] = useState("basic");
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section className="section" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent-hover)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            API
          </p>
          <h2 className="display-lg">
            The code speaks for itself.
          </h2>
        </div>

        <div className="tab-list">
          {TABS.map((t) => (
            <button key={t.id} className={`tab-btn${active === t.id ? " active" : ""}`} onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Code */}
          <div className="code-window">
            <div className="code-window-bar">
              <div className="code-window-dots">
                <span className="code-dot code-dot-red" />
                <span className="code-dot code-dot-yellow" />
                <span className="code-dot code-dot-green" />
              </div>
              <span className="code-filename">example.tsx</span>
              <CopyButton text={tab.code} />
            </div>
            <div className="code-content" style={{ maxHeight: 380, overflow: "auto" }}>
              <pre style={{ color: "var(--text-secondary)" }}>
                {tab.code.split("\n").map((line, i) => (
                  <span key={i}>
                    {coloriseLine(line)}
                    {"\n"}
                  </span>
                ))}
              </pre>
            </div>
          </div>

          {/* Visual */}
          <div style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: 24, display: "flex", flexDirection: "column",
          }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", marginBottom: 8, color: "var(--text-primary)" }}>
              {tab.vizTitle}
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 20 }}>
              {tab.vizDesc}
            </p>
            <DashboardViz tabId={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

function coloriseLine(line: string): React.ReactNode {
  if (line.trim().startsWith("//")) {
    return <span className="tok-comment">{line}</span>;
  }
  const parts: React.ReactNode[] = [];
  const keywords = ["import", "from", "export", "function", "return", "const", "if"];
  let remaining = line;
  let key = 0;

  const push = (text: string, cls?: string) => {
    if (!text) return;
    parts.push(cls ? <span key={key++} className={cls}>{text}</span> : <span key={key++}>{text}</span>);
  };

  keywords.forEach((kw) => {
    remaining = remaining.replace(new RegExp(`\\b(${kw})\\b`, "g"), `\x00${kw}\x00`);
  });

  const segments = remaining.split("\x00");
  segments.forEach((seg) => {
    if (keywords.includes(seg)) push(seg, "tok-keyword");
    else push(seg);
  });

  return parts;
}

function DashboardViz({ tabId }: { tabId: string }) {
  const widgets = {
    basic: [
      { label: "Revenue", value: "$124.5k", color: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", span: 1 },
      { label: "Active Users", value: "12,847", color: "rgba(34,211,238,0.07)", border: "rgba(34,211,238,0.18)", span: 1 },
      { label: "Monthly Revenue", value: "Bar Chart", color: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", span: 2 },
    ],
    edit: [
      { label: "Revenue ✎⋮", value: "$124.5k", color: "rgba(99,102,241,0.12)", border: "var(--accent)", span: 1 },
      { label: "Users ✎⋮", value: "12,847", color: "rgba(34,211,238,0.07)", border: "rgba(34,211,238,0.25)", span: 1 },
    ],
    http: [
      { label: "Live Revenue ⟳", value: "$124.5k", color: "rgba(34,197,94,0.07)", border: "rgba(34,197,94,0.2)", span: 2 },
    ],
  };
  const items = widgets[tabId as keyof typeof widgets] ?? widgets.basic;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
      {items.map((w, i) => (
        <div key={i} style={{
          background: w.color, border: `1px solid ${w.border}`,
          borderRadius: "var(--radius-md)", padding: "14px",
          gridColumn: w.span === 2 ? "span 2" : undefined,
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", margin: "0 0 6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>{w.label}</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", margin: 0, letterSpacing: "-0.02em" }}>{w.value}</p>
        </div>
      ))}
    </div>
  );
}
