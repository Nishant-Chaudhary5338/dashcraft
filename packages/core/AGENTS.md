# AGENTS.md — @dashcraft/core

Instructions for AI agents building dashboards with `@dashcraft/core`.

---

## Package Overview

`@dashcraft/core` is a **headless React dashboard library** that provides:
- Drag-and-drop layout with `@dnd-kit`
- Resizable widgets
- KPI cards with trend indicators
- Recharts integration (bar, line, area, pie, scatter, radar, radialBar)
- Nivo integration (heatmap, treemap, sunburst)
- Zustand-based persistent store
- Settings panels per widget
- Layout persistence (localStorage / sessionStorage)

---

## Installation

```bash
npm install @dashcraft/core
# Peer deps for charts (optional):
npm install recharts
npm install @nivo/core @nivo/heatmap @nivo/treemap @nivo/sunburst
```

---

## Import Paths

```ts
// Core components and hooks
import { Dashboard, DashboardCard, useDashboard, useDashboardStore } from '@dashcraft/core'

// Chart widgets (peer deps required)
import { RechartsWidget } from '@dashcraft/core/widgets/recharts'
import { NivoWidget } from '@dashcraft/core/widgets/nivo'
import { KPIWidget } from '@dashcraft/core/widgets/kpi'

// All widgets from one path
import { RechartsWidget, NivoWidget, KPIWidget } from '@dashcraft/core/widgets'

// Hooks only (tree-shakeable)
import { useDashboard, useStateWithHistory, useDebounce } from '@dashcraft/core/hooks'

// Store only
import { useDashboardStore } from '@dashcraft/core/store'

// CSS (required for edit-mode UI)
import '@dashcraft/core/styles.css'
```

---

## Component API Reference

### `<Dashboard>`

Root provider component. Must wrap all `DashboardCard` components.

```tsx
<Dashboard
  id="my-dashboard"         // optional, for namespacing
  persist="my-layout-v1"    // localStorage key for layout persistence
  storage="localStorage"    // "localStorage" | "sessionStorage" (default: "localStorage")
  defaultEdit={false}       // start in edit mode (default: false)
  onLayoutChange={(widgets) => void}  // called whenever layout changes
>
  {children}
</Dashboard>
```

### `<DashboardCard>`

Widget wrapper. Registers itself with the Dashboard store on mount.

```tsx
<DashboardCard
  id="widget-id"            // required, unique per dashboard
  title="My Widget"         // optional display title
  drag                      // boolean — enable drag-to-move (default: true)
  resize                    // boolean — enable resize handles (default: true)
  delete                    // boolean — show delete button in edit mode (default: true)
  settings                  // boolean | ReactNode — show settings gear (default: true)
                            //   pass ReactNode to replace default settings panel content
  viewCycler                // boolean — show view size cycler (default: false)
  resizeHandles={["bottomRight"]}  // which corner handles to show
  settingsVisibility="edit-mode"   // "edit-mode" | "always"
  defaultSize={{ width: 300, height: 200 }}
  defaultPosition={{ x: 0, y: 0 }}
  className="custom-class"
  style={{ background: '#fff' }}
  onDelete={() => void}
  onSettingsChange={(settings) => void}
>
  {children}
</DashboardCard>
```

**Key prop names (simplified API):**
- `drag` — was `draggable` in older versions
- `resize` — was `resizable` / `isResizable`
- `delete` — was `deletable`
- `settings` — accepts `boolean` (show/hide) or `ReactNode` (custom panel)

### `<KPIWidget>`

```tsx
<KPIWidget
  id="kpi-1"
  title="Monthly Revenue"
  value={124500}
  format="currency"         // "number" | "currency" | "percent"
  previousValue={98000}     // enables trend calculation
  trend="up"                // "up" | "down" | "neutral" (auto-calculated if previousValue given)
  prefix="$"
  suffix="k"
/>
```

### `<RechartsWidget>`

```tsx
<RechartsWidget
  id="chart-1"
  chartType="bar"           // "bar" | "line" | "area" | "pie" | "scatter" | "radar" | "radialBar"
  title="Sales by Month"
  data={[
    { name: 'Jan', revenue: 4000, costs: 2400 },
    { name: 'Feb', revenue: 3000, costs: 1398 },
  ]}
  series={[
    { key: 'revenue', name: 'Revenue', color: '#6366f1' },
    { key: 'costs',   name: 'Costs',   color: '#f43f5e' },
  ]}
  xAxisKey="name"
  height={300}
/>
```

### `<NivoWidget>`

```tsx
<NivoWidget
  id="heatmap-1"
  chartType="heatmap"       // "heatmap" | "treemap" | "sunburst"
  title="Activity Heatmap"
  data={nivoFormattedData}
  colorScheme="blues"
  height={300}
/>
```

---

## Hooks API

### `useDashboard()`

Must be called inside a `<Dashboard>` provider.

```ts
const {
  isEditMode,
  toggleEditMode,
  setEditMode,
  widgets,              // Record<string, WidgetState>
  addWidget,
  removeWidget,
  updateWidgetPosition,
  updateWidgetSize,
  updateWidgetSettings,
  saveLayout,           // saveLayout(key: string) — saves to storage
  loadLayout,           // loadLayout(key: string) — loads from storage
  resetLayout,          // clears all widgets
} = useDashboard()
```

### `useDashboardStore()`

Direct Zustand store. Use for subscriptions outside of a `<Dashboard>` provider.

```ts
const isEditMode = useDashboardStore((state) => state.isEditMode)
const widgets = useDashboardStore((state) => state.widgets)
```

### `useStateWithHistory<T>(initialValue, options?)`

State management with undo/redo navigation.

