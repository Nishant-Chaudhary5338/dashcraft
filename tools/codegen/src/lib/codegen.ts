// ============================================================================
// CODEGEN - TSX generation from widget analysis
// Emits current @dashcraft/core API: widgets render their OWN DashboardCard, so
// they are placed directly under <Dashboard> with defaultPosition/defaultSize
// (absolute pixel canvas) — NOT wrapped in an extra DashboardCard or CSS grid.
// ============================================================================

import type { WidgetAnalysis } from './types.js';

const GUTTER = 16;
const COLS = 12;
const CANVAS_WIDTH = 1160;
const ROW_HEIGHT = 96;
const COL_WIDTH = (CANVAS_WIDTH - (COLS - 1) * GUTTER) / COLS;

type Kind = 'kpi' | 'recharts' | 'hierarchy';

const HIERARCHY_TYPES = new Set(['heatmap', 'treemap', 'sunburst']);

function kindOf(w: WidgetAnalysis): Kind {
  if (w.dashcraftComponent === 'KPIWidget') return 'kpi';
  if (HIERARCHY_TYPES.has(w.type)) return 'hierarchy';
  return 'recharts';
}

/** Convert a 12-column grid slot to absolute pixel position/size. */
function place(w: WidgetAnalysis): { x: number; y: number; width: number; height: number } {
  return {
    x: Math.round((w.colStart - 1) * (COL_WIDTH + GUTTER)),
    y: Math.round((w.rowStart - 1) * (ROW_HEIGHT + GUTTER)),
    width: Math.round(w.colSpan * COL_WIDTH + (w.colSpan - 1) * GUTTER),
    height: Math.round(w.rowSpan * ROW_HEIGHT + (w.rowSpan - 1) * GUTTER),
  };
}

function renderWidget(w: WidgetAnalysis): string {
  const p = place(w);
  const common = `    id="${w.id}"
    defaultPosition={{ x: ${p.x}, y: ${p.y} }}
    defaultSize={{ width: ${p.width}, height: ${p.height} }}
    drag resize settings`;

  // User strings emitted as JSX expressions (JSON.stringify) so quotes/brackets
  // in a title can't produce invalid output.
  const title = JSON.stringify(w.title);
  const kind = kindOf(w);
  if (kind === 'kpi') {
    const raw = w.config.format ?? 'number';
    const fmt = raw === 'percent' ? 'percentage' : raw;
    return `  <KPIWidget
${common}
    label={${title}}
    value={0}
    format="${fmt}"
  />`;
  }
  if (kind === 'hierarchy') {
    return `  <HierarchyWidget
${common}
    title={${title}}
    chartType="${w.type}"
    data={/* TODO: add data */ []}
  />`;
  }
  const chartType = (w.config.chartType ?? w.type).replace('_chart', '');
  return `  <RechartsWidget
${common}
    title={${title}}
    chartType="${chartType}"
    data={/* TODO: add data */ []}
    series={[{ dataKey: 'value', name: ${title}, color: '#C2FF3D' }]}
    xAxisKey="name"
  />`;
}

export function generateTsx(
  widgets: WidgetAnalysis[],
  componentName: string = 'GeneratedDashboard'
): string {
  const kinds = new Set(widgets.map(kindOf));
  const imports = [`import { Dashboard } from '@dashcraft/core'`];
  if (kinds.has('kpi')) imports.push(`import { KPIWidget } from '@dashcraft/core/widgets/kpi'`);
  if (kinds.has('recharts')) imports.push(`import { RechartsWidget } from '@dashcraft/core/widgets/recharts'`);
  if (kinds.has('hierarchy')) imports.push(`import { HierarchyWidget } from '@dashcraft/core/widgets/hierarchy'`);
  imports.push(`import '@dashcraft/core/styles.css'`);

  return [
    ...imports,
    ``,
    `export function ${componentName}() {`,
    `  return (`,
    `    <Dashboard persistenceKey="generated-v1" defaultEditMode>`,
    widgets.map(renderWidget).join('\n'),
    `    </Dashboard>`,
    `  )`,
    `}`,
    ``,
  ].join('\n');
}
