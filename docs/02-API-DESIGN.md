# DashCraft API Design

## Import Patterns

### Main Entry (Full Library)
```tsx
import { Dashboard, DashboardCard, useDashboard } from '@repo/dashcraft';
```

### Card Only (Headless)
```tsx
import { DashboardCard } from '@repo/dashcraft/card';
```

### Hooks Only
```tsx
import { useDashboard, useWidgetData, useResponsive } from '@repo/dashcraft/hooks';
```

### Store Only
```tsx
import { useDashboardStore } from '@repo/dashcraft/store';
```

### HTTP Client Standalone
```tsx
import { useWidgetData } from '@repo/dashcraft/http';
```

### Pre-built Widgets
```tsx
import { RechartsWidget, KPIWidget } from '@repo/dashcraft/widgets';
import { RechartsWidget } from '@repo/dashcraft/widgets/recharts';
```

### Utilities
```tsx
import { createPersistenceAdapter } from '@repo/dashcraft/utils';
```

---

## Dashboard Component

### Props
```tsx
interface DashboardProps {
  persistenceKey?: string;          // Key for localStorage
  storage?: 'localStorage' | 'sessionStorage';
  autoSave?: boolean;               // Auto-save on changes
  autoSaveDelay?: number;           // Debounce delay (ms)
  defaultEditMode?: boolean;        // Start in edit mode
  onLayoutChange?: (layout) => void;
  onEditModeChange?: (isEditMode) => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}
```

### Usage
```tsx
<Dashboard
  persistenceKey="my-dashboard"
  autoSave
  defaultEditMode={false}
>
  {/* Any layout */}
  <div className="grid grid-cols-3 gap-4">
    <DashboardCard id="widget-1" draggable resizable>
      <MyComponent />
    </DashboardCard>
  </div>
</Dashboard>
```

---

## DashboardCard Component (Headless Core)

### Props
```tsx
interface DashboardCardProps {
  id: string;                       // Unique widget ID
  type?: string;                    // Widget type (for categorization)
  title?: string;                   // Display title

  // Features (all optional, default true where sensible)
  draggable?: boolean;              // Can be dragged
  resizable?: boolean;              // Can be resized
  deletable?: boolean;              // Shows delete button
  settings?: boolean;               // Shows settings button
  viewCycler?: boolean;             // Shows view cycler button

  // Settings Panel
  settingsPanel?: React.ReactNode | boolean;  // Custom or built-in

  // Responsive Views
  viewBreakpoints?: {
    initial: React.ReactNode;
    [breakpoint: number]: React.ReactNode;
  };

  // Size & Position
  defaultSize?: { width: number; height: number };
  defaultPosition?: { x: number; y: number };
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;

  // Widget Settings (initial)
  settings?: WidgetSettings;

  // Styling
  className?: string;
  style?: React.CSSProperties;

  // Events
  onSettingsChange?: (settings) => void;
  onDelete?: () => void;
  onResize?: (size) => void;
  onDragEnd?: (position) => void;

  // Content
  children: React.ReactNode;
}
```

### Usage Examples

#### Basic Usage
```tsx
<DashboardCard id="chart-1" title="Sales Chart" draggable resizable>
  <BarChart data={salesData} />
</DashboardCard>
```

#### With Responsive Views
```tsx
<DashboardCard
  id="chart-1"
  title="Sales Chart"
  draggable
  resizable
  viewBreakpoints={{
    initial: <MiniChart data={data} />,
    300: <CompactChart data={data} />,
    600: <FullChart data={data} />,
  }}
/>
```

#### With Settings
```tsx
<DashboardCard
  id="chart-1"
  title="Sales Chart"
  draggable
  resizable
  settings={{
    theme: 'dark',
    endpoint: '/api/sales',
    pollingInterval: 5000,
    highlight: true,
    highlightColor: '#3b82f6',
  }}
  onSettingsChange={(s) => console.log('Settings changed:', s)}
>
  <MyChart />
</DashboardCard>
```

#### With Custom Settings Panel
```tsx
<DashboardCard
  id="chart-1"
  title="Sales Chart"
  draggable
  resizable
  settingsPanel={<MyCustomSettings />}
>
  <MyChart />
</DashboardCard>
```

