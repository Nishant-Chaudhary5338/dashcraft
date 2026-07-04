// ============================================================
// Dashboard Types
// ============================================================

import type { ReactNode, CSSProperties } from "react";
import type { WidgetState, WidgetConfig } from "./widget.types";
import type { Position } from "./position.types";
import type { WidgetSettings } from "./settings.types";

/**
 * Branded type for type-safe dashboard identifiers.
 *
 * Same branding technique as {@link WidgetId}: a plain string is tagged with
 * a unique brand so it cannot be confused with a `WidgetId` or any other
 * bare string. Create one via {@link createDashboardId}.
 *
 * @see createDashboardId
 * @see WidgetId
 */
export type DashboardId = string & { readonly __brand: unique symbol };

/**
 * Brands a plain string as a {@link DashboardId}.
 *
 * @param id - The raw string identifier to brand.
 * @returns The same string, typed as `DashboardId`.
 * @example
 * ```ts
 * const id = createDashboardId("sales-overview");
 * ```
 */
export const createDashboardId = (id: string): DashboardId => id as DashboardId;

/**
 * Developer-facing props for configuring the top-level `Dashboard`
 * component.
 *
 * Governs layout persistence, edit-mode defaults, and the change callbacks
 * a consumer app hooks into to sync dashboard state elsewhere (e.g. a
 * backend). `children` are the widgets rendered inside the dashboard grid.
 *
 * @example
 * ```tsx
 * const config: DashboardConfig = {
 *   persistenceKey: "user-42-dashboard",
 *   storage: "localStorage",
 *   autoSave: true,
 *   defaultEditMode: false,
 * };
 * ```
 * @see DashboardContextValue
 * @see WidgetConfig
 */
export interface DashboardConfig {
  /** Storage key used to persist the layout. Persistence is disabled entirely when omitted. */
  readonly persistenceKey?: string;
  /** Browser storage backend used for persistence. */
  readonly storage?: "localStorage" | "sessionStorage";
  /** Whether to automatically save the layout whenever it changes. */
  readonly autoSave?: boolean;
  /** Debounce delay, in milliseconds, before an auto-save write is committed. */
  readonly autoSaveDelay?: number;
  /** Whether the dashboard starts in edit mode (drag/resize/delete enabled). */
  readonly defaultEditMode?: boolean;
  /** Invoked whenever the widget layout changes, with the full widget-id-to-state map. */
  readonly onLayoutChange?: (layout: Record<string, WidgetState>) => void;
  /** Invoked whenever edit mode is toggled, with the new edit-mode value. */
  readonly onEditModeChange?: (isEditMode: boolean) => void;
  /** Additional CSS class applied to the dashboard's root element. */
  readonly className?: string;
  /** Additional inline styles applied to the dashboard's root element. */
  readonly style?: CSSProperties;
  /** Dashboard content — typically one or more `DashboardCard` widgets. */
  readonly children?: ReactNode;
}

/**
 * The dashboard's public runtime API, provided via React context to every
 * descendant.
 *
 * This is what `DashboardCard` and other child components call to read and
 * mutate dashboard state — registering/removing widgets, moving/resizing
 * them, and controlling edit mode and persistence. Obtain it via the
 * `useDashboard` hook inside a `Dashboard` tree.
 *
 * @see DashboardConfig
 * @see WidgetState
 * @see WidgetConfig
 */
export interface DashboardContextValue {
  /** Whether the dashboard is currently in edit mode. */
  readonly isEditMode: boolean;
  /** Map of widget ID to its current {@link WidgetState}. */
  readonly widgets: Readonly<Record<string, WidgetState>>;
  /** Toggles edit mode between on and off. */
  readonly toggleEditMode: () => void;
  /** Sets edit mode to an explicit value. */
  readonly setEditMode: (isEditMode: boolean) => void;
  /** Persists the current layout to storage immediately. */
  readonly saveLayout: () => void;
  /** Loads a previously persisted layout from storage, replacing current state. */
  readonly loadLayout: () => void;
  /** Resets the layout to its default (pre-persistence) state. */
  readonly resetLayout: () => void;
  /** Adds a new widget to the dashboard using the given config. */
  readonly addWidget: (config: WidgetConfig) => void;
  /** Removes the widget with the given id from the dashboard. */
  readonly removeWidget: (id: string) => void;
  /** Updates a widget's position (e.g. after a drag). */
  readonly updateWidgetPosition: (id: string, position: Position) => void;
  /** Updates a widget's size (e.g. after a resize). */
  readonly updateWidgetSize: (id: string, size: import("./position.types").Size) => void;
  /** Merges the given partial settings into a widget's existing settings. */
  readonly updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void;
  /** Raises a widget's z-index above all others so it renders on top. */
  readonly bringToFront: (id: string) => void;
  /** Registers a widget's initial config with the dashboard, creating its {@link WidgetState}. */
  readonly registerWidget: (id: string, config: WidgetConfig) => void;
  /** Removes a widget's registration and state from the dashboard (e.g. on unmount). */
  readonly unregisterWidget: (id: string) => void;
  /** Returns the current state of a widget, or `undefined` if no widget with that id is registered. */
  readonly getWidgetState: (id: string) => WidgetState | undefined;
}