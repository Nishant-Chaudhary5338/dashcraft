import { CopyButton } from "@/components/ui/CopyButton";

export const metadata = { title: "Components" };

const Code = ({ code }: { code: string }) => (
  <div className="docs-code" style={{ position: "relative" }}>
    <CopyButton text={code} style={{ position: "absolute", top: 12, right: 12 }} />
    <pre style={{ margin: 0, overflowX: "auto" }}><code>{code}</code></pre>
  </div>
);

const PropTable = ({ rows }: {
  rows: { prop: string; type: string; default?: string; desc: string }[];
}) => (
  <table className="docs-table">
    <thead>
      <tr>
        <th>Prop</th><th>Type</th><th>Default</th><th>Description</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((r) => (
        <tr key={r.prop}>
          <td>{r.prop}</td>
          <td>{r.type}</td>
          <td style={{ color: "var(--text-muted)" }}>{r.default ?? "—"}</td>
          <td>{r.desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function ComponentsPage() {
  return (
    <div className="docs-page">
      <div className="docs-eyebrow">API Reference</div>
      <h1 className="docs-h1">Components</h1>
      <p className="docs-lead">Full prop reference for all @dashcraft/core components.</p>

      {/* Dashboard */}
      <h2 className="docs-h2" id="dashboard">Dashboard</h2>
      <p className="docs-p">Root layout container. Manages the CSS grid, edit mode state, and persistence.</p>
      <Code code={`import { Dashboard } from '@dashcraft/core'

<Dashboard id="main" persist="main-v1" columns={12}>
  {/* DashboardCard children */}
</Dashboard>`} />
      <PropTable rows={[
        { prop: "id", type: "string", desc: "Unique dashboard identifier. Used as the key for the Zustand store." },
        { prop: "persist", type: "string", desc: "localStorage key. When set, layout changes are saved and restored automatically." },
        { prop: "columns", type: "number", default: "12", desc: "Number of grid columns." },
        { prop: "rowHeight", type: "number", default: "60", desc: "Height of each grid row in pixels." },
        { prop: "editMode", type: "boolean", default: "false", desc: "When true, drag-and-drop and resize are active across all cards." },
        { prop: "onLayoutChange", type: "(layout: Layout) => void", desc: "Called whenever a card is moved or resized." },
        { prop: "className", type: "string", desc: "Class applied to the grid container element." },
        { prop: "style", type: "CSSProperties", desc: "Inline styles for the grid container." },
        { prop: "gap", type: "number", default: "16", desc: "Gap between cards in pixels." },
      ]} />

      {/* DashboardCard */}
      <h2 className="docs-h2" id="dashboardcard">DashboardCard</h2>
      <p className="docs-p">
        Widget wrapper. Accepts boolean props for every interactive behaviour — no config objects,
        no verbose names.
      </p>
      <Code code={`<DashboardCard
  id="revenue"
  drag
  resize
  settings
  delete
  style={{ gridColumn: '1 / span 4', gridRow: '1 / span 2' }}
>
  <KPIWidget title="Revenue" value={124500} format="currency" />
</DashboardCard>`} />
      <PropTable rows={[
        { prop: "id", type: "string", desc: "Unique identifier within the Dashboard." },
        { prop: "drag", type: "boolean", default: "false", desc: "Enables drag-and-drop repositioning via @dnd-kit." },
        { prop: "resize", type: "boolean", default: "false", desc: "Shows resize handles to change colSpan / rowSpan." },
        { prop: "settings", type: "boolean", default: "false", desc: "Shows a settings gear icon. Connect to your own settings panel." },
        { prop: "delete", type: "boolean", default: "false", desc: "Shows a delete button to remove the card from the dashboard." },
        { prop: "responsive", type: "boolean", default: "false", desc: "Enables responsive breakpoint behaviour." },
        { prop: "style", type: "CSSProperties", desc: "Use gridColumn and gridRow to position within the grid." },
        { prop: "className", type: "string", desc: "Custom class for the card wrapper." },
        { prop: "onSettings", type: "() => void", desc: "Called when the settings button is clicked." },
        { prop: "onDelete", type: "(id: string) => void", desc: "Called when the delete button is clicked." },
      ]} />

      {/* KPIWidget */}
      <h2 className="docs-h2" id="kpiwidget">KPIWidget</h2>
      <p className="docs-p">Metric display card with optional trend indicator and delta calculation.</p>
      <Code code={`<KPIWidget
  title="Monthly Revenue"
  value={124500}
  format="currency"
  previousValue={98000}
/>`} />
      <PropTable rows={[
        { prop: "title", type: "string", desc: "Card title displayed above the value." },
        { prop: "value", type: "number", desc: "Current metric value." },
        { prop: "format", type: '"currency" | "percent" | "number"', default: '"number"', desc: "Value formatting. currency → $, percent → %." },
        { prop: "previousValue", type: "number", desc: "Previous period value. Enables trend arrow and delta display." },
        { prop: "prefix", type: "string", desc: "String prepended to the formatted value." },
        { prop: "suffix", type: "string", desc: "String appended to the formatted value." },
        { prop: "description", type: "string", desc: "Secondary text below the value." },
        { prop: "loading", type: "boolean", default: "false", desc: "Shows skeleton loading state." },
        { prop: "className", type: "string", desc: "Custom class for the widget root." },
      ]} />

      {/* RechartsWidget */}
      <h2 className="docs-h2" id="rechartswidget">RechartsWidget</h2>
      <p className="docs-p">
        recharts integration supporting bar, line, area, pie, scatter, and radar chart types.
        Requires <code>recharts</code> to be installed.
      </p>
      <Code code={`<RechartsWidget
  title="Monthly Sales"
  chartType="bar"
  data={salesData}
  series={[
    { key: 'revenue', name: 'Revenue', color: '#6366f1' },
    { key: 'expenses', name: 'Expenses', color: '#f43f5e' },
  ]}
  xAxisKey="month"
/>`} />
      <PropTable rows={[
        { prop: "chartType", type: '"bar" | "line" | "area" | "pie" | "scatter" | "radar"', desc: "Recharts chart variant to render." },
        { prop: "data", type: "object[]", desc: "Array of data objects. Keys must match series[].key values." },
        { prop: "series", type: "SeriesConfig[]", desc: "Array of { key, name, color } objects defining each data series." },
        { prop: "xAxisKey", type: "string", desc: "Object key to use for X-axis labels." },
        { prop: "title", type: "string", desc: "Chart title displayed above." },
        { prop: "height", type: "number", default: "240", desc: "Chart height in pixels." },
        { prop: "showGrid", type: "boolean", default: "true", desc: "Show/hide CartesianGrid." },
        { prop: "showLegend", type: "boolean", default: "true", desc: "Show/hide the recharts Legend." },
        { prop: "showTooltip", type: "boolean", default: "true", desc: "Show/hide the recharts Tooltip." },
        { prop: "className", type: "string", desc: "Custom class for the widget root." },
      ]} />

      {/* NivoWidget */}
      <h2 className="docs-h2" id="nivowidget">NivoWidget</h2>
      <p className="docs-p">
        @nivo integration for heatmap, treemap, and sunburst charts.
        Requires the relevant <code>@nivo/*</code> packages to be installed.
      </p>
      <Code code={`<NivoWidget
  title="Activity Heatmap"
  chartType="heatmap"
  data={heatmapData}
  colorScheme="blues"
/>`} />
      <PropTable rows={[
        { prop: "chartType", type: '"heatmap" | "treemap" | "sunburst"', desc: "Nivo chart type to render." },
        { prop: "data", type: "object[]", desc: "Nivo-compatible data format for the selected chart type." },
        { prop: "title", type: "string", desc: "Chart title displayed above." },
        { prop: "colorScheme", type: "string", default: '"nivo"', desc: "Nivo color scheme name." },
        { prop: "height", type: "number", default: "300", desc: "Chart height in pixels." },
        { prop: "className", type: "string", desc: "Custom class for the widget root." },
      ]} />
    </div>
  );
}