---

## useDashboard Hook

### Returns
```tsx
interface DashboardContextValue {
  isEditMode: boolean;
  widgets: Record<string, WidgetState>;

  toggleEditMode: () => void;
  setEditMode: (isEditMode: boolean) => void;

  saveLayout: () => void;
  loadLayout: () => void;
  resetLayout: () => void;

  addWidget: (config: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: Position) => void;
  updateWidgetSize: (id: string, size: Size) => void;
  updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void;
  bringToFront: (id: string) => void;
}
```

### Usage
```tsx
function Toolbar() {
  const { isEditMode, toggleEditMode, saveLayout, resetLayout, addWidget } = useDashboard();

  return (
    <div className="flex gap-2">
      <button onClick={toggleEditMode}>
        {isEditMode ? 'Exit Edit' : 'Edit'}
      </button>
      <button onClick={saveLayout}>Save</button>
      <button onClick={resetLayout}>Reset</button>
      <button onClick={() => addWidget({ id: 'new', type: 'custom' })}>
        Add Widget
      </button>
    </div>
  );
}
```

---

## useWidgetData Hook (HTTP Client)

### Props
```tsx
interface UseWidgetDataProps {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  pollingInterval?: number;       // ms, 0 = no polling
  enabled?: boolean;              // Enable/disable fetching
  onSuccess?: (data) => void;
  onError?: (error) => void;
}
```

### Returns
```tsx
interface UseWidgetDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastFetched: Date | null;
  refetch: () => Promise<void>;
  cancel: () => void;
}
```

### Usage
```tsx
function SalesWidget() {
  const { data, loading, error, refetch } = useWidgetData({
    endpoint: '/api/sales',
    pollingInterval: 5000,
    headers: { Authorization: 'Bearer xxx' },
  });

  if (loading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;

  return <SalesChart data={data} />;
}
```

---

## useResponsive Hook

### Props
```tsx
interface UseResponsiveProps {
  breakpoints: {
    initial: React.ReactNode;
    [breakpoint: number]: React.ReactNode;
  };
}
```

### Returns
```tsx
interface UseResponsiveReturn {
  content: React.ReactNode;
  currentBreakpoint: number | 'initial';
  containerRef: React.RefObject<HTMLDivElement>;
}
```

### Usage
```tsx
function ResponsiveWidget() {
  const { content, currentBreakpoint, containerRef } = useResponsive({
    breakpoints: {
      initial: <CompactView />,
      300: <MediumView />,
      600: <FullView />,
    },
  });

  return (
    <div ref={containerRef}>
      Current: {currentBreakpoint}
      {content}
    </div>
  );
}
```

---

## Agentic AI Schema

### DashboardSchema
```tsx
interface DashboardSchema {
  id?: string;
  title?: string;
  layout?: 'grid' | 'flex' | 'free';
  columns?: number;
  gap?: number;
  widgets: WidgetSchema[];
  settings?: DashboardSchemaSettings;
}
```

### WidgetSchema
```tsx
interface WidgetSchema {
  id: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'kpi' | 'table' | 'custom';
  title?: string;
  colSpan?: number;
  rowSpan?: number;
  gridPosition?: { col: number; row: number };
  size?: { width: number; height: number };
  draggable?: boolean;
  resizable?: boolean;
  deletable?: boolean;
  settings?: WidgetSettingsSchema;
  dataSource?: DataSourceSchema;
}
```

### Usage with AI
```tsx
// AI generates this JSON
const schema: DashboardSchema = {
  title: "Sales Dashboard",
  layout: "grid",
  columns: 3,
  widgets: [
    {
      id: "revenue-kpi",
      type: "kpi",
      title: "Total Revenue",
      colSpan: 1,
      dataSource: { endpoint: "/api/revenue" }
    },
    {
      id: "sales-chart",
      type: "bar",
      title: "Monthly Sales",
      colSpan: 2,
      dataSource: { endpoint: "/api/sales", pollingInterval: 30000 }
    }
  ]
};

// Render from schema
<DashboardFromSchema schema={schema} />