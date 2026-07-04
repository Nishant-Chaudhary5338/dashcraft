// ============================================================
// DashCraft Type System - Central Exports
// ============================================================

/**
 * This module is the single public entry point for every type and value
 * exported from `@dashcraft/core`'s type system. Each `export *` re-exports
 * the full contents of one modular `*.types.ts` file (grouped by concern —
 * position, widget, settings, breakpoints, HTTP, persistence, animation,
 * dashboard, agentic schema, and generic utilities).
 *
 * The additional named re-exports below the `export *` lines exist purely
 * to make the package's intended public surface explicit and to guard
 * against silent name collisions between modules (TypeScript errors on
 * `export *` ambiguity, so re-exporting explicitly here documents intent
 * even when there is currently no clash).
 */

// Re-export from modular type files
export * from "./position.types";
export * from "./widget.types";
export * from "./settings.types";
export * from "./breakpoint.types";
export * from "./http.types";
export * from "./persistence.types";
export * from "./animation.types";
export * from "./dashboard.types";
export * from "./schema.types";
export * from "./utility.types";

// Re-export specific items to avoid conflicts
export { createWidgetId } from "./widget.types";
export { createDashboardId } from "./dashboard.types";
export type { WidgetId } from "./widget.types";
export type { DashboardId } from "./dashboard.types";
export type { Position, Size } from "./position.types";
export type { WidgetSettings, WidgetTheme, CustomFieldConfig } from "./settings.types";
export type { ViewBreakpoint, ViewBreakpoints } from "./breakpoint.types";
export type { HttpClientConfig, HttpClientState, HttpClientReturn } from "./http.types";
export type { PersistenceAdapter, PersistenceConfig } from "./persistence.types";
export type { AnimationPreset, AnimationConfig } from "./animation.types";
export type { DashboardConfig, DashboardContextValue } from "./dashboard.types";
export type { ResponsiveConfig, ResponsiveReturn } from "./breakpoint.types";
export type { DashboardSchema, DashboardSchemaSettings, WidgetSchema, WidgetSettingsSchema, DataSourceSchema, DashboardTemplate, DashboardFactory } from "./schema.types";
export type { DeepReadonly, Nullable, Optional } from "./utility.types";