// ============================================================
// DashCraft Type System - Central Exports
// ============================================================

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