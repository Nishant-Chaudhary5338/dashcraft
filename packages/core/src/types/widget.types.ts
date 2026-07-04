// ============================================================
// Widget Types
// ============================================================

import type { Position, Size } from "./position.types";
import type { WidgetSettings } from "./settings.types";

/**
 * Branded string type for type-safe widget identifiers.
 *
 * A plain `string` is intersected with a unique, uninstantiable brand so
 * that a bare string cannot be assigned where a `WidgetId` is expected —
 * callers must go through {@link createWidgetId}. This prevents mixing up
 * widget IDs with other string identifiers (e.g. dashboard IDs) at the type
 * level, even though both compile to plain strings at runtime.
 *
 * @see createWidgetId
 * @see DashboardId
 */
export type WidgetId = string & { readonly __brand: unique symbol };

/**
 * Brands a plain string as a {@link WidgetId}.
 *
 * This is a zero-cost type assertion — the returned value is referentially
 * identical to the input at runtime. Use it at the boundary where a raw
 * widget ID string enters the system (e.g. from props or a schema) so the
 * rest of the codebase can rely on the branded type.
 *
 * @param id - The raw string identifier to brand.
 * @returns The same string, typed as `WidgetId`.
 * @example
 * ```ts
 * const id = createWidgetId("revenue-chart-1");
 * ```
 */
export const createWidgetId = (id: string): WidgetId => id as WidgetId;

/**
 * Complete internal state of a single widget, as stored in the dashboard
 * store.
 *
 * This is the "source of truth" record the store keeps per widget; it is
 * distinct from {@link WidgetConfig}, which is the developer-facing props
 * shape used to *declare* a widget. `WidgetState` is what you read back via
 * {@link DashboardContextValue.getWidgetState} or the `widgets` map.
 *
 * @example
 * ```ts
 * const state: WidgetState = {
 *   id: createWidgetId("kpi-1"),
 *   position: { x: 0, y: 0 },
 *   size: { width: 240, height: 160 },
 *   zIndex: 1,
 *   settings: { theme: "dark" },
 *   type: "kpi",
 *   title: "Active Users",
 *   isMinimized: false,
 * };
 * ```
 * @see WidgetConfig
 * @see DashboardContextValue
 */
export interface WidgetState {
  /** Unique widget identifier (branded). */
  readonly id: WidgetId;
  /** Current position on the canvas. */
  readonly position: Position;
  /** Current dimensions. */
  readonly size: Size;
  /** Stacking order for layering; a higher value renders on top of lower ones. */
  readonly zIndex: number;
  /** Widget-specific settings (theme, endpoint, polling, etc.). */
  readonly settings: WidgetSettings;
  /** Widget type identifier (e.g. "bar", "line", "kpi", "custom"); free-form, not a closed union. */
  readonly type: string;
  /** Optional display title shown in the widget chrome. */
  readonly title?: string;
  /** Whether the widget is currently collapsed to its title bar. */
  readonly isMinimized: boolean;
}

/**
 * Configuration used to register a widget with the dashboard store.
 *
 * This is the subset of options `DashboardCard` (or any widget host)
 * forwards to the store on mount to create the widget's initial
 * {@link WidgetState}. {@link WidgetConfig} extends this with UI-only
 * concerns (children, styling, callbacks) that never enter the store.
 *
 * @see WidgetConfig
 * @see WidgetState
 */
export interface WidgetRegistrationConfig {
  /** Unique widget identifier, as a plain string (branded to {@link WidgetId} internally). */
  readonly id: string;
  /** Widget type identifier (e.g. "bar", "line", "kpi", "custom"). */
  readonly type?: string;
  /** Display title shown in the widget chrome. */
  readonly title?: string;
  /** Whether the widget can be dragged by the user. */
  readonly drag?: boolean;
  /** Whether the widget can be resized by the user. */
  readonly resize?: boolean;
  /** Whether the widget can be removed by the user. */
  readonly delete?: boolean;
  /** Whether to show the built-in settings panel toggle. */
  readonly settings?: boolean;
  /** Size applied when the widget is first created (before any user resize). */
  readonly defaultSize?: Size;
  /** Position applied when the widget is first created (before any user drag). */
  readonly defaultPosition?: Position;
}

/**
 * Developer-facing props for configuring a `DashboardCard` widget.
 *
 * Extends {@link WidgetRegistrationConfig} (the data that gets persisted in
 * the store) with UI-only props — content, styling, and event callbacks —
 * that are consumed directly by the component and never stored as
 * {@link WidgetState}.
 *
 * @example
 * ```tsx
 * const config: WidgetConfig = {
 *   id: "revenue-chart",
 *   type: "line",
 *   title: "Monthly Revenue",
 *   drag: true,
 *   resize: true,
 *   defaultSize: { width: 400, height: 260 },
 *   onDelete: () => console.log("removed"),
 * };
 * ```
 * @see WidgetRegistrationConfig
 * @see WidgetState
 * @see DashboardConfig
 */
export interface WidgetConfig extends WidgetRegistrationConfig {
  /** Custom settings panel content; `true` shows the default panel, `false`/omitted hides it. */
  readonly settingsPanel?: import("react").ReactNode | boolean;
  /** Whether to show the view cycler button for switching between {@link import("./breakpoint.types").ViewBreakpoints}. */
  readonly viewCycler?: boolean;
  /** Responsive view breakpoints; each key maps a min-width (or "initial") to alternate content. */
  readonly viewBreakpoints?: import("./breakpoint.types").ViewBreakpoints;
  /** Additional CSS class applied to the widget's root element. */
  readonly className?: string;
  /** Additional inline styles applied to the widget's root element. */
  readonly style?: import("react").CSSProperties;
  /** Widget body content. */
  readonly children?: import("react").ReactNode;
  /** Invoked whenever this widget's settings are updated (e.g. via the settings panel). */
  readonly onSettingsChange?: (settings: WidgetSettings) => void;
  /** Invoked when the widget is removed from the dashboard. */
  readonly onDelete?: () => void;
  /** Invoked when a drag gesture ends, with the widget's new position. */
  readonly onDragEnd?: (position: Position) => void;
}
