# DashCraft Architecture

## Package Structure

```
packages/dashcraft/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
│
├── docs/                              # Project documentation
│   ├── 00-PROJECT-OVERVIEW.md
│   ├── 01-FEATURES.md
│   ├── 02-API-DESIGN.md
│   ├── 03-ARCHITECTURE.md            # This file
│   ├── 04-DEV-RULES.md
│   ├── 05-DEV-PHASES.md
│   ├── 06-TESTING-STRATEGY.md
│   ├── 07-OPTIMIZATION.md
│   └── 08-AGENTIC-AI.md
│
├── .clinerules/                       # Cline rules for consistency
│   ├── typescript.rules.md
│   ├── react.rules.md
│   ├── tailwind.rules.md
│   ├── architecture.rules.md
│   └── optimization.rules.md
│
├── src/
│   ├── index.ts                       # Main barrel export
│   │
│   ├── types/
│   │   └── index.ts                   # All shared types
│   │
│   ├── store/
│   │   ├── index.ts
│   │   └── dashboardStore.ts          # Zustand store
│   │
│   ├── components/
│   │   ├── index.ts
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── index.ts
│   │   │   ├── Dashboard.tsx          # Context provider
│   │   │   ├── Dashboard.context.tsx  # Context definition
│   │   │   ├── Dashboard.types.ts
│   │   │   └── Dashboard.test.tsx
│   │   │
│   │   └── DashboardCard/             # ★ HEADLESS CORE
│   │       ├── index.ts
│   │       ├── DashboardCard.tsx      # Main card component
│   │       ├── DashboardCard.types.ts
│   │       ├── DashboardCardHeader.tsx # Header with actions
│   │       ├── DashboardCardHeader.types.ts
│   │       ├── DashboardCardSettings.tsx # Settings panel
│   │       ├── DashboardCardSettings.types.ts
│   │       ├── DashboardCardViewCycler.tsx # View cycle button
│   │       ├── DashboardCardViewCycler.types.ts
│   │       ├── DashboardCardResize.tsx # Resize handles
│   │       ├── DashboardCard.styles.ts # Animation variants
│   │       └── DashboardCard.test.tsx
│   │
│   ├── widgets/                        # Pre-built wrappers
│   │   ├── index.ts
│   │   │
│   │   ├── recharts/
│   │   │   ├── index.ts
│   │   │   ├── RechartsWidget.tsx
│   │   │   ├── RechartsWidget.types.ts
│   │   │   ├── charts/
│   │   │   │   ├── BarChart.tsx
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── AreaChart.tsx
│   │   │   │   ├── PieChart.tsx
│   │   │   │   └── index.ts
│   │   │   └── RechartsWidget.test.tsx
│   │   │
│   │   ├── nivo/
│   │   │   └── ...
│   │   │
│   │   └── kpi/
│   │       ├── index.ts
│   │       ├── KPIWidget.tsx
│   │       ├── KPIWidget.types.ts
│   │       └── KPIWidget.test.tsx
│   │
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useDashboard.ts            # Context consumer
│   │   ├── useResponsive.ts           # Breakpoint observer
│   │   ├── useWidgetData.ts           # HTTP client
│   │   ├── usePersistence.ts          # Save/load layout
│   │   ├── useDebouncedCallback.ts    # Debounce utility
│   │   ├── useThrottledCallback.ts    # Throttle utility
│   │   └── hooks.test.tsx
│   │
│   ├── utils/
│   │   ├── index.ts
│   │   ├── persistence.ts             # Storage adapters
│   │   ├── persistence.types.ts
│   │   ├── http-client.ts             # Fetch wrapper
│   │   ├── http-client.types.ts
│   │   ├── animations.ts              # Animation presets
│   │   ├── constants.ts               # Shared constants
│   │   └── utils.test.ts
│   │
│   └── agentic/                        # AI integration
│       ├── index.ts
│       ├── factory.ts                  # Dashboard factory
│       ├── templates.ts                # Preset templates
│       └── agentic.test.ts
│
└── stories/
    ├── Dashboard.stories.tsx
    ├── DashboardCard.stories.tsx
    └── RechartsWidget.stories.tsx
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Code                          │
│                                                             │
│  <Dashboard persistenceKey="my-dash">                      │
│    <div className="grid">                                   │
│      <DashboardCard id="1" draggable resizable>            │
│        <MyChart />                                          │
│      </DashboardCard>                                       │
│    </div>                                                   │
│  </Dashboard>                                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Dashboard Component                        │
│                                                             │
│  1. Creates Zustand store (or uses existing)                │
│  2. Wraps children with DashboardContext.Provider           │
│  3. Passes store actions as context value                   │
│  4. Handles persistence lifecycle                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              DashboardCard Component                        │
│                                                             │
│  1. Registers with store on mount                           │
│  2. Reads own state from store                              │
│  3. Integrates @dnd-kit for drag                            │
│  4. Integrates re-resizable for resize                      │
│  5. Uses framer-motion for animations                       │
│  6. Renders responsive content via useResponsive            │
│  7. Shows header with actions (settings, delete, view)      │
│  8. Updates store on user interactions                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Zustand Store                              │
│                                                             │
│  State:                                                     │
│  - isEditMode: boolean                                       │
│  - widgets: Record<string, WidgetState>                     │
│  - maxZIndex: number                                         │
│                                                             │
│  Actions:                                                   │
│  - toggleEditMode, setEditMode                              │
│  - addWidget, removeWidget                                  │
│  - updateWidgetPosition, updateWidgetSize                   │
│  - updateWidgetSettings, bringToFront                       │
│  - saveLayout, loadLayout, resetLayout                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
<Dashboard>                          # Context provider, no DOM
  <DashboardContext.Provider>        # Provides store actions
    {children}                       # Developer's layout (any structure)
      <DashboardCard>                # Headless card wrapper
        <motion.div>                 # Animation wrapper
          <DashboardCardHeader>      # Title, drag handle, actions
            <DragHandle />
            <Title />
            <ViewCyclerButton />
            <SettingsButton />
            <DeleteButton />
          </DashboardCardHeader>
          <DashboardCardResize>      # re-resizable wrapper
            <ResponsiveContent>      # useResponsive hook
              {children}             # Developer's component
            </ResponsiveContent>
          </DashboardCardResize>
          <DashboardCardSettings>    # Settings popover
            <ThemeSelector />
            <HighlightToggle />
            <EndpointInput />
            <PollingSlider />
          </DashboardCardSettings>
        </motion.div>
      </DashboardCard>
  </DashboardContext.Provider>
</Dashboard>
```

