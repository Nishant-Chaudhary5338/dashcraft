// ============================================================
// Dashboard Types
// ============================================================

import type { ReactNode, CSSProperties } from "react";
import type { WidgetState, WidgetConfig } from "./widget.types";
import type { Position } from "./position.types";
import type { WidgetSettings } from "./settings.types";

/**
 * Branded type for type-safe dashboard IDs.
 */
export type DashboardId = string & { readonly __brand: unique symbol };

/**
 * Creates a branded DashboardId from a plain string.
 * @param id - The string ID to brand
 * @returns A branded DashboardId
 */
export const createDashboardId = (id: string): DashboardId => id as DashboardId;

/**
 * Developer-facing props for configuring a Dashboard.
 */
export interface DashboardConfig {
  /** Key for persisting layout to storage */
  readonly persistenceKey?: string;
  /** Storage type for persistence */
  readonly storage?: "localStorage" | "sessionStorage";
  /** Whether to auto-save on changes */
  readonly autoSave?: boolean;
  /** Debounce delay for auto-save in milliseconds */
  readonly autoSaveDelay?: number;
  /** Initial edit mode state */
  readonly defaultEditMode?: boolean;
  /** Callback when layout changes */
  readonly onLayoutChange?: (layout: Record<string, WidgetState>) => void;
  /** Callback when edit mode changes */
  readonly onEditModeChange?: (isEditMode: boolean) => void;
  /** Additional CSS class */
  readonly className?: string;
  /** Additional inline styles */
  readonly style?: CSSProperties;
  /** Dashboard content (widgets) */
  readonly children?: ReactNode;
}

/**
 * Dashboard context value provided to child components.
 * This is the API that DashboardCard and other components use.
 */
export interface DashboardContextValue {
  /** Whether the dashboard is in edit mode */
  readonly isEditMode: boolean;
  /** Map of widget ID to widget state */
  readonly widgets: Readonly<Record<string, WidgetState>>;
  /** Toggle edit mode on/off */
  readonly toggleEditMode: () => void;
  /** Set edit mode to a specific value */
  readonly setEditMode: (isEditMode: boolean) => void;
  /** Save current layout to storage */
  readonly saveLayout: () => void;
  /** Load layout from storage */
  readonly loadLayout: () => void;
  /** Reset layout to defaults */
  readonly resetLayout: () => void;
  /** Add a new widget to the dashboard */
  readonly addWidget: (config: WidgetConfig) => void;
  /** Remove a widget from the dashboard */
  readonly removeWidget: (id: string) => void;
  /** Update a widget's position */
  readonly updateWidgetPosition: (id: string, position: Position) => void;
  /** Update a widget's size */
  readonly updateWidgetSize: (id: string, size: import("./position.types").Size) => void;
  /** Update a widget's settings */
  readonly updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void;
  /** Bring a widget to the front (highest z-index) */
  readonly bringToFront: (id: string) => void;
  /** Register a widget with the dashboard */
  readonly registerWidget: (id: string, config: WidgetConfig) => void;
  /** Unregister a widget from the dashboard */
  readonly unregisterWidget: (id: string) => void;
  /** Get the current state of a widget */
  readonly getWidgetState: (id: string) => WidgetState | undefined;
}