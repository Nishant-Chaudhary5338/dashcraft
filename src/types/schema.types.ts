// ============================================================
// Agentic AI Schema Types
// ============================================================

import type { WidgetTheme } from "./settings.types";

/**
 * JSON-serializable dashboard schema for AI agents.
 * Use this to define dashboards declaratively via JSON/config objects.
 */
export interface DashboardSchema {
  /** Optional dashboard ID */
  readonly id?: string;
  /** Dashboard title */
  readonly title?: string;
  /** Layout mode */
  readonly layout?: "grid" | "flex" | "free";
  /** Number of grid columns */
  readonly columns?: number;
  /** Gap between widgets in pixels */
  readonly gap?: number;
  /** List of widget schemas */
  readonly widgets: readonly WidgetSchema[];
  /** Dashboard-level settings */
  readonly settings?: DashboardSchemaSettings;
}

/**
 * Dashboard-level settings in schema format.
 */
export interface DashboardSchemaSettings {
  /** Visual theme */
  readonly theme?: WidgetTheme;
  /** Persistence key */
  readonly persistenceKey?: string;
  /** Default edit mode */
  readonly defaultEditMode?: boolean;
}

/**
 * JSON-serializable widget schema for AI agents.
 * Maps directly to WidgetConfig but with serializable types.
 */
export interface WidgetSchema {
  /** Unique widget identifier */
  readonly id: string;
  /** Widget type */
  readonly type: "bar" | "line" | "area" | "pie" | "kpi" | "table" | "custom";
  /** Display title */
  readonly title?: string;
  /** Number of grid columns to span */
  readonly colSpan?: number;
  /** Number of grid rows to span */
  readonly rowSpan?: number;
  /** Grid position */
  readonly gridPosition?: { col: number; row: number };
  /** Widget size */
  readonly size?: { width: number; height: number };
  /** Whether widget is draggable */
  readonly draggable?: boolean;
  /** Whether widget is deletable */
  readonly deletable?: boolean;
  /** Widget settings */
  readonly settings?: WidgetSettingsSchema;
  /** Data source configuration */
  readonly dataSource?: DataSourceSchema;
  /** View breakpoints */
  readonly viewBreakpoints?: Record<number, string>;
}

/**
 * Widget settings in schema format.
 */
export interface WidgetSettingsSchema {
  /** Visual theme */
  readonly theme?: WidgetTheme;
  /** Whether to show highlight */
  readonly highlight?: boolean;
  /** Highlight color */
  readonly highlightColor?: string;
  /** Polling interval */
  readonly pollingInterval?: number;
  /** Allow additional settings */
  readonly [key: string]: unknown;
}

/**
 * Data source configuration in schema format.
 */
export interface DataSourceSchema {
  /** API endpoint URL */
  readonly endpoint: string;
  /** HTTP method */
  readonly method?: "GET" | "POST";
  /** Request headers */
  readonly headers?: Record<string, string>;
  /** Request body */
  readonly body?: Record<string, unknown>;
  /** Data transform function (as string) */
  readonly transform?: string;
  /** Polling interval in milliseconds */
  readonly pollingInterval?: number;
}

/**
 * Preset templates for quick dashboard generation.
 */
export type DashboardTemplate =
  | "analytics"
  | "monitoring"
  | "sales"
  | "executive"
  | "blank";

/**
 * Factory function return type for AI-generated dashboards.
 */
export interface DashboardFactory {
  /** The generated schema */
  readonly schema: DashboardSchema;
  /** Serialize schema to JSON */
  readonly toJSON: () => string;
  /** Add a widget to the schema */
  readonly addWidget: (widget: WidgetSchema) => DashboardFactory;
  /** Remove a widget from the schema */
  readonly removeWidget: (id: string) => DashboardFactory;
  /** Set the dashboard theme */
  readonly setTheme: (theme: WidgetTheme) => DashboardFactory;
  /** Generate JSX code for the dashboard */
  readonly toJSX: () => string;
}