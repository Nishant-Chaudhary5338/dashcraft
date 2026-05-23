export interface WidgetConfig {
  id: string;
  type: "kpi" | "bar_chart" | "line_chart" | "area_chart" | "pie_chart" | "scatter_chart" | "radar_chart" | "heatmap" | "treemap" | "sunburst";
  title: string;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
  drag: boolean;
  resize: boolean;
  settings: boolean;
  delete: boolean;
  config: {
    format?: "currency" | "percent" | "number";
    chartType?: string;
    colorScheme?: string;
  };
}

const RECHARTS_TYPES = new Set(["bar_chart", "line_chart", "area_chart", "pie_chart", "scatter_chart", "radar_chart"]);
const NIVO_TYPES = new Set(["heatmap", "treemap", "sunburst"]);

function getComponent(type: WidgetConfig["type"]) {
  if (type === "kpi") return "KPIWidget";
  if (RECHARTS_TYPES.has(type)) return "RechartsWidget";
  if (NIVO_TYPES.has(type)) return "NivoWidget";
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
  if (!w.delete) parts.push("delete={false}");
  return parts.length ? " " + parts.join(" ") : "";
}

function widgetJSX(w: WidgetConfig, indent = "      "): string {
  const comp = getComponent(w.type);
  const id = `${w.id}-widget`;

  if (comp === "KPIWidget") {
    return `${indent}<KPIWidget
${indent}  id="${id}"
${indent}  title="${w.title}"
${indent}  value={0}
${indent}  format="${w.config.format ?? "number"}"
${indent}/>`;
  }
  if (comp === "RechartsWidget") {
    return `${indent}<RechartsWidget
${indent}  id="${id}"
${indent}  title="${w.title}"
${indent}  chartType="${getChartType(w.type)}"
${indent}  data={[]}
${indent}  series={[{ key: 'value', name: '${w.title}', color: '#6366f1' }]}
${indent}  xAxisKey="name"
${indent}/>`;
  }
  return `${indent}<NivoWidget
${indent}  id="${id}"
${indent}  title="${w.title}"
${indent}  chartType="${getChartType(w.type)}"
${indent}  data={[]}
${indent}/>`;
}

export function generateDashboardCode(
  widgets: WidgetConfig[],
  componentName = "GeneratedDashboard"
): string {
  const hasRecharts = widgets.some((w) => RECHARTS_TYPES.has(w.type));
  const hasNivo = widgets.some((w) => NIVO_TYPES.has(w.type));
  const hasKpi = widgets.some((w) => w.type === "kpi");

  const widgetImports: string[] = ["Dashboard", "DashboardCard"];
  if (hasKpi) widgetImports.push("KPIWidget");
  if (hasRecharts) widgetImports.push("RechartsWidget");
  if (hasNivo) widgetImports.push("NivoWidget");

  const cards = widgets
    .map((w) => {
      const style = `style={{ gridColumn: '${w.colStart} / span ${w.colSpan}', gridRow: '${w.rowStart} / span ${w.rowSpan}' }}`;
      return `    <DashboardCard id="${w.id}"${boolProps(w)}\n      ${style}\n    >\n${widgetJSX(w)}\n    </DashboardCard>`;
    })
    .join("\n\n");

  return `import { ${widgetImports.join(", ")} } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

export function ${componentName}() {
  return (
    <Dashboard id="generated" persist="generated-v1">
${cards}
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
          "@dashcraft/core": "^0.1.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          recharts: "^2.15.0",
        },
        devDependencies: {
          "@vitejs/plugin-react": "^4.3.4",
          typescript: "^5.7.0",
          vite: "^6.0.0",
          "@types/react": "^18.3.0",
          "@types/react-dom": "^18.3.0",
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

Edit \`src/Dashboard.tsx\` — replace the \`data={[]}\` props with your real data.
Add \`className\` or \`style\` props to style widgets to match your design system.

## Learn more

- [dashcraft docs](https://dashcraft.digitribe.world/docs)
- [@dashcraft/core on npm](https://npmjs.com/package/@dashcraft/core)
`,
  };
}
