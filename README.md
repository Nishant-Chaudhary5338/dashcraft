# dashcraft

Headless React dashboard library. Craft dashboards, not headaches.

dashcraft provides the logic, state, and composable building blocks for interactive dashboards. You own the styling. Bring recharts, nivo, or both.

## Features

- **Drag-and-drop layout** — powered by `@dnd-kit`, full keyboard support
- **Resizable widgets** — resize any widget at runtime, sizes persisted in store
- **Edit mode** — toggle between view and edit mode with a single hook
- **KPI widgets** — format values as currency, percentage, or plain number with trend indicators
- **Chart widgets** — recharts bar/line/area/scatter and nivo heatmap/treemap/sunburst, both optional peer deps
- **HTTP client** — typed fetch wrapper with loading/error state wired to the dashboard store
- **Zustand store** — centralised dashboard state, subscribable from anywhere
- **Headless** — zero opinion on colours or spacing; bring Tailwind, CSS modules, or anything else
- **TypeScript first** — strict types throughout, full declaration files included

## Install

```sh
npm install dashcraft
# peer deps
npm install react react-dom
# optional chart peers
npm install recharts
npm install @nivo/core @nivo/heatmap @nivo/treemap @nivo/sunburst
```

## Quick start

```tsx
import { Dashboard, DashboardCard } from 'dashcraft'
import { KPIWidget, RechartsWidget } from 'dashcraft/widgets'
import 'dashcraft/styles.css'

export function SalesDashboard() {
  return (
    <Dashboard id="sales">
      <DashboardCard id="revenue" colSpan={1}>
        <KPIWidget
          id="revenue-kpi"
          title="Revenue"
          value={124500}
          format="currency"
          previousValue={98000}
        />
      </DashboardCard>

      <DashboardCard id="chart" colSpan={2}>
        <RechartsWidget
          id="monthly-sales"
          chartType="bar"
          title="Monthly Sales"
          data={[
            { name: 'Jan', value: 4000 },
            { name: 'Feb', value: 3000 },
            { name: 'Mar', value: 5000 },
          ]}
          series={[{ key: 'value', name: 'Sales', color: '#6366f1' }]}
          xAxisKey="name"
        />
      </DashboardCard>
    </Dashboard>
  )
}
```

## Edit mode

```tsx
import { useDashboard } from 'dashcraft'

function EditToggle() {
  const { isEditMode, toggleEditMode } = useDashboard()
  return <button onClick={toggleEditMode}>{isEditMode ? 'Done' : 'Edit'}</button>
}
```

## HTTP client

```tsx
import { useHttpClient } from 'dashcraft/http'

function LiveWidget() {
  const { data, loading, error, refetch } = useHttpClient<SalesData>('/api/sales')
  if (loading) return <Spinner />
  return <KPIWidget id="live-revenue" value={data?.total ?? 0} format="currency" />
}
```

## Package exports

| Import | What you get |
|---|---|
| `dashcraft` | `Dashboard`, `DashboardCard`, `useDashboard`, `useDashboardStore` |
| `dashcraft/widgets` | All widgets — recharts, nivo, KPI |
| `dashcraft/widgets/recharts` | `RechartsWidget` only |
| `dashcraft/widgets/nivo` | Nivo widgets only |
| `dashcraft/widgets/kpi` | `KPIWidget` only |
| `dashcraft/hooks` | All hooks |
| `dashcraft/store` | Zustand store and actions |
| `dashcraft/http` | `useHttpClient`, typed fetch |
| `dashcraft/utils` | `cn`, formatting helpers |
| `dashcraft/styles.css` | Base styles (import once at app root) |

## Development

```sh
npm install
npm run dev          # watch mode
npm run build        # compile to dist/
npm run test         # vitest
npm run typecheck    # tsc --noEmit
```

## License

MIT
