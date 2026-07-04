import { CopyButton } from "@/components/ui/CopyButton";

export const metadata = { title: "Persistence" };

const Code = ({ code }: { code: string }) => (
  <div className="docs-code" style={{ position: "relative" }}>
    <CopyButton text={code} style={{ position: "absolute", top: 12, right: 12 }} />
    <pre style={{ margin: 0, overflowX: "auto" }}><code>{code}</code></pre>
  </div>
);

export default function PersistencePage() {
  return (
    <div className="docs-page">
      <div className="docs-eyebrow">Guide</div>
      <h1 className="docs-h1">Persistence</h1>
      <p className="docs-lead">
        Save and restore dashboard layouts automatically — or take full control with manual saves and
        a backend.
      </p>

      <h2 className="docs-h2" id="basic">Basic localStorage persistence</h2>
      <p className="docs-p">
        Pass a <code>persistenceKey</code> to <code>Dashboard</code>. The layout is loaded on mount and
        saved whenever the user leaves edit mode (and on unmount). Layouts are stored in localStorage
        under <code>dashcraft-layout-&lt;persistenceKey&gt;</code>.
      </p>
      <Code code={`<Dashboard persistenceKey="analytics-v1">
  {/* ... */}
</Dashboard>`} />
      <div className="docs-callout">
        <strong>Version your key.</strong> When you add, remove, or rename widgets, increment
        the version suffix (<code>-v1</code> → <code>-v2</code>) to reset saved layouts and
        avoid positioning mismatches.
      </div>

      <h2 className="docs-h2" id="autosave">Auto-save on every change</h2>
      <p className="docs-p">
        By default the layout only saves when leaving edit mode. Add <code>autoSave</code> to persist
        after every move or resize, debounced by <code>autoSaveDelay</code> (default 1000&nbsp;ms).
      </p>
      <Code code={`<Dashboard persistenceKey="analytics-v1" autoSave autoSaveDelay={500}>
  {/* ... */}
</Dashboard>`} />

      <h2 className="docs-h2" id="manual">Manual save / restore</h2>
      <p className="docs-p">
        The <code>useDashboard</code> hook exposes <code>saveLayout</code>, <code>loadLayout</code>, and{" "}
        <code>resetLayout</code> for user-triggered control. They operate on the Dashboard&apos;s{" "}
        <code>persistenceKey</code>, so no argument is needed.
      </p>
      <Code code={`import { useDashboard } from '@dashcraft/core'

function LayoutControls() {
  const { saveLayout, loadLayout, resetLayout } = useDashboard()

  return (
    <div>
      <button onClick={saveLayout}>Save layout</button>
      <button onClick={loadLayout}>Restore saved</button>
      <button onClick={resetLayout}>Reset to defaults</button>
    </div>
  )
}`} />

      <h2 className="docs-h2" id="backend">Backend persistence</h2>
      <p className="docs-p">
        Use the <code>onLayoutChange</code> callback to mirror the layout to your own API. It receives
        the full widget map (<code>Record&lt;string, WidgetState&gt;</code>) whenever anything moves,
        resizes, or changes settings.
      </p>
      <Code code={`import { Dashboard } from '@dashcraft/core'

function MyDashboard() {
  return (
    <Dashboard
      persistenceKey="analytics-v1"
      autoSave
      onLayoutChange={async (layout) => {
        await fetch('/api/users/me/dashboard-layout', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layout }),
        })
      }}
    >
      {/* ... */}
    </Dashboard>
  )
}`} />
      <p className="docs-p" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        To restore a server-side layout, fetch it before render and seed each card&apos;s{" "}
        <code>defaultPosition</code> / <code>defaultSize</code> from the stored values (or write the map
        into localStorage under <code>dashcraft-layout-&lt;persistenceKey&gt;</code> so the built-in
        loader picks it up).
      </p>

      <h2 className="docs-h2" id="arbitrary">Persisting arbitrary state</h2>
      <p className="docs-p">
        For widget preferences or any non-layout state, the generic <code>usePersistence</code> and{" "}
        <code>usePersistedState</code> hooks persist any serializable value with save/load/clear and
        optional auto-save. They accept a custom <code>PersistenceAdapter</code>, so they work against
        localStorage, sessionStorage, or your own storage.
      </p>
      <Code code={`import { usePersistedState } from '@dashcraft/core'

const [filters, setFilters] = usePersistedState('analytics-filters', {
  range: '30d',
  compare: false,
})`} />
    </div>
  );
}