```ts
const [state] = useStateWithHistory("initial", { maxHistory: 50 })

state.value          // current value
state.history        // T[] — full history
state.index          // current position in history
state.canGoBack      // boolean
state.canGoForward   // boolean
state.set("newValue")          // add new entry, truncates future
state.set((prev) => prev + "!") // functional update
state.back()         // undo
state.forward()      // redo
state.go(0)          // jump to index
state.reset("fresh") // clear history, start fresh
```

### `useDebounce(value, delay)` / `useDebouncedCallback(fn, delay)`

```ts
const debouncedSearch = useDebounce(searchQuery, 300)
const debouncedSave = useDebouncedCallback((data) => save(data), 500)
```

### `useThrottle(value, limit)` / `useThrottledCallback(fn, limit)`

```ts
const throttledScroll = useThrottle(scrollY, 16)
```

### `useWidgetEvents(id)` / `useWidgetEventsGlobal()`

Widget-level event bus for cross-widget communication.

```ts
const { emit, on, off } = useWidgetEvents("widget-id")
emit("data-update", { values: [...] })

const { onAll } = useWidgetEventsGlobal()
onAll((widgetId, event, payload) => { ... })
```

### `usePersistence(key, options)` / `usePersistedState(key, defaultValue)`

```ts
const [value, setValue] = usePersistedState("my-key", defaultValue)
```

---

## Common Patterns

### Edit mode toggle button

```tsx
function EditToggle() {
  const { isEditMode, toggleEditMode } = useDashboard()
  return (
    <button onClick={toggleEditMode}>
      {isEditMode ? 'Save Layout' : 'Edit Dashboard'}
    </button>
  )
}
```

### Save/load layout

```tsx
function LayoutControls() {
  const { saveLayout, loadLayout, resetLayout } = useDashboard()
  return (
    <>
      <button onClick={() => saveLayout('my-layout')}>Save</button>
      <button onClick={() => loadLayout('my-layout')}>Load</button>
      <button onClick={resetLayout}>Reset</button>
    </>
  )
}
```

### Custom settings panel

```tsx
<DashboardCard
  id="custom"
  settings={
    <div className="p-4">
      <h3>My Custom Settings</h3>
      <input type="text" placeholder="Widget title" />
    </div>
  }
>
  <MyWidget />
</DashboardCard>
```

### Widget with responsive breakpoints

```tsx
<DashboardCard
  id="responsive-widget"
  viewCycler
  viewBreakpoints={{
    initial: <CompactView />,
    300: <MediumView />,
    600: <FullView />,
  }}
/>
```

### Widget event communication

```tsx
// Emitter widget
function DataSourceWidget({ id }: { id: string }) {
  const { emit } = useWidgetEvents(id)
  return <button onClick={() => emit('refresh', { timestamp: Date.now() })}>Refresh All</button>
}

// Listener widget
function ChartWidget({ id }: { id: string }) {
  const { on } = useWidgetEvents(id)
  useEffect(() => {
    return on('refresh', (payload) => { refetch() })
  }, [on])
  return <MyChart />
}
```

---

## Code Generation Templates

### Minimal dashboard

```tsx
import { Dashboard, DashboardCard } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

export function MyDashboard() {
  return (
    <Dashboard id="main" persist="main-v1">
      <DashboardCard id="card-1" drag resize title="My Widget">
        <p>Widget content here</p>
      </DashboardCard>
    </Dashboard>
  )
}
```

### Full analytics dashboard

```tsx
import { Dashboard, DashboardCard, useDashboard } from '@dashcraft/core'
import { KPIWidget } from '@dashcraft/core/widgets/kpi'
import { RechartsWidget } from '@dashcraft/core/widgets/recharts'
import '@dashcraft/core/styles.css'

function EditControls() {
  const { isEditMode, toggleEditMode, saveLayout } = useDashboard()
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={toggleEditMode}>
        {isEditMode ? 'Done' : 'Edit'}
      </button>
      {isEditMode && (
        <button onClick={() => saveLayout('analytics-v1')}>Save Layout</button>
      )}
    </div>
  )
}

export function AnalyticsDashboard() {
  return (
    <Dashboard id="analytics" persist="analytics-v1">
      <EditControls />
      <DashboardCard id="revenue-kpi" drag resize defaultSize={{ width: 280, height: 120 }}>
        <KPIWidget
          id="revenue"
          title="Monthly Revenue"
          value={124500}
          format="currency"
          previousValue={98000}
        />
      </DashboardCard>
      <DashboardCard id="sales-chart" drag resize settings defaultSize={{ width: 560, height: 300 }}>
        <RechartsWidget
          id="sales"
          chartType="line"
          title="Sales Trend"
          data={[
            { month: 'Jan', sales: 4000 },
            { month: 'Feb', sales: 3200 },
            { month: 'Mar', sales: 5800 },
          ]}
          series={[{ key: 'sales', name: 'Sales', color: '#6366f1' }]}
          xAxisKey="month"
        />
      </DashboardCard>
    </Dashboard>
  )
}
```

---

## TypeScript Types

```ts
import type {
  WidgetState,
  WidgetConfig,
  WidgetSettings,
  DashboardConfig,
  Position,
  Size,
  KPIFormat,
  KPITrend,
  ChartType,
  NivoChartType,
} from '@dashcraft/core'
```

---

## Do / Don't

| Do | Don't |
|---|---|
| Wrap everything in `<Dashboard>` | Use hooks outside `<Dashboard>` |
| Use `drag`, `resize`, `delete` props | Use old `draggable`, `deletable` props |
| Pass `persist` to auto-save layout | Manually serialize widget positions |
| Use `saveLayout(key)` / `loadLayout(key)` | Access localStorage directly |
| Import charts from sub-paths | Bundle all widgets in one import |
| Use `settings={<CustomPanel />}` for custom UI | Duplicate the SettingsPanel component |
