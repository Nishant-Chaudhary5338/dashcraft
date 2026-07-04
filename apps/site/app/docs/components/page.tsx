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
      <p className="docs-p">
        The context provider and free-form canvas that every card lives inside. Widgets are
        positioned absolutely by pixel <code>{`{ x, y }`}</code> coordinates (not a fixed column
        grid) so users can drag them anywhere. Manages edit-mode state and layout persistence.
      </p>
      <Code code={`import { Dashboard } from '@dashcraft/core'

<Dashboard persistenceKey="main-v1" autoSave className="min-h-screen">
  {/* DashboardCard / widget children */}
</Dashboard>`} />
      <PropTable rows={[
        { prop: "persistenceKey", type: "string", desc: "localStorage key. When set, the layout auto-loads on mount and saves when leaving edit mode and on unmount." },
        { prop: "storage", type: '"localStorage" | "sessionStorage"', default: '"localStorage"', desc: "Storage backend used by persistence adapters. Dashboard layout save/load uses localStorage keyed by persistenceKey." },
        { prop: "autoSave", type: "boolean", default: "false", desc: "When true, the layout is saved (debounced) on every change, not only when leaving edit mode." },
        { prop: "autoSaveDelay", type: "number", default: "1000", desc: "Debounce delay in milliseconds for autoSave." },
        { prop: "defaultEditMode", type: "boolean", default: "false", desc: "Initial edit-mode state. Toggle at runtime with useDashboard() or useDashboardStore." },
        { prop: "onLayoutChange", type: "(layout: Record<string, WidgetState>) => void", desc: "Fires whenever any widget is moved, resized, or has its settings changed." },
        { prop: "onEditModeChange", type: "(isEditMode: boolean) => void", desc: "Fires when edit mode is toggled." },
        { prop: "className", type: "string", desc: "Class on the canvas container. Use it for the initial CSS flow (e.g. flex/grid utilities) before cards are dragged." },
        { prop: "style", type: "CSSProperties", desc: "Inline styles for the canvas container." },
      ]} />
      <div className="docs-callout">
        <strong>No <code>columns</code> / <code>gap</code> props.</strong> dashcraft is a pixel canvas,
        not a column grid. Give each card a <code>defaultPosition</code> and <code>defaultSize</code>
        for a deterministic starting layout; the container computes its own min-height to fit all cards.
      </div>

      {/* DashboardCard */}
      <h2 className="docs-h2" id="dashboardcard">DashboardCard</h2>
      <p className="docs-p">
        Widget wrapper. Every interactive behaviour is a single boolean prop — and each defaults
        to <code>true</code>, so a bare card is fully interactive in edit mode. Opt out per card by
        passing <code>false</code>.
      </p>
      <Code code={`<DashboardCard
  id="revenue"
  title="Revenue"
  defaultPosition={{ x: 0, y: 0 }}
  defaultSize={{ width: 280, height: 180 }}
>
  <KPIWidget label="Revenue" value={124500} format="currency" />
</DashboardCard>`} />
      <PropTable rows={[
        { prop: "id", type: "string", desc: "Required. Unique identifier within the Dashboard, and the key its position/size persist under." },
        { prop: "type", type: "string", default: '"custom"', desc: "Semantic widget tag, exposed as data-widget-type." },
        { prop: "title", type: "string", desc: "Optional card title." },
        { prop: "drag", type: "boolean", default: "true", desc: "Drag to reposition in edit mode (via @dnd-kit)." },
        { prop: "resize", type: "boolean", default: "true", desc: "Show corner resize handles in edit mode." },
        { prop: "delete", type: "boolean", default: "true", desc: "Show a delete button in edit mode." },
        { prop: "settings", type: "boolean | ReactNode", default: "true", desc: "Show the settings gear. Pass a ReactNode to supply a custom settings panel." },
        { prop: "settingsVisibility", type: '"edit-mode" | "always"', default: '"edit-mode"', desc: "When the settings gear is visible." },
        { prop: "onSettingsChange", type: "(settings: WidgetSettings) => void", desc: "Fires whenever a built-in setting changes." },
        { prop: "resizeHandles", type: "ResizeHandle[]", default: '["bottomRight", "bottomLeft"]', desc: "Which corner grips to show. Defaults to both bottom corners so an edge-anchored widget always has a reachable grip." },
        { prop: "autoResizeDirections", type: "boolean", default: "false", desc: "Auto-detect resize directions from the widget's position." },
        { prop: "viewBreakpoints", type: "ViewBreakpoints", desc: "Width-keyed map of alternate content shown as the card gets narrower/wider." },
        { prop: "viewCycler", type: "boolean", default: "false", desc: "Show a button that cycles through viewBreakpoints manually." },
        { prop: "viewSizes", type: "Size[]", desc: "Preset sizes the card cycles through on double-click (or the toolbar cycle button), with an animated resize anchored to its home position." },
        { prop: "snapOnDoubleClick", type: "boolean", default: "true", desc: "Enable the double-click-to-cycle gesture when viewSizes is set." },
        { prop: "defaultPosition", type: "Position", desc: "Initial { x, y } pixel position on the canvas." },
        { prop: "defaultSize", type: "Size", desc: "Initial { width, height } pixel size." },
        { prop: "style", type: "CSSProperties", desc: "Inline styles merged onto the card." },
        { prop: "className", type: "string", desc: "Custom class for the card wrapper." },
        { prop: "onDelete", type: "() => void", desc: "Fires after the card is removed via the delete button." },
      ]} />

      {/* KPIWidget */}
      <h2 className="docs-h2" id="kpiwidget">KPIWidget</h2>
      <p className="docs-p">
        Metric display with optional trend indicator and auto-calculated delta. It renders its own
        <code>DashboardCard</code>, so it accepts every <code>DashboardCard</code> prop
        (<code>id</code>, <code>drag</code>, <code>defaultPosition</code>, …) directly — use it as a
        top-level card, not nested inside another <code>DashboardCard</code>.
      </p>
      <Code code={`<KPIWidget
  id="revenue"
  label="Monthly Revenue"
  value={124500}
  format="currency"
  previousValue={98000}
  defaultPosition={{ x: 0, y: 0 }}
  defaultSize={{ width: 280, height: 180 }}
/>`} />
      <PropTable rows={[
        { prop: "value", type: "number | string", desc: "Required. Current metric value. Strings are rendered verbatim." },
        { prop: "label", type: "string", desc: "Required. Label shown beneath the value." },
        { prop: "previousValue", type: "number", desc: "Previous period value. Enables the trend arrow and delta percentage." },
        { prop: "format", type: '"number" | "currency" | "percentage" | "text"', default: '"number"', desc: "Value formatting. currency uses Intl.NumberFormat, percentage appends %." },
        { prop: "currency", type: "string", default: '"USD"', desc: "ISO currency code for the currency format." },
        { prop: "decimals", type: "number", default: "0", desc: "Number of decimal places." },
        { prop: "trend", type: '"up" | "down" | "neutral"', desc: "Override the auto-calculated trend direction." },
        { prop: "trendLabel", type: "string", desc: "Custom delta text (e.g. \"+12% vs last month\"). Overrides the auto delta." },
        { prop: "icon", type: "ReactNode", desc: "Optional icon shown above the value." },
        { prop: "valueColor", type: "string", desc: "Color override for the value text." },
        { prop: "showBackground", type: "boolean", default: "false", desc: "Show a subtle gradient background." },
      ]} />

      {/* RechartsWidget */}
      <h2 className="docs-h2" id="rechartswidget">RechartsWidget</h2>
      <p className="docs-p">
        recharts integration supporting bar, line, area, pie, scatter, radar, and radialBar charts.
        Requires <code>recharts</code> to be installed. Also renders its own card, so it accepts all
        <code>DashboardCard</code> props.
      </p>
      <Code code={`<RechartsWidget
  id="sales"
  title="Monthly Sales"
  chartType="bar"
  data={salesData}
  series={[
    { dataKey: 'revenue', name: 'Revenue', color: '#6366f1' },
    { dataKey: 'expenses', name: 'Expenses', color: '#f43f5e' },
  ]}
  xAxisKey="month"
  defaultPosition={{ x: 0, y: 200 }}
  defaultSize={{ width: 640, height: 320 }}
/>`} />
      <PropTable rows={[
        { prop: "chartType", type: '"bar" | "line" | "area" | "pie" | "scatter" | "radar" | "radialBar"', desc: "Required. Recharts chart variant to render." },
        { prop: "data", type: "DataPoint[]", desc: "Required. Array of data objects. Keys must match each series dataKey." },
        { prop: "series", type: "SeriesConfig[]", desc: "Required. Array of { dataKey, name?, color, stackId? } objects defining each data series." },
        { prop: "xAxisKey", type: "string", desc: "Object key used for X-axis labels." },
        { prop: "showGrid", type: "boolean", default: "true", desc: "Show/hide the CartesianGrid." },
        { prop: "showLegend", type: "boolean", default: "true", desc: "Show/hide the Legend." },
        { prop: "showTooltip", type: "boolean", default: "true", desc: "Show/hide the Tooltip." },
        { prop: "animate", type: "boolean", desc: "Enable recharts entry animation." },
        { prop: "customTooltip", type: "ReactNode", desc: "Custom tooltip content." },
        { prop: "chartHeight", type: "number | string", default: "300", desc: "Height of the chart area." },
      ]} />

      {/* HierarchyWidget */}
      <h2 className="docs-h2" id="hierarchywidget">HierarchyWidget</h2>
      <p className="docs-p">
        recharts-backed treemap &amp; sunburst, plus a built-in dependency-free heatmap.
        Treemap and sunburst require <code>recharts</code>; the heatmap has no extra dependency.
        Renders its own card, so it accepts all <code>DashboardCard</code> props.
      </p>
      <Code code={`<HierarchyWidget
  id="activity"
  title="Activity Heatmap"
  chartType="heatmap"
  data={heatmapData}
  colors={['#6366f1', '#8b5cf6', '#ec4899']}
  defaultSize={{ width: 480, height: 300 }}
/>`} />
      <PropTable rows={[
        { prop: "chartType", type: '"heatmap" | "treemap" | "sunburst"', desc: "Required. Chart type to render." },
        { prop: "data", type: "HeatmapRowData[] | TreemapDataNode[] | SunburstDataNode[]", desc: "Data shaped for the selected chart type." },
        { prop: "colors", type: "string[]", desc: "Color palette for the chart." },
        { prop: "animate", type: "boolean", desc: "Enable entry animation (treemap/sunburst)." },
        { prop: "showLabels", type: "boolean", desc: "Show node labels." },
        { prop: "showTooltip", type: "boolean", desc: "Show tooltips on hover." },
        { prop: "chartHeight", type: "number | string", default: "300", desc: "Height of the chart area." },
        { prop: "margin", type: "{ top?; right?; bottom?; left? }", desc: "Margin configuration around the chart." },
      ]} />
    </div>
  );
}
