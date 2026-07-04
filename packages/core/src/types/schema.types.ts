// ============================================================
// Agentic AI Schema Types
// ============================================================

import type { WidgetTheme } from "./settings.types";

/**
 * Plain JSON-serializable description of an entire dashboard, designed for
 * AI agents and config-driven generation.
 *
 * Unlike {@link DashboardConfig}/{@link WidgetConfig} (which carry React
 * nodes, callbacks, and other non-serializable values), every field here is
 * plain JSON — safe to store, transmit, or have an LLM generate directly.
 * A {@link DashboardFactory} turns a `DashboardSchema` into either JSON text
 * or generated JSX source.
 *
 * @example
 * ```ts
 * const schema: DashboardSchema = {
 *   title: "Sales Overview",
 *   layout: "grid",
 *   columns: 3,
 *   gap: 16,
 *   widgets: [
 *     { id: "revenue", type: "line", title: "Revenue", colSpan: 2 },
 *     { id: "orders", type: "kpi", title: "Orders" },
 *   ],
 *   settings: { theme: "dark" },
 * };
 * ```
 * @see WidgetSchema
 * @see DashboardFactory
 * @see DashboardConfig
 */
export interface DashboardSchema {
  /** Optional dashboard identifier. */
  readonly id?: string;
  /** Dashboard title. */
  readonly title?: string;
  /** Layout algorithm used to arrange widgets. */
  readonly layout?: "grid" | "flex" | "free";
  /** Number of columns; only meaningful when `layout` is `"grid"`. */
  readonly columns?: number;
  /** Gap between widgets, in pixels. */
  readonly gap?: number;
  /** Ordered list of widgets making up the dashboard. */
  readonly widgets: readonly WidgetSchema[];
  /** Dashboard-level settings (theme, persistence, edit mode). */
  readonly settings?: DashboardSchemaSettings;
}

/**
 * Dashboard-level settings expressed in JSON-serializable schema format.
 *
 * The schema-format counterpart of the persistence/theme-related fields on
 * {@link DashboardConfig}.
 *
 * @see DashboardSchema
 * @see DashboardConfig
 */
export interface DashboardSchemaSettings {
  /** Visual theme. */
  readonly theme?: WidgetTheme;
  /** Storage key used for layout persistence. */
  readonly persistenceKey?: string;
  /** Whether the dashboard starts in edit mode. */
  readonly defaultEditMode?: boolean;
}

/**
 * JSON-serializable description of a single widget within a
 * {@link DashboardSchema}.
 *
 * Maps conceptually to {@link WidgetConfig}/{@link WidgetRegistrationConfig}
 * but restricted to plain, serializable values (no callbacks or React
 * nodes) so it can be authored or generated as JSON.
 *
 * @example
 * ```ts
 * const widget: WidgetSchema = {
 *   id: "active-users",
 *   type: "kpi",
 *   title: "Active Users",
 *   size: { width: 240, height: 160 },
 *   dataSource: { endpoint: "/api/active-users", pollingInterval: 30_000 },
 * };
 * ```
 * @see DashboardSchema
 * @see WidgetConfig
 * @see WidgetSettingsSchema
 * @see DataSourceSchema
 */
export interface WidgetSchema {
  /** Unique widget identifier. */
  readonly id: string;
  /** Widget visualization type. */
  readonly type: "bar" | "line" | "area" | "pie" | "kpi" | "table" | "custom";
  /** Display title. */
  readonly title?: string;
  /** Number of grid columns this widget spans; only meaningful in `"grid"` layouts. */
  readonly colSpan?: number;
  /** Number of grid rows this widget spans; only meaningful in `"grid"` layouts. */
  readonly rowSpan?: number;
  /** Explicit grid cell position; only meaningful in `"grid"` layouts. */
  readonly gridPosition?: { col: number; row: number };
  /** Explicit pixel size; used in `"free"`/`"flex"` layouts or as an override. */
  readonly size?: { width: number; height: number };
  /** Whether the widget can be dragged once the dashboard is generated. */
  readonly drag?: boolean;
  /** Whether the widget can be resized once the dashboard is generated. */
  readonly resize?: boolean;
  /** Whether the widget can be deleted once the dashboard is generated. */
  readonly delete?: boolean;
  /** Widget-specific settings in schema format. */
  readonly settings?: WidgetSettingsSchema;
  /** Data source configuration describing how this widget fetches its data. */
  readonly dataSource?: DataSourceSchema;
  /** Responsive breakpoints mapping a min-width to a named view variant. */
  readonly viewBreakpoints?: Record<number, string>;
}

