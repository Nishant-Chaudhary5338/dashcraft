import { CopyButton } from "@/components/ui/CopyButton";
import Link from "next/link";

export const metadata = { title: "Quick Start" };

const Code = ({ code }: { code: string }) => (
  <div className="docs-code" style={{ position: "relative" }}>
    <CopyButton text={code} style={{ position: "absolute", top: 12, right: 12 }} />
    <pre style={{ margin: 0, overflowX: "auto" }}><code>{code}</code></pre>
  </div>
);

export default function QuickStartPage() {
  return (
    <div className="docs-page">
      <div className="docs-eyebrow">Getting Started</div>
      <h1 className="docs-h1">Quick Start</h1>
      <p className="docs-lead">
        Five core concepts. Then you can build anything.
      </p>

      <h2 className="docs-h2" id="concepts">Core Concepts</h2>

      <h3 className="docs-h3">1. Dashboard — the grid</h3>
      <p className="docs-p">
        <code>Dashboard</code> is a 12-column CSS grid. Give it an <code>id</code> and
        optionally a <code>persist</code> key to auto-save layouts.
      </p>
      <Code code={`<Dashboard id="sales" persist="sales-v1">
  {/* cards go here */}
</Dashboard>`} />

      <h3 className="docs-h3">2. DashboardCard — the wrapper</h3>
      <p className="docs-p">
        Every widget lives inside a <code>DashboardCard</code>. The card handles all
        interactive behaviour. Position it with CSS grid props:
      </p>
      <Code code={`<DashboardCard
  id="revenue-card"
  drag resize settings delete
  style={{ gridColumn: '1 / span 4', gridRow: '1 / span 2' }}
>
  {/* widget */}
</DashboardCard>`} />
      <div className="docs-callout">
        <strong>The boolean API:</strong> Each behaviour is a single boolean prop.
        No config objects. <code>drag</code> enables drag. <code>resize</code> adds resize handles.
        That&apos;s it.
      </div>

      <h3 className="docs-h3">3. Widgets — KPI, charts</h3>
      <p className="docs-p">Three built-in widget types:</p>
      <Code code={`// Metric card
<KPIWidget title="Revenue" value={124500} format="currency" previousValue={98000} />

// recharts (bar, line, area, pie, scatter, radar)
<RechartsWidget chartType="bar" data={data} series={[...]} xAxisKey="month" />

// Hierarchy charts (recharts-backed treemap & sunburst, built-in heatmap)
<HierarchyWidget chartType="heatmap" data={data} colors={['#6366f1', '#8b5cf6']} />`} />

      <h3 className="docs-h3">4. Positioning</h3>
      <p className="docs-p">
        Use standard CSS grid shorthand on the <code>style</code> prop.
        The grid is 12 columns by default.
      </p>
      <Code code={`// Columns 1–4, rows 1–2
style={{ gridColumn: '1 / span 4', gridRow: '1 / span 2' }}

// Columns 5–12, rows 1–4
style={{ gridColumn: '5 / span 8', gridRow: '1 / span 4' }}`} />

      <h3 className="docs-h3">5. Edit mode</h3>
      <p className="docs-p">
        Drag-and-drop and resize are active only when you pass the respective props
        on <code>DashboardCard</code>. Toggle <code>editMode</code> on <code>Dashboard</code> to
        lock or unlock the entire layout at once.
      </p>
      <Code code={`const [editing, setEditing] = useState(false)

<Dashboard id="main" editMode={editing}>
  ...
</Dashboard>

<button onClick={() => setEditing(v => !v)}>
  {editing ? 'Done' : 'Edit layout'}
</button>`} />

      <h2 className="docs-h2" id="full-example">Full example</h2>
      <Code code={`import { useState } from 'react'
import { Dashboard, DashboardCard, KPIWidget, RechartsWidget } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

const monthlyData = [
  { month: 'Jan', revenue: 12400, expenses: 8200 },
  { month: 'Feb', revenue: 15600, expenses: 9100 },
  { month: 'Mar', revenue: 18200, expenses: 11400 },
  { month: 'Apr', revenue: 21000, expenses: 13200 },
]

export function SalesDashboard() {
  const [editing, setEditing] = useState(false)

  return (
    <div>
      <button onClick={() => setEditing(v => !v)}>
        {editing ? 'Done editing' : 'Edit layout'}
      </button>

      <Dashboard id="sales" persist="sales-v1" editMode={editing}>
        <DashboardCard
          id="total-revenue"
          drag resize settings
          style={{ gridColumn: '1 / span 3', gridRow: '1 / span 2' }}
        >
          <KPIWidget
            title="Total Revenue"
            value={67200}
            format="currency"
            previousValue={52000}
          />
        </DashboardCard>

        <DashboardCard
          id="expenses"
          drag resize settings
          style={{ gridColumn: '4 / span 3', gridRow: '1 / span 2' }}
        >
          <KPIWidget
            title="Total Expenses"
            value={41900}
            format="currency"
            previousValue={38600}
          />
        </DashboardCard>

        <DashboardCard
          id="monthly-chart"
          drag resize settings delete
          style={{ gridColumn: '1 / span 12', gridRow: '3 / span 4' }}
        >
          <RechartsWidget
            title="Revenue vs Expenses"
            chartType="bar"
            data={monthlyData}
            series={[
              { key: 'revenue', name: 'Revenue', color: '#6366f1' },
              { key: 'expenses', name: 'Expenses', color: '#f43f5e' },
            ]}
            xAxisKey="month"
          />
        </DashboardCard>
      </Dashboard>
    </div>
  )
}`} />

      <h2 className="docs-h2">Next steps</h2>
      <ul style={{ color: "var(--text-secondary)", lineHeight: 2.2, paddingLeft: "20px" }}>
        <li><Link href="/docs/components" style={{ color: "var(--accent)" }}>Component Reference</Link> — full prop tables for every component</li>
        <li><Link href="/docs/hooks" style={{ color: "var(--accent)" }}>Hooks</Link> — programmatic control over dashboard state</li>
        <li><Link href="/docs/guides/persistence" style={{ color: "var(--accent)" }}>Persistence guide</Link> — saving layouts to a backend</li>
        <li><Link href="/docs/guides/edit-mode" style={{ color: "var(--accent)" }}>Edit mode guide</Link> — building an edit UI</li>
        <li><Link href="/docs/guides/mcp" style={{ color: "var(--accent)" }}>MCP guide</Link> — AI-generated dashboards</li>
      </ul>
    </div>
  );
}
