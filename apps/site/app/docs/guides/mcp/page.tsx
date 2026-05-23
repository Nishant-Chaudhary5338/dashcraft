import { CopyButton } from "@/components/ui/CopyButton";

export const metadata = { title: "MCP Integration" };

const Code = ({ code }: { code: string }) => (
  <div className="docs-code" style={{ position: "relative" }}>
    <CopyButton text={code} style={{ position: "absolute", top: 12, right: 12 }} />
    <pre style={{ margin: 0, overflowX: "auto" }}><code>{code}</code></pre>
  </div>
);

export default function McpGuidePage() {
  return (
    <div className="docs-page">
      <div className="docs-eyebrow">Guide</div>
      <h1 className="docs-h1">MCP Integration</h1>
      <p className="docs-lead">
        Use the <code>@dashcraft/mcp-codegen</code> MCP server to generate dashboards from
        screenshots with Claude, Cursor, or any MCP-compatible AI tool.
      </p>

      <h2 className="docs-h2" id="install">Install the MCP server</h2>
      <Code code="npm install -g @dashcraft/mcp-codegen" />

      <h2 className="docs-h2" id="register">Register with Claude Desktop</h2>
      <p className="docs-p">Add to your <code>claude_desktop_config.json</code>:</p>
      <Code code={`{
  "mcpServers": {
    "dashcraft": {
      "command": "dashcraft-mcp"
    }
  }
}`} />
      <p className="docs-p" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Config location: <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> on macOS,
        <code>%APPDATA%/Claude/claude_desktop_config.json</code> on Windows.
      </p>

      <h2 className="docs-h2" id="tools">Available tools</h2>

      <h3 className="docs-h3">analyze_dashboard</h3>
      <p className="docs-p">
        Takes a screenshot path or base64 image and uses Claude Vision to identify every
        widget, map it to a <code>@dashcraft/core</code> component, and determine its grid position.
      </p>
      <Code code={`// Example prompt to Claude:
"Analyze /screenshots/my-dashboard.png and tell me what widgets it contains"

// Returns widget array:
[
  {
    "id": "widget-1",
    "type": "kpi",
    "dashcraftComponent": "KPIWidget",
    "title": "Monthly Revenue",
    "colStart": 1, "colSpan": 3, "rowStart": 1, "rowSpan": 2,
    "config": { "format": "currency" }
  },
  ...
]`} />

      <h3 className="docs-h3">generate_code</h3>
      <p className="docs-p">
        Generates production-ready TSX from a widget configuration array.
        Call this after <code>analyze_dashboard</code>.
      </p>
      <Code code={`// Example prompt:
"Generate @dashcraft/core code for these widgets: [widget array]"

// Returns ready-to-use TSX:
import { Dashboard, DashboardCard, KPIWidget } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

export function GeneratedDashboard() {
  return (
    <Dashboard id="generated" persist="generated-v1">
      <DashboardCard id="monthly-revenue-widget" drag resize
        style={{ gridColumn: '1 / span 3', gridRow: '1 / span 2' }}>
        <KPIWidget title="Monthly Revenue" value={0} format="currency" />
      </DashboardCard>
    </Dashboard>
  )
}`} />

      <h3 className="docs-h3">generate_project</h3>
      <p className="docs-p">
        Generates a complete, runnable Vite + React project as a base64-encoded zip file.
        Includes <code>package.json</code>, <code>vite.config.ts</code>, <code>src/Dashboard.tsx</code>, and a README.
      </p>
      <Code code={`// Example prompt:
"Create a full project for this dashboard with the widgets I showed you"

// Returns: base64 zip string → write to disk and extract`} />

      <h2 className="docs-h2" id="workflow">Full AI workflow</h2>
      <p className="docs-p">A typical session with Claude Desktop:</p>
      <Code code={`// 1. Analyze existing dashboard
"Analyze this screenshot: /Users/me/dashboard.png"

// 2. Review and modify
"Change the Revenue widget to show percent format instead of currency"

// 3. Generate project
"Generate a complete Vite project with these widgets"

// 4. Run it
unzip generated.zip && cd my-dashboard && npm install && npm run dev`} />

      <h2 className="docs-h2" id="cursor">Using with Cursor</h2>
      <p className="docs-p">Add to <code>.cursor/mcp.json</code> in your project root:</p>
      <Code code={`{
  "mcpServers": {
    "dashcraft": {
      "command": "dashcraft-mcp"
    }
  }
}`} />
      <p className="docs-p">
        Then in Cursor chat: <code>@dashcraft analyze this screenshot and generate code</code>
      </p>

      <h2 className="docs-h2" id="llmstxt">llms.txt</h2>
      <p className="docs-p">
        dashcraft ships with a <code>llms.txt</code> file at{" "}
        <a href="https://dashcraft.digitribe.world/llms.txt" style={{ color: "var(--accent)" }}>
          dashcraft.digitribe.world/llms.txt
        </a>{" "}
        — a machine-readable quick reference that LLMs can fetch to understand the full API
        without browsing docs pages. This makes dashcraft work seamlessly with any AI tool
        that supports web browsing.
      </p>
    </div>
  );
}
