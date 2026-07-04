export interface WidgetConfig {
  id: string;
  type: "kpi" | "bar_chart" | "line_chart" | "area_chart" | "pie_chart" | "scatter_chart" | "radar_chart" | "heatmap" | "treemap" | "sunburst";
  title: string;
  /** Pixel position on the canvas */
  defaultPosition: { x: number; y: number };
  /** Pixel size */
  defaultSize: { width: number; height: number };
  drag: boolean;
  resize: boolean;
  settings: boolean;
  delete: boolean;
  config: {
    format?: "currency" | "percent" | "number" | "percentage";
    chartType?: string;
  };
}

const RECHARTS_TYPES = new Set(["bar_chart", "line_chart", "area_chart", "pie_chart", "scatter_chart", "radar_chart"]);
const HIERARCHY_TYPES = new Set(["heatmap", "treemap", "sunburst"]);

function getComponent(type: WidgetConfig["type"]) {
  if (type === "kpi") return "KPIWidget";
  if (RECHARTS_TYPES.has(type)) return "RechartsWidget";
  if (HIERARCHY_TYPES.has(type)) return "HierarchyWidget";
  return "KPIWidget";
}

function getChartType(type: WidgetConfig["type"]): string {
  return type.replace("_chart", "");
}

function boolProps(w: WidgetConfig): string {
  const parts: string[] = [];
  if (w.drag) parts.push("drag");
  if (w.resize) parts.push("resize");
  if (w.settings) parts.push("settings");
  if (w.delete) parts.push("delete");
  return parts.length ? " " + parts.join(" ") : "";
}

function formatProp(w: WidgetConfig): string {
  const f = w.config.format;
  if (!f) return "";
  // Normalise: library accepts "percentage", not "percent"
  const normalised = f === "percent" ? "percentage" : f;
  return ` format="${normalised}"`;
}

function widgetJSX(w: WidgetConfig, indent = "  "): string {
  const comp = getComponent(w.type);
  const pos = `defaultPosition={{ x: ${w.defaultPosition.x}, y: ${w.defaultPosition.y} }}`;
  const size = `defaultSize={{ width: ${w.defaultSize.width}, height: ${w.defaultSize.height} }}`;
  const bools = boolProps(w);
  // Emit user-supplied strings as JSX expressions via JSON.stringify so titles
  // containing quotes, angle brackets, or backslashes can't break the output.
  const title = JSON.stringify(w.title);

  if (comp === "KPIWidget") {
    return `${indent}<KPIWidget
${indent}  id="${w.id}"
${indent}  label={${title}}
${indent}  value={/* TODO: replace with real data */ 0}${formatProp(w)}
${indent}  ${pos}
${indent}  ${size}${bools}
${indent}/>`;
  }

  if (comp === "RechartsWidget") {
    return `${indent}<RechartsWidget
${indent}  id="${w.id}"
${indent}  title={${title}}
${indent}  chartType="${getChartType(w.type)}"
${indent}  data={/* TODO: replace with real data */ []}
${indent}  series={[{ dataKey: 'value', name: ${title}, color: '#6366f1' }]}
${indent}  xAxisKey="name"
${indent}  ${pos}
${indent}  ${size}${bools}
${indent}/>`;
  }

  return `${indent}<HierarchyWidget
${indent}  id="${w.id}"
${indent}  title={${title}}
${indent}  chartType="${getChartType(w.type)}"
${indent}  data={/* TODO: replace with real data */ []}
${indent}  ${pos}
${indent}  ${size}${bools}
${indent}/>`;
}

export function generateDashboardCode(
  widgets: WidgetConfig[],
  componentName = "GeneratedDashboard"
): string {
  const hasRecharts = widgets.some((w) => RECHARTS_TYPES.has(w.type));
  const hasHierarchy = widgets.some((w) => HIERARCHY_TYPES.has(w.type));
  const hasKpi = widgets.some((w) => w.type === "kpi");

  const imports: string[] = [];
  imports.push(`import { Dashboard } from 'dashcraft-core'`);
  if (hasKpi) imports.push(`import { KPIWidget } from 'dashcraft-core/widgets/kpi'`);
  if (hasRecharts) imports.push(`import { RechartsWidget } from 'dashcraft-core/widgets/recharts'`);
  if (hasHierarchy) imports.push(`import { HierarchyWidget } from 'dashcraft-core/widgets/hierarchy'`);
  imports.push(`import 'dashcraft-core/styles.css'`);

  const widgetLines = widgets.map((w) => widgetJSX(w)).join("\n\n");

  return `${imports.join("\n")}

export function ${componentName}() {
  return (
    <Dashboard persistenceKey="generated-v1" defaultEditMode>
${widgetLines}
    </Dashboard>
  )
}
`;
}

export function generateProjectFiles(
  widgets: WidgetConfig[],
  projectName = "my-dashboard"
): Record<string, string> {
  const dashboardCode = generateDashboardCode(widgets, "GeneratedDashboard");

  return {
    "package.json": JSON.stringify(
      {
        name: projectName,
        version: "0.1.0",
        private: true,
        scripts: { dev: "vite", build: "tsc && vite build", preview: "vite preview" },
        dependencies: {
          "dashcraft-core": "^0.1.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          recharts: "^3.0.0",
        },
        devDependencies: {
          "@vitejs/plugin-react": "^4.3.4",
          typescript: "^5.7.0",
          vite: "^6.0.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
        },
      },
      null,
      2
    ),
    "vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ plugins: [react()] })
`,
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
        },
        include: ["src"],
      },
      null,
      2
    ),
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    "src/main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`,
    "src/App.tsx": `import { GeneratedDashboard } from './Dashboard'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#07080f', padding: 24 }}>
      <GeneratedDashboard />
    </div>
  )
}
`,
    "src/Dashboard.tsx": dashboardCode,
    "src/index.css": `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }
`,
    "README.md": `# ${projectName}

Generated with [dashcraft playground](https://dashcraft.digitribe.world/playground).

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:5173 to see your dashboard.

## Customise

Edit \`src/Dashboard.tsx\` — replace the \`/* TODO: replace with real data */\` placeholders with your actual data arrays.
Add \`className\` or \`style\` props to style widgets to match your design system.

## Learn more

- [dashcraft docs](https://dashcraft.digitribe.world/docs)
- [dashcraft-core on npm](https://npmjs.com/package/dashcraft-core)
`,
  };
}
