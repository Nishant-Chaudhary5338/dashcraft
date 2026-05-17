// ============================================================
// Widget Settings Types
// ============================================================

/**
 * Available theme options for widgets.
 */
export type WidgetTheme = "light" | "dark" | "custom";

/**
 * Widget-specific settings stored in the dashboard store.
 * These control widget behavior, appearance, and data fetching.
 */
export interface WidgetSettings {
  /** Visual theme */
  readonly theme?: WidgetTheme;
  /** Data polling interval in milliseconds (0 = disabled) */
  readonly pollingInterval?: number;
  /** API endpoint for data fetching */
  readonly endpoint?: string;
  /** HTTP method for data requests */
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Custom headers for API requests */
  readonly headers?: Record<string, string>;
  /** Request body for POST/PUT/PATCH requests */
  readonly body?: Record<string, unknown>;
  /** Whether to show highlight border */
  readonly highlight?: boolean;
  /** Highlight border color (hex) */
  readonly highlightColor?: string;
  /** Custom field configurations for dynamic settings */
  readonly customFields?: Record<string, CustomFieldConfig>;
  /** Widget opacity (0–1, default 1) */
  readonly opacity?: number;
  /** HTTP request timeout in milliseconds */
  readonly requestTimeout?: number;
  /** Re-fetch data when the browser window regains focus */
  readonly refreshOnFocus?: boolean;
  /** Whether to cache API responses */
  readonly cacheEnabled?: boolean;
  /** Cache TTL in milliseconds */
  readonly cacheDuration?: number;
  /** Developer notes about this widget */
  readonly description?: string;
  /** Allow additional custom settings */
  readonly [key: string]: unknown;
}

/**
 * Configuration for a custom settings field.
 * Used to dynamically generate settings UI.
 */
export interface CustomFieldConfig {
  /** Input type for the field */
  readonly type: "text" | "number" | "boolean" | "select" | "color" | "slider";
  /** Display label */
  readonly label: string;
  /** Default value */
  readonly default?: unknown;
  /** Options for select type */
  readonly options?: readonly string[];
  /** Minimum value for number/slider */
  readonly min?: number;
  /** Maximum value for number/slider */
  readonly max?: number;
  /** Step increment for number/slider */
  readonly step?: number;
}