import { CopyButton } from "@/components/ui/CopyButton";

export const metadata = { title: "Installation" };

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div className="docs-step">
    <div className="docs-step-num">{n}</div>
    <div className="docs-step-body">
      <div className="docs-step-title">{title}</div>
      {children}
    </div>
  </div>
);

const Code = ({ code, lang = "bash" }: { code: string; lang?: string }) => (
  <div className="docs-code" style={{ position: "relative" }}>
    <CopyButton text={code} style={{ position: "absolute", top: 12, right: 12 }} />
    <pre style={{ margin: 0, overflowX: "auto" }}>
      <code>{code}</code>
    </pre>
  </div>
);

export default function InstallationPage() {
  return (
    <div className="docs-page">
      <div className="docs-eyebrow">Getting Started</div>
      <h1 className="docs-h1">Installation</h1>
      <p className="docs-lead">
        Get <code>@dashcraft/core</code> running in under 5 minutes.
      </p>

      <Step n={1} title="Install the package">
        <p className="docs-p">Install the core library:</p>
        <Code code="npm install @dashcraft/core" />
        <p className="docs-p" style={{ marginTop: "-8px", fontSize: "0.875rem" }}>
          Or with pnpm: <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>pnpm add @dashcraft/core</code>
        </p>
      </Step>

      <Step n={2} title="Install chart peer dependencies (optional)">
        <p className="docs-p">
          dashcraft is chart-agnostic. Install only the chart libraries you need:
        </p>
        <Code code={`# For recharts (bar, line, area, pie, scatter, radar, treemap, sunburst)
npm install recharts`} />
        <div className="docs-callout">
          <strong>Note:</strong> recharts is the only optional chart peer dep — it powers RechartsWidget
          plus the HierarchyWidget treemap &amp; sunburst. KPIWidget and the HierarchyWidget heatmap are
          built in and have no chart dependency.
        </div>
      </Step>

      <Step n={3} title="Import the stylesheet">
        <p className="docs-p">Import the base styles in your app entry point:</p>
        <Code code={`// In your main.tsx or App.tsx
import '@dashcraft/core/styles.css'`} lang="tsx" />
        <p className="docs-p" style={{ fontSize: "0.875rem" }}>
          The stylesheet is minimal — it only provides layout primitives and drag handles.
          All visual styling is left to you.
        </p>
      </Step>

      <Step n={4} title="Build your first dashboard">
        <Code code={`import { Dashboard, KPIWidget, RechartsWidget } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

const salesData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 18200 },
]

export function MyDashboard() {
  return (
    <Dashboard persistenceKey="my-dashboard-v1" autoSave>
      <KPIWidget
        id="revenue"
        label="Total Revenue"
        value={46200}
        format="currency"
        previousValue={38000}
        defaultPosition={{ x: 0, y: 0 }}
        defaultSize={{ width: 280, height: 180 }}
      />

      <RechartsWidget
        id="sales-chart"
        title="Monthly Revenue"
        chartType="bar"
        data={salesData}
        series={[{ dataKey: 'revenue', name: 'Revenue', color: '#6366f1' }]}
        xAxisKey="month"
        defaultPosition={{ x: 300, y: 0 }}
        defaultSize={{ width: 640, height: 320 }}
      />
    </Dashboard>
  )
}`} lang="tsx" />
      </Step>

      <h2 className="docs-h2">Next steps</h2>
      <ul style={{ color: "var(--text-secondary)", lineHeight: 2, paddingLeft: "20px" }}>
        <li><a href="/docs/api" style={{ color: "var(--accent)" }}>Quick Start</a> — understand the core concepts</li>
        <li><a href="/docs/components" style={{ color: "var(--accent)" }}>Component Reference</a> — full prop tables</li>
        <li><a href="/playground" style={{ color: "var(--accent)" }}>Playground</a> — build visually, export code</li>
      </ul>
    </div>
  );
}
