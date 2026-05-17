// ============================================================
// Widget Types
// ============================================================

import type { Position, Size } from "./position.types";
import type { WidgetSettings } from "./settings.types";

/**
 * Branded type for type-safe widget IDs.
 * Prevents accidental string assignment where WidgetId is expected.
 */
export type WidgetId = string & { readonly __brand: unique symbol };

/**
 * Creates a branded WidgetId from a plain string.
 * @param id - The string ID to brand
 * @returns A branded WidgetId
 */
export const createWidgetId = (id: string): WidgetId => id as WidgetId;

/**
 * Internal widget state stored in the dashboard store.
 * This represents the complete state of a single widget.
 */
export interface WidgetState {
  /** Unique widget identifier (branded) */
  readonly id: WidgetId;
  /** Current position on the canvas */
  readonly position: Position;
  /** Current dimensions */
  readonly size: Size;
  /** Z-index for layering (higher = on top) */
  readonly zIndex: number;
  /** Widget-specific settings (theme, endpoint, polling, etc.) */
  readonly settings: WidgetSettings;
  /** Widget type identifier (e.g., "bar", "line", "kpi", "custom") */
  readonly type: string;
  /** Optional display title */
  readonly title?: string;
  /** Whether the widget is minimized */
  readonly isMinimized: boolean;
}

/**
 * Configuration for registering a widget with the dashboard.
 * Used by DashboardCard to register itself on mount.
 */
export interface WidgetRegistrationConfig {
  /** Unique widget identifier */
  readonly id: string;
  /** Widget type identifier */
  readonly type?: string;
  /** Display title */
  readonly title?: string;
  /** Whether the widget can be dragged */
  readonly draggable?: boolean;
  /** Whether the widget can be deleted */
  readonly deletable?: boolean;
  /** Whether to show settings panel */
  readonly settings?: boolean;
  /** Default size when created */
  readonly defaultSize?: Size;
  /** Default position when created */
  readonly defaultPosition?: Position;
}

/**
 * Developer-facing props for configuring a DashboardCard.
 * Extends WidgetRegistrationConfig with UI-specific options.
 */
export interface WidgetConfig extends WidgetRegistrationConfig {
  /** Custom settings panel content */
  readonly settingsPanel?: import("react").ReactNode | boolean;
  /** Whether to show view cycler button */
  readonly viewCycler?: boolean;
  /** Responsive view breakpoints */
  readonly viewBreakpoints?: import("./breakpoint.types").ViewBreakpoints;
  /** Additional CSS class */
  readonly className?: string;
  /** Additional inline styles */
  readonly style?: import("react").CSSProperties;
  /** Widget content */
  readonly children?: import("react").ReactNode;
  /** Callback when settings change */
  readonly onSettingsChange?: (settings: WidgetSettings) => void;
  /** Callback when widget is deleted */
  readonly onDelete?: () => void;
  /** Callback when drag ends */
  readonly onDragEnd?: (position: Position) => void;
}