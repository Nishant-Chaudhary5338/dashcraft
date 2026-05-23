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
        Pass <code>editMode</code> to <code>Dashboard</code>. When true, all cards with
        <code>drag</code> or <code>resize</code> props become interactive.
      </p>
      <Code code={`function App() {
  const [editing, setEditing] = useState(false)

  return (
    <>
      <button onClick={() => setEditing(v => !v)}>
        {editing ? '✓ Done' : '⊞ Edit layout'}
      </button>

      <Dashboard id="main" editMode={editing} persist="main-v1">
        <DashboardCard id="card-1" drag resize settings>
          <KPIWidget title="Revenue" value={124500} format="currency" />
        </DashboardCard>
      </Dashboard>
    </>
  )
}`} />

      <h2 className="docs-h2" id="hook">Using the hook</h2>
      <p className="docs-p">
        Access edit mode state from anywhere in the component tree with <code>useDashboard</code>:
      </p>
      <Code code={`import { useDashboard } from '@dashcraft/core'

function DashboardToolbar() {
  const { editMode, setEditMode } = useDashboard('main')

  return (
    <div className="toolbar">
      <span>{editMode ? 'Drag cards to rearrange' : 'Click Edit to customize'}</span>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Done' : 'Edit'}
      </button>
    </div>
  )
}`} />

      <h2 className="docs-h2" id="per-card">Per-card control</h2>
      <p className="docs-p">
        Each behaviour is independent per card. Mix and match — some cards draggable, others fixed:
      </p>
      <Code code={`<Dashboard id="main" editMode={editing}>
  {/* This card can be dragged and resized */}
  <DashboardCard id="metrics" drag resize>
    <KPIWidget ... />
  </DashboardCard>

  {/* This card can only be deleted — it's pinned */}
  <DashboardCard id="header" delete>
    <Header />
  </DashboardCard>

  {/* This card is completely static */}
  <DashboardCard id="welcome">
    <WelcomeMessage />
  </DashboardCard>
</Dashboard>`} />

      <h2 className="docs-h2" id="settings">Settings panel</h2>
      <p className="docs-p">
        The <code>settings</code> prop adds a gear icon. Wire it to your own panel:
      </p>
      <Code code={`import { useWidgetEvents } from '@dashcraft/core'

function ChartCard({ id }: { id: string }) {
  const [open, setOpen] = useState(false)

  useWidgetEvents(id, {
    onSettings: () => setOpen(true),
  })

  return (
    <>
      <RechartsWidget chartType="bar" data={data} series={series} xAxisKey="month" />
      {open && (
        <SettingsPanel onClose={() => setOpen(false)}>
          <ChartSettingsForm />
        </SettingsPanel>
      )}
    </>
  )
}`} />
    </div>
  );
}
