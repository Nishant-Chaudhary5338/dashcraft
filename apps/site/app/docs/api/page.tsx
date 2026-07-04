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

      <h3 className="docs-h3">1. Dashboard — the canvas</h3>
      <p className="docs-p">
        <code>Dashboard</code> is a free-form pixel canvas and context provider. Give it an optional{" "}
        <code>persistenceKey</code> to auto-save layouts. Widgets are positioned by pixel coordinates
        and can be dragged anywhere — there is no fixed column grid.
      </p>
      <Code code={`<Dashboard persistenceKey="sales-v1" autoSave>
  {/* cards go here */}
</Dashboard>`} />

      <h3 className="docs-h3">2. DashboardCard — the wrapper</h3>
      <p className="docs-p">
        Every widget lives inside a <code>DashboardCard</code>. The card handles all interactive
        behaviour. Place it with <code>defaultPosition</code> and size it with <code>defaultSize</code>:
      </p>
      <Code code={`<DashboardCard
  id="revenue-card"
  defaultPosition={{ x: 0, y: 0 }}
  defaultSize={{ width: 280, height: 180 }}
>
  {/* widget */}
</DashboardCard>`} />
      <div className="docs-callout">
        <strong>The boolean API:</strong> <code>drag</code>, <code>resize</code>, <code>delete</code>,
        and <code>settings</code> are single boolean props — and each defaults to <code>true</code>.
        A bare card is fully interactive; pass <code>false</code> to opt out.
      </div>

      <h3 className="docs-h3">3. Widgets — KPI, charts</h3>
      <p className="docs-p">
        Three built-in widget types. Each renders its own card, so you give them an <code>id</code>
        and placement props directly:
      </p>
      <Code code={`// Metric card
<KPIWidget id="rev" label="Revenue" value={124500} format="currency" previousValue={98000} />

// recharts (bar, line, area, pie, scatter, radar, radialBar)
<RechartsWidget id="chart" chartType="bar" data={data} series={[...]} xAxisKey="month" />

// Hierarchy charts (recharts-backed treemap & sunburst, built-in heatmap)
<HierarchyWidget id="heat" chartType="heatmap" data={data} colors={['#6366f1', '#8b5cf6']} />`} />

      <h3 className="docs-h3">4. Positioning</h3>
      <p className="docs-p">
        Position and size are pixel values on the <code>defaultPosition</code> and{" "}
        <code>defaultSize</code> props. Users can then drag and resize freely in edit mode, and the
        new coordinates persist.
      </p>
      <Code code={`// Top-left, 280×180
defaultPosition={{ x: 0, y: 0 }}
defaultSize={{ width: 280, height: 180 }}

// Right of it, wider
defaultPosition={{ x: 300, y: 0 }}
defaultSize={{ width: 640, height: 320 }}`} />

      <h3 className="docs-h3">5. Edit mode</h3>
      <p className="docs-p">
        Drag-and-drop and resize are active only in edit mode. Start in edit mode with{" "}
        <code>defaultEditMode</code>, and toggle it at runtime with the <code>useDashboard</code> hook
        (inside the Dashboard) or <code>useDashboardStore</code> (anywhere).
      </p>
      <Code code={`import { useDashboard } from '@dashcraft/core'

function EditButton() {
  const { isEditMode, toggleEditMode } = useDashboard()
  return (
    <button onClick={toggleEditMode}>
      {isEditMode ? 'Done' : 'Edit layout'}
    </button>
  )
}

// Render <EditButton /> inside <Dashboard>`} />

      <h2 className="docs-h2" id="full-example">Full example</h2>
      <Code code={`import { Dashboard, DashboardCard, KPIWidget, RechartsWidget, useDashboard } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

const monthlyData = [
  { month: 'Jan', revenue: 12400, expenses: 8200 },
  { month: 'Feb', revenue: 15600, expenses: 9100 },
  { month: 'Mar', revenue: 18200, expenses: 11400 },
  { month: 'Apr', revenue: 21000, expenses: 13200 },
]

function EditToggle() {
  const { isEditMode, toggleEditMode } = useDashboard()
  return (
    <button onClick={toggleEditMode}>
      {isEditMode ? 'Done editing' : 'Edit layout'}
    </button>
  )
}

export function SalesDashboard() {
  return (
    <Dashboard persistenceKey="sales-v1" autoSave>
      <EditToggle />

      <KPIWidget
        id="total-revenue"
        label="Total Revenue"
        value={67200}
        format="currency"
        previousValue={52000}
        defaultPosition={{ x: 0, y: 40 }}
        defaultSize={{ width: 280, height: 180 }}
      />

      <KPIWidget
        id="total-expenses"
        label="Total Expenses"
        value={41900}
        format="currency"
        previousValue={38600}
        defaultPosition={{ x: 300, y: 40 }}
        defaultSize={{ width: 280, height: 180 }}
      />

      <RechartsWidget
        id="monthly-chart"
        title="Revenue vs Expenses"
        chartType="bar"
        data={monthlyData}
        series={[
          { dataKey: 'revenue', name: 'Revenue', color: '#6366f1' },
          { dataKey: 'expenses', name: 'Expenses', color: '#f43f5e' },
        ]}
        xAxisKey="month"
        defaultPosition={{ x: 0, y: 240 }}
        defaultSize={{ width: 600, height: 320 }}
      />
    </Dashboard>
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
