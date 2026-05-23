// ============================================================================
// CODEGEN - TSX generation from widget analysis
// ============================================================================

import type { WidgetAnalysis, DashcraftComponent } from './types.js';

function renderWidgetChild(w: WidgetAnalysis): string {
  const component: DashcraftComponent = w.dashcraftComponent;

  switch (component) {
    case 'KPIWidget': {
      const fmt = w.config.format ?? 'number';
      return `        <KPIWidget id="${w.id}-kpi" title="${w.title}" value={0} format="${fmt}" />`;
    }
    case 'RechartsWidget': {
      const chartType = w.config.chartType ?? w.type;
      return `        <RechartsWidget id="${w.id}-recharts" title="${w.title}" chartType="${chartType}" data={[]} />`;
    }
    case 'NivoWidget': {
      const chartType = w.config.chartType ?? w.type;
      return `        <NivoWidget id="${w.id}-nivo" title="${w.title}" chartType="${chartType}" data={[]} />`;
    }
    default: {
      const _exhaustive: never = component;
      throw new Error(`Unknown component: ${_exhaustive}`);
    }
  }
}

function renderDashboardCard(w: WidgetAnalysis): string {
  const gridColumn = `${w.colStart} / span ${w.colSpan}`;
  const gridRow = `${w.rowStart} / span ${w.rowSpan}`;
  const child = renderWidgetChild(w);

  return [
    `      <DashboardCard`,
    `        id="${w.id}"`,
    `        drag`,
    `        resize`,
    `        settings`,
    `        style={{ gridColumn: "${gridColumn}", gridRow: "${gridRow}" }}`,
    `      >`,
    child,
    `      </DashboardCard>`,
  ].join('\n');
}

export function generateTsx(
  widgets: WidgetAnalysis[],
  componentName: string = 'GeneratedDashboard'
): string {
  const cards = widgets.map(renderDashboardCard).join('\n');

  return [
    `import { Dashboard, DashboardCard } from '@dashcraft/core'`,
    `import { KPIWidget, RechartsWidget, NivoWidget } from '@dashcraft/core'`,
    `import '@dashcraft/core/styles.css'`,
    ``,
    `export function ${componentName}() {`,
    `  return (`,
    `    <Dashboard id="generated" persist="generated-v1">`,
    cards,
    `    </Dashboard>`,
    `  )`,
    `}`,
    ``,
  ].join('\n');
}
