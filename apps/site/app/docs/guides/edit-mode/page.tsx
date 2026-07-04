import { CopyButton } from "@/components/ui/CopyButton";

export const metadata = { title: "Edit Mode" };

const Code = ({ code }: { code: string }) => (
  <div className="docs-code" style={{ position: "relative" }}>
    <CopyButton text={code} style={{ position: "absolute", top: 12, right: 12 }} />
    <pre style={{ margin: 0, overflowX: "auto" }}><code>{code}</code></pre>
  </div>
);

export default function EditModePage() {
  return (
    <div className="docs-page">
      <div className="docs-eyebrow">Guide</div>
      <h1 className="docs-h1">Edit Mode</h1>
      <p className="docs-lead">
        Let users rearrange and resize their own dashboard without writing any custom drag-and-drop logic.
      </p>

      <h2 className="docs-h2" id="toggle">Toggling edit mode</h2>
      <p className="docs-p">
        There is no <code>editMode</code> prop. Set the initial state with <code>defaultEditMode</code>,
        then flip it at runtime with the <code>useDashboard</code> hook (from a component rendered inside
        the <code>Dashboard</code>) or <code>useDashboardStore</code> (from anywhere). When edit mode is on,
        every card with <code>drag</code> or <code>resize</code> enabled becomes interactive.
      </p>
      <Code code={`import { Dashboard, KPIWidget, useDashboard } from '@dashcraft/core'

function EditToggle() {
  const { isEditMode, toggleEditMode } = useDashboard()
  return (
    <button onClick={toggleEditMode}>
      {isEditMode ? '✓ Done' : '⊞ Edit layout'}
    </button>
  )
}

function App() {
  return (
    <Dashboard persistenceKey="main-v1" autoSave>
      <EditToggle />
      <KPIWidget
        id="card-1"
        label="Revenue"
        value={124500}
        format="currency"
        defaultPosition={{ x: 0, y: 40 }}
        defaultSize={{ width: 280, height: 180 }}
      />
    </Dashboard>
  )
}`} />
      <div className="docs-callout">
        <strong>Leaving edit mode saves.</strong> When <code>persistenceKey</code> is set, the layout is
        saved to localStorage as users exit edit mode (and on unmount). Turn on <code>autoSave</code> to
        also save on every change.
      </div>

      <h2 className="docs-h2" id="toggle-outside">Toggling from outside the tree</h2>
      <p className="docs-p">
        <code>useDashboard</code> must run inside a <code>Dashboard</code>. To drive edit mode from a
        toolbar that sits elsewhere, subscribe to the store directly:
      </p>
      <Code code={`import { useDashboardStore, selectIsEditMode } from '@dashcraft/core'

function GlobalToolbar() {
  const isEditMode = useDashboardStore(selectIsEditMode)
  const toggleEditMode = useDashboardStore((s) => s.toggleEditMode)

  return (
    <button onClick={toggleEditMode}>
      {isEditMode ? 'Drag cards to rearrange' : 'Click Edit to customize'}
    </button>
  )
}`} />

      <h2 className="docs-h2" id="per-card">Per-card control</h2>
      <p className="docs-p">
        Each behaviour is an independent boolean prop that <strong>defaults to <code>true</code></strong>.
        To pin a card, opt each behaviour out explicitly:
      </p>
      <Code code={`{/* Fully interactive — drag, resize, delete, settings all default on */}
<KPIWidget id="metrics" label="Sessions" value={8412} />

{/* Draggable but not resizable or deletable */}
<KPIWidget id="header-kpi" label="MRR" value={92000} resize={false} delete={false} />

{/* Completely static — nothing moves */}
<KPIWidget id="welcome" label="Welcome" value="Hi" drag={false} resize={false} delete={false} settings={false} />`} />

      <h2 className="docs-h2" id="resize-handles">Resize handles</h2>
      <p className="docs-p">
        Resize grips render at the corners in edit mode. By default a card shows both{" "}
        <em>bottom</em> corners — <code>{`["bottomRight", "bottomLeft"]`}</code>. That default exists so a
        widget flush against the container&apos;s right edge (where the bottom-right grip has no room to
        drag outward) always has a reachable grip: the bottom-left one grows it leftward. Override with
        the <code>resizeHandles</code> prop when you want different corners:
      </p>
      <Code code={`{/* Default — both bottom corners, always reachable */}
<DashboardCard id="a" defaultSize={{ width: 300, height: 200 }}>...</DashboardCard>

{/* Only the bottom-right grip */}
<DashboardCard id="b" resizeHandles={['bottomRight']} defaultSize={{ width: 300, height: 200 }}>...</DashboardCard>

{/* All four corners */}
<DashboardCard id="c" resizeHandles={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}>...</DashboardCard>`} />

      <h2 className="docs-h2" id="view-sizes">Double-click to cycle sizes</h2>
      <p className="docs-p">
        Give a card a set of <code>viewSizes</code> and users can double-click it to snap through the
        presets with a smooth animated resize — turning width-driven responsive layouts into a single
        click. The resize is anchored to the card&apos;s home (default) position, so growing shifts it
        only as far as needed to stay inside the canvas and shrinking returns it to its original spot.
        The gesture is on by default; set <code>snapOnDoubleClick={`{false}`}</code> to disable it while
        keeping the toolbar cycle button.
      </p>
      <Code code={`<DashboardCard
  id="chart"
  defaultPosition={{ x: 0, y: 0 }}
  defaultSize={{ width: 320, height: 220 }}
  viewSizes={[
    { width: 320, height: 220 },  // compact
    { width: 480, height: 300 },  // medium
    { width: 720, height: 420 },  // expanded
  ]}
>
  <RechartsWidget chartType="line" data={data} series={series} xAxisKey="day" />
</DashboardCard>`} />

      <h2 className="docs-h2" id="settings">Settings panel</h2>
      <p className="docs-p">
        The <code>settings</code> prop adds a gear icon (visible in edit mode by default — set{" "}
        <code>settingsVisibility=&quot;always&quot;</code> to keep it on). Pass a ReactNode to{" "}
        <code>settings</code> for a custom panel, and react to built-in changes with{" "}
        <code>onSettingsChange</code>:
      </p>
      <Code code={`function ChartCard({ id }: { id: string }) {
  return (
    <RechartsWidget
      id={id}
      chartType="bar"
      data={data}
      series={series}
      xAxisKey="month"
      settings
      settingsVisibility="always"
      onSettingsChange={(settings) => {
        console.log('opacity, theme, highlight…', settings)
      }}
    />
  )
}`} />
    </div>
  );
}
