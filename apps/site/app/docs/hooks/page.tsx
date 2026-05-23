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
        React hooks for accessing dashboard state, subscribing to widget events, and building
        custom widgets that integrate with the dashcraft store.
      </p>

      <h2 className="docs-h2" id="useDashboard">useDashboard</h2>
      <p className="docs-p">Access the top-level dashboard state and toggle edit mode.</p>
      <Code code={`import { useDashboard } from '@dashcraft/core'

function EditToggle() {
  const { editMode, setEditMode, layout } = useDashboard('my-dashboard')

  return (
    <button onClick={() => setEditMode(!editMode)}>
      {editMode ? 'Done' : 'Edit'}
    </button>
  )
}`} />
      <table className="docs-table">
        <thead><tr><th>Return</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>editMode</td><td>boolean</td><td>Whether the dashboard is in edit mode</td></tr>
          <tr><td>setEditMode</td><td>(v: boolean) =&gt; void</td><td>Toggle edit mode</td></tr>
          <tr><td>layout</td><td>Layout</td><td>Current grid layout state</td></tr>
          <tr><td>widgets</td><td>string[]</td><td>IDs of all registered widget cards</td></tr>
        </tbody>
      </table>

      <h2 className="docs-h2" id="useWidgetData">useWidgetData</h2>
      <p className="docs-p">Subscribe to data updates for a specific widget. Use this to push live data into widgets from outside the component tree.</p>
      <Code code={`import { useWidgetData } from '@dashcraft/core'

function LiveKPI({ id }: { id: string }) {
  const { data, setData } = useWidgetData<{ value: number }>(id)

  // Push data from anywhere
  useEffect(() => {
    const interval = setInterval(() => {
      setData({ value: Math.random() * 100000 })
    }, 5000)
    return () => clearInterval(interval)
  }, [setData])

  return <KPIWidget title="Live Metric" value={data?.value ?? 0} format="number" />
}`} />

      <h2 className="docs-h2" id="useWidgetEvents">useWidgetEvents</h2>
      <p className="docs-p">Subscribe to interaction events on a widget (settings click, delete, resize end, drag end).</p>
      <Code code={`import { useWidgetEvents } from '@dashcraft/core'

function MyWidget({ id }: { id: string }) {
  const [showSettings, setShowSettings] = useState(false)

  useWidgetEvents(id, {
    onSettings: () => setShowSettings(true),
    onDelete: (widgetId) => console.log('deleted', widgetId),
    onResizeEnd: (widgetId, newSize) => console.log('resized', newSize),
    onDragEnd: (widgetId, newPosition) => console.log('moved', newPosition),
  })

  return <div>Widget content</div>
}`} />

      <h2 className="docs-h2" id="usePersistence">usePersistence</h2>
      <p className="docs-p">Manually control layout persistence. Useful when you want to save to a backend instead of localStorage.</p>
      <Code code={`import { usePersistence } from '@dashcraft/core'

function DashboardControls() {
  const { save, restore, clear, hasSaved } = usePersistence('my-dashboard', {
    storage: 'localStorage', // or 'sessionStorage'
    onSave: async (layout) => {
      await fetch('/api/layout', {
        method: 'PUT',
        body: JSON.stringify(layout),
      })
    },
  })

  return (
    <div>
      <button onClick={save}>Save layout</button>
      <button onClick={restore} disabled={!hasSaved}>Restore</button>
      <button onClick={clear}>Reset</button>
    </div>
  )
}`} />

      <h2 className="docs-h2" id="useDraggable">useDraggable</h2>
      <p className="docs-p">Raw @dnd-kit drag state for building custom draggable widgets.</p>
      <Code code={`import { useDraggable } from '@dashcraft/core'

function CustomWidget({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable(id)

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
    >
      <div {...listeners} style={{ cursor: 'grab' }}>⠿ Drag here</div>
      <div>Widget content</div>
    </div>
  )
}`} />

      <h2 className="docs-h2" id="useResize">useResize</h2>
      <p className="docs-p">Raw resize state for building custom resizable widgets.</p>
      <Code code={`import { useResize } from '@dashcraft/core'

function CustomWidget({ id }: { id: string }) {
  const { isResizing, currentSize } = useResize(id)

  return (
    <div>
      {isResizing && (
        <div className="resize-hint">
          {currentSize.colSpan} × {currentSize.rowSpan}
        </div>
      )}
      Widget content
    </div>
  )
}`} />
    </div>
  );
}