/**
 * Widget settings expressed in JSON-serializable schema format.
 *
 * A restricted counterpart of {@link WidgetSettings}: the fields Al agents
 * are expected to set directly, plus an index signature for anything
 * else. Unlike `WidgetSettings`, this omits function-valued or otherwise
 * non-serializable fields.
 *
 * @see WidgetSettings
 * @see WidgetSchema
 */
export interface WidgetSettingsSchema {
  /** Visual theme. */
  readonly theme?: WidgetTheme;
  /** Whether to render a highlighted border around the widget. */
  readonly highlight?: boolean;
  /** Highlight border color, as a hex string. */
  readonly highlightColor?: string;
  /** Data polling interval in milliseconds. */
  readonly pollingInterval?: number;
  /** Escape hatch allowing any additional custom setting keys. */
  readonly [key: string]: unknown;
}

/**
 * Data source configuration expressed in JSON-serializable schema format.
 *
 * The schema-format counterpart of {@link HttpClientConfig}, restricted to
 * `GET`/`POST` and a string-encoded `transform` (since function values
 * cannot be serialized to JSON).
 *
 * @see WidgetSchema
 * @see HttpClientConfig
 */
export interface DataSourceSchema {
  /** API endpoint URL to fetch from. */
  readonly endpoint: string;
  /** HTTP method used for the request. */
  readonly method?: "GET" | "POST";
  /** Custom headers sent with the request. */
  readonly headers?: Record<string, string>;
  /** Request body sent with `POST` requests. */
  readonly body?: Record<string, unknown>;
  /** Data transform expressed as a string of source code (e.g. a serialized function body), evaluated by the consumer. */
  readonly transform?: string;
  /** Automatic re-fetch interval in milliseconds. */
  readonly pollingInterval?: number;
}

/**
 * Named preset templates for quickly scaffolding a common dashboard shape.
 *
 * - `"analytics"` — general metrics/charts layout.
 * - `"monitoring"` — real-time system/health monitoring layout.
 * - `"sales"` — revenue and pipeline-focused layout.
 * - `"executive"` — high-level KPI summary layout.
 * - `"blank"` — empty dashboard with no preset widgets.
 *
 * @see DashboardFactory
 */
export type DashboardTemplate =
  | "analytics"
  | "monitoring"
  | "sales"
  | "executive"
  | "blank";

/**
 * Fluent builder returned when programmatically constructing a dashboard
 * from a {@link DashboardSchema} (e.g. by an AI agent assembling a
 * dashboard step by step).
 *
 * Mutating methods (`addWidget`, `removeWidget`, `setTheme`) return the
 * `DashboardFactory` itself so calls can be chained; `toJSON`/`toJSX`
 * serialize the accumulated schema to a final output format.
 *
 * @example
 * ```ts
 * const output = factory
 *   .addWidget({ id: "kpi-1", type: "kpi", title: "Signups" })
 *   .setTheme("dark")
 *   .toJSON();
 * ```
 * @see DashboardSchema
 * @see DashboardTemplate
 */
export interface DashboardFactory {
  /** The schema accumulated so far. */
  readonly schema: DashboardSchema;
  /** Serializes the current schema to a JSON string. */
  readonly toJSON: () => string;
  /** Adds a widget to the schema, returning the factory for chaining. */
  readonly addWidget: (widget: WidgetSchema) => DashboardFactory;
  /** Removes the widget with the given id from the schema, returning the factory for chaining. */
  readonly removeWidget: (id: string) => DashboardFactory;
  /** Sets the dashboard-level theme, returning the factory for chaining. */
  readonly setTheme: (theme: WidgetTheme) => DashboardFactory;
  /** Generates JSX source code that renders the accumulated dashboard using DashCraft components. */
  readonly toJSX: () => string;
}