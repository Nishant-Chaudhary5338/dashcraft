import { CopyButton } from "@/components/ui/CopyButton";

export const metadata = { title: "Hooks" };

const Code = ({ code }: { code: string }) => (
  <div className="docs-code" style={{ position: "relative" }}>
    <CopyButton text={code} style={{ position: "absolute", top: 12, right: 12 }} />
    <pre style={{ margin: 0, overflowX: "auto" }}><code>{code}</code></pre>
  </div>
);

export default function HooksPage() {
  return (
    <div className="docs-page">
      <div className="docs-eyebrow">API Reference</div>
      <h1 className="docs-h1">Hooks</h1>
      <p className="docs-lead">
        React hooks for accessing dashboard state, subscribing to widget events, persisting state,
        and building custom widgets that integrate with the dashcraft store.
      </p>

      <h2 className="docs-h2" id="useDashboard">useDashboard</h2>
      <p className="docs-p">
        Access the dashboard context from any component rendered inside <code>&lt;Dashboard&gt;</code>.
        Takes no arguments and throws if used outside a <code>Dashboard</code> provider. To read or
        toggle edit mode from <em>outside</em> the tree, use <code>useDashboardStore</code> instead.
      </p>
      <Code code={`import { useDashboard } from '@dashcraft/core'

function EditToggle() {
  const { isEditMode, toggleEditMode } = useDashboard()

  return (
    <button onClick={toggleEditMode}>
      {isEditMode ? 'Done' : 'Edit'}
    </button>
  )
}`} />
      <table className="docs-table">
        <thead><tr><th>Return</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>isEditMode</td><td>boolean</td><td>Whether the dashboard is in edit mode</td></tr>
          <tr><td>toggleEditMode</td><td>() =&gt; void</td><td>Flip edit mode on/off</td></tr>
          <tr><td>setEditMode</td><td>(v: boolean) =&gt; void</td><td>Set edit mode to a specific value</td></tr>
          <tr><td>widgets</td><td>Record&lt;string, WidgetState&gt;</td><td>Map of widget id to its position, size, settings, and z-index</td></tr>
          <tr><td>saveLayout / loadLayout / resetLayout</td><td>() =&gt; void</td><td>Persist, restore, or clear the layout for the Dashboard&apos;s persistenceKey</td></tr>
          <tr><td>updateWidgetPosition / updateWidgetSize / updateWidgetSettings</td><td>(id, value) =&gt; void</td><td>Programmatically mutate a widget</td></tr>
          <tr><td>addWidget / removeWidget / bringToFront</td><td>(...) =&gt; void</td><td>Add, remove, or raise a widget</td></tr>
          <tr><td>getWidgetState</td><td>(id: string) =&gt; WidgetState | undefined</td><td>Read a single widget&apos;s current state</td></tr>
        </tbody>
      </table>

      <h2 className="docs-h2" id="usePersistedState">usePersistedState</h2>
      <p className="docs-p">
        A <code>useState</code>-shaped hook that transparently persists to localStorage (auto-save on).
        Handy for widget-level preferences that should survive reloads.
      </p>
      <Code code={`import { usePersistedState } from '@dashcraft/core'

function CurrencyToggle() {
  const [currency, setCurrency] = usePersistedState('kpi-currency', 'USD')

  return (
    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
    </select>
  )
}`} />

      <h2 className="docs-h2" id="useWidgetEvents">useWidgetEvents</h2>
      <p className="docs-p">
        Subscribe to a widget&apos;s lifecycle events via a global event bus. Handlers are keyed by
        event type and receive a <code>WidgetEventPayload</code>. The hook also returns an{" "}
        <code>emit</code> function for firing your own events. A <code>mount</code>/<code>unmount</code>{" "}
        pair is emitted automatically.
      </p>
      <Code code={`import { useWidgetEvents } from '@dashcraft/core'

function MyWidget({ id }: { id: string }) {
  const { emit } = useWidgetEvents(id, {
    mount: (p) => console.log('mounted', p.widgetId),
    resize: (p) => console.log('resized', p.data),
    dataChange: (p) => console.log('data', p.data),
    error: (p) => console.error('error', p.data),
  })

  // Fire a custom event from anywhere in the component
  // emit('dataChange', { value: 42 })

  return <div>Widget content</div>
}`} />
      <p className="docs-p" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Event types: <code>mount</code>, <code>unmount</code>, <code>resize</code>,{" "}
        <code>dataChange</code>, <code>focus</code>, <code>blur</code>, <code>error</code>. Use{" "}
        <code>useWidgetEventsGlobal(listener)</code> to observe events across every widget.
      </p>

      <h2 className="docs-h2" id="usePersistence">usePersistence</h2>
      <p className="docs-p">
        General-purpose persisted state with save/load/clear operations and error handling. Pass an
        options object; it works with any <code>PersistenceAdapter</code> (localStorage by default),
        so you can point it at a backend via the <code>onSave</code>/<code>onLoad</code> callbacks or a
        custom adapter.
      </p>
      <Code code={`import { usePersistence } from '@dashcraft/core'

function Preferences() {
  const { value, setValue, save, load, clear, isSaving, isDirty } = usePersistence({
    key: 'user-preferences',
    defaultValue: { theme: 'light', density: 'comfortable' },
    autoSave: true,
    autoSaveDelay: 1000,
    onSave: async (v) => {
      await fetch('/api/prefs', { method: 'PUT', body: JSON.stringify(v) })
    },
  })

  return (
    <div>
      <button onClick={() => setValue({ ...value, theme: 'dark' })}>Dark</button>
      <button onClick={save} disabled={isSaving}>Save</button>
      <button onClick={load}>Restore</button>
      <button onClick={clear}>Reset</button>
      {isDirty && <span>Unsaved changes</span>}
    </div>
  )
}`} />

      <h2 className="docs-h2" id="useDraggable">useDraggable</h2>
      <p className="docs-p">Raw @dnd-kit drag state for building custom draggable widgets. Pass an options object.</p>
      <Code code={`import { useDraggable } from '@dashcraft/core'

function CustomWidget({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: transform ? \`translate3d(\${transform.x}px, \${transform.y}px, 0)\` : undefined,
      }}
      {...attributes}
    >
      <div {...listeners} style={{ cursor: 'grab' }}>⠿ Drag here</div>
      <div>Widget content</div>
    </div>
  )
}`} />

      <h2 className="docs-h2" id="useResize">useResize</h2>
      <p className="docs-p">Raw resize state for building custom resizable widgets. Pass an options object with the initial size and constraints.</p>
      <Code code={`import { useResize } from '@dashcraft/core'

function CustomWidget() {
  const { size, isResizing, getHandleProps } = useResize({
    initialSize: { width: 300, height: 200 },
    minSize: { width: 150, height: 100 },
    onResizeEnd: (final) => console.log('final size', final),
  })

  return (
    <div style={{ position: 'relative', width: size.width, height: size.height }}>
      {isResizing && <div className="resize-hint">{size.width} × {size.height}</div>}
      Widget content
      <div {...getHandleProps('bottomRight')} />
    </div>
  )
}`} />
      <p className="docs-p" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Returns <code>size</code>, <code>isResizing</code>, <code>activeHandle</code>,{" "}
        <code>setSize</code>, <code>resetSize</code>, <code>getHandleProps(handle)</code>, and{" "}
        <code>getContainerProps()</code>. Handles: <code>top</code>, <code>right</code>,{" "}
        <code>bottom</code>, <code>left</code>, and the four corners.
      </p>
    </div>
  );
}
