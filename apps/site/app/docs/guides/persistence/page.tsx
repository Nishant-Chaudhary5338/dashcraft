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
        Save and restore dashboard layouts automatically — or take full control with custom storage.
      </p>

      <h2 className="docs-h2" id="basic">Basic localStorage persistence</h2>
      <p className="docs-p">Pass a <code>persist</code> key to <code>Dashboard</code>. Layout changes are saved to localStorage automatically.</p>
      <Code code={`<Dashboard id="analytics" persist="analytics-v1">
  {/* ... */}
</Dashboard>`} />
      <div className="docs-callout">
        <strong>Version your key.</strong> When you add, remove, or rename widgets, increment
        the version suffix (<code>-v1</code> → <code>-v2</code>) to reset saved layouts and
        avoid positioning mismatches.
      </div>

      <h2 className="docs-h2" id="session">sessionStorage</h2>
      <p className="docs-p">For layouts that should reset on tab close, use the <code>usePersistence</code> hook with <code>storage: &apos;sessionStorage&apos;</code>.</p>
      <Code code={`import { usePersistence } from '@dashcraft/core'

function MyDashboard() {
  usePersistence('analytics', { storage: 'sessionStorage' })

  return (
    <Dashboard id="analytics">
      {/* ... */}
    </Dashboard>
  )
}`} />

      <h2 className="docs-h2" id="backend">Backend persistence</h2>
      <p className="docs-p">Use the <code>onSave</code> callback to push layouts to your own API:</p>
      <Code code={`import { usePersistence } from '@dashcraft/core'

function MyDashboard() {
  usePersistence('analytics', {
    onSave: async (layout) => {
      await fetch('/api/users/me/dashboard-layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout }),
      })
    },
    onLoad: async () => {
      const res = await fetch('/api/users/me/dashboard-layout')
      const { layout } = await res.json()
      return layout
    },
  })

  return (
    <Dashboard id="analytics">
      {/* ... */}
    </Dashboard>
  )
}`} />

      <h2 className="docs-h2" id="manual">Manual save / restore</h2>
      <p className="docs-p">Get explicit <code>save</code> and <code>restore</code> functions when you want user-triggered saves:</p>
      <Code code={`const { save, restore, clear, hasSaved, lastSaved } = usePersistence('analytics')

// Show a "Saved" badge with timestamp
<span>{hasSaved && \`Saved \${lastSaved?.toLocaleTimeString()}\`}</span>
<button onClick={save}>Save layout</button>
<button onClick={restore}>Reset to saved</button>
<button onClick={clear}>Clear saved layout</button>`} />
    </div>
  );
}