---

## State Management Architecture

### Store Shape
```typescript
{
  isEditMode: boolean,
  widgets: {
    "widget-1": {
      id: "widget-1",
      position: { x: 100, y: 50 },
      size: { width: 400, height: 300 },
      zIndex: 5,
      settings: {
        theme: "dark",
        endpoint: "/api/data",
        pollingInterval: 5000,
        highlight: true,
        highlightColor: "#3b82f6"
      },
      type: "bar",
      title: "Sales Chart",
      isMinimized: false
    },
    "widget-2": { ... }
  },
  maxZIndex: 10
}
```

### Context Value (Exposed to Developers)
```typescript
{
  isEditMode: boolean,
  widgets: Record<string, WidgetState>,

  toggleEditMode: () => void,
  setEditMode: (isEditMode: boolean) => void,

  saveLayout: () => void,
  loadLayout: () => void,
  resetLayout: () => void,

  addWidget: (config: WidgetConfig) => void,
  removeWidget: (id: string) => void,
  updateWidgetPosition: (id: string, position: Position) => void,
  updateWidgetSize: (id: string, size: Size) => void,
  updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void,
  bringToFront: (id: string) => void,
  registerWidget: (id: string, config: WidgetConfig) => void,
  unregisterWidget: (id: string) => void,
  getWidgetState: (id: string) => WidgetState | undefined
}
```

---

## External Library Integration

### @dnd-kit (Drag & Drop)
- DndContext wraps Dashboard
- useDraggable on each DashboardCard
- Throttled position updates (16ms)
- Keyboard accessibility built-in

### re-resizable (Resize)
- Resizable component wraps content
- 8 handles configured
- Min/max constraints from props
- Debounced size updates (150ms)

### framer-motion (Animations)
- AnimatePresence for mount/unmount
- motion.div for drag/resize animations
- Spring physics for natural motion
- Layout animations for smooth transitions

### Radix UI (Settings)
- Popover for settings panel
- DropdownMenu for options
- Slider for polling interval
- Switch for toggles
- Dialog for confirmations

### Zustand (State)
- Single store for all state
- subscribeWithSelector for granular updates
- Middleware for persistence
- Typed selectors for performance