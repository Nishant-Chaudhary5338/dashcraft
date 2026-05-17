// ============================================================
// DashCraft — Main Entry Point
// ============================================================

// Components
export { Dashboard } from "./components/Dashboard";
export type { DashboardProps } from "./components/Dashboard";
export { DashboardContext, useDashboardContext } from "./components/Dashboard";

export { DashboardCard, DashboardCardHeader, WidgetActions, WidgetActionButton, DragHandleButton } from "./components/DashboardCard";
export type { DashboardCardProps, DashboardCardHeaderProps, WidgetActionsProps, WidgetActionButtonProps, DragHandleButtonProps, ActionButtonPosition } from "./components/DashboardCard";

// Settings Components
export {
  SettingsPanel,
  SettingsHighlightSection,
  SettingsEndpointSection,
  SettingsPollingSection,
  SettingsThemeSection,
  SettingsCustomFields,
} from "./components/Settings";

// Hooks
export {
  useDashboard,
  useDraggable,
  useResize,
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
  useWidgetEvents,
  useWidgetEventsGlobal,
  getWidgetEventBus,
  usePersistence,
  usePersistedState,
} from "./hooks";
export type {
  UseDraggableOptions,
  UseDraggableReturn,
  ResizeHandle,
  ResizeDelta,
  ResizeEvent,
  UseResizeOptions,
  UseResizeReturn,
  ResizeHandleProps,
  ResizeContainerProps,
  WidgetEvent,
  WidgetEventPayload,
  WidgetEventListener,
  UsePersistenceOptions,
  UsePersistenceReturn,
} from "./hooks";

// Store
export {
  useDashboardStore,
  selectIsEditMode,
  selectWidgets,
  selectWidgetById,
  selectWidgetCount,
} from "./store";
export type { DashboardStoreState } from "./store";

// Types
export type {
  WidgetId,
  DashboardId,
  Position,
  Size,
  WidgetTheme,
  WidgetSettings,
  CustomFieldConfig,
  ViewBreakpoint,
  ViewBreakpoints,
  WidgetState,
  WidgetConfig,
  DashboardConfig,
  DashboardContextValue,
  HttpClientConfig,
  HttpClientState,
  HttpClientReturn,
  PersistenceAdapter,
  PersistenceConfig,
  AnimationPreset,
  AnimationConfig,
  ResponsiveConfig,
  ResponsiveReturn,
  DeepReadonly,
  Nullable,
  Optional,
  DashboardSchema,
  DashboardSchemaSettings,
  WidgetSchema,
  WidgetSettingsSchema,
  DataSourceSchema,
  DashboardTemplate,
  DashboardFactory,
} from "./types";
export { createWidgetId, createDashboardId } from "./types";

// Utils
export {
  cn,
  createPersistenceAdapter,
  animationPresets,
  getAnimationPreset,
  springToCss,
  getCssTransition,
  DEBUG,
  DEFAULT_WIDGET_SIZE,
  DEFAULT_WIDGET_POSITION,
} from "./utils";
export type { PersistenceAdapter as PersistenceAdapterType } from "./types";
export type { AnimationPresetKey } from "./utils/animations";

// Registry
export {
  widgetRegistry,
  useWidgetRegistration,
  useWidgetRegistrations,
  useWidgetRegistrationsByCategory,
} from "./registry/widgetRegistry";
export type { WidgetRegistration, WidgetComponentProps, WidgetSettingsProps } from "./registry/widgetRegistry";

// Widgets
export { RechartsWidget } from "./widgets/recharts/RechartsWidget";
export type { RechartsWidgetProps, ChartType, DataPoint, SeriesConfig } from "./widgets/recharts/recharts.types";
export { BarChartWidget } from "./widgets/recharts/charts/BarChartWidget";
export { LineChartWidget } from "./widgets/recharts/charts/LineChartWidget";
export { AreaChartWidget } from "./widgets/recharts/charts/AreaChartWidget";
export { PieChartWidget } from "./widgets/recharts/charts/PieChartWidget";
export { ScatterChartWidget } from "./widgets/recharts/charts/ScatterChartWidget";
export { RadarChartWidget } from "./widgets/recharts/charts/RadarChartWidget";
export { RadialBarChartWidget } from "./widgets/recharts/charts/RadialBarChartWidget";
export { NivoWidget } from "./widgets/nivo/NivoWidget";
export type { NivoWidgetProps, NivoChartType, HeatmapRowData, TreemapDataNode, SunburstDataNode, NivoColorScheme } from "./widgets/nivo/nivo.types";
export { HeatMapWidget } from "./widgets/nivo/charts/HeatMapWidget";
export { TreemapWidget } from "./widgets/nivo/charts/TreemapWidget";
export { SunburstWidget } from "./widgets/nivo/charts/SunburstWidget";
export { KPIWidget } from "./widgets/kpi/KPIWidget";
export type { KPIWidgetProps, KPITrend, KPIFormat } from "./widgets/kpi/KPIWidget";
