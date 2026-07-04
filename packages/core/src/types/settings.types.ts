// ============================================================
// Widget Settings Types
// ============================================================

/**
 * Visual theme applied to a widget.
 *
 * - `"light"` — light background chrome.
 * - `"dark"` — dark background chrome.
 * - `"custom"` — chrome styling is left to the caller via `className`/`style`
 *   or CSS custom properties; DashCraft applies no built-in theme colors.
 *
 * @see WidgetSettings
 * @see DashboardSchemaSettings
 */
export type WidgetTheme = "light" | "dark" | "custom";

/**
 * Per-widget configuration controlling appearance, behavior, and data
 * fetching.
 *
 * This is the shape persisted on {@link WidgetState.settings} and read back
 * via {@link DashboardContextValue.updateWidgetSettings}. It doubles as the
 * config surface consumed by the built-in `useWidgetData` HTTP hook
 * (endpoint/method/headers/body/pollingInterval/cache*), so a widget's data
 * source can be described entirely through settings rather than custom code.
 * The index signature allows consumers to attach arbitrary custom keys
 * beyond the known ones (paired with {@link CustomFieldConfig} to render UI
 * for them).
 *
 * @example
 * ```ts
 * const settings: WidgetSettings = {
 *   theme: "dark",
 *   endpoint: "/api/metrics/active-users",
 *   method: "GET",
 *   pollingInterval: 30_000,
 *   cacheEnabled: true,
 *   cacheDuration: 60_000,
 * };
 * ```
 * @see WidgetTheme
 * @see CustomFieldConfig
 * @see WidgetState
 */
export interface WidgetSettings {
  /** Visual theme. */
  readonly theme?: WidgetTheme;
  /** Data polling interval in milliseconds; `0` (or omitted) disables polling. */
  readonly pollingInterval?: number;
  /** API endpoint used for data fetching. */
  readonly endpoint?: string;
  /** HTTP method used when fetching from `endpoint`. */
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Custom headers sent with each API request. */
  readonly headers?: Record<string, string>;
  /** Request body sent with POST/PUT/PATCH requests. */
  readonly body?: Record<string, unknown>;
  /** Whether to render a highlighted border around the widget. */
  readonly highlight?: boolean;
  /** Highlight border color, as a hex string (e.g. `"#22c55e"`). */
  readonly highlightColor?: string;
  /** Custom field configurations used to dynamically render additional settings UI. */
  readonly customFields?: Record<string, CustomFieldConfig>;
  /** Widget opacity, from 0 (fully transparent) to 1 (fully opaque). Defaults to 1 where consumed. */
  readonly opacity?: number;
  /** HTTP request timeout in milliseconds. */
  readonly requestTimeout?: number;
  /** Whether to re-fetch data automatically when the browser window regains focus. */
  readonly refreshOnFocus?: boolean;
  /** Whether API responses should be cached. */
  readonly cacheEnabled?: boolean;
  /** Cache time-to-live in milliseconds; only meaningful when `cacheEnabled` is `true`. */
  readonly cacheDuration?: number;
  /** Free-form developer notes about this widget; not used by DashCraft itself. */
  readonly description?: string;
  /** Escape hatch allowing any additional custom setting keys beyond the ones declared above. */
  readonly [key: string]: unknown;
}

/**
 * Declarative description of one custom settings field, used to
 * auto-generate a settings-panel control without writing bespoke UI.
 *
 * Pair an entry in {@link WidgetSettings.customFields} (keyed by field name)
 * with a `CustomFieldConfig` describing how that field should be edited.
 *
 * @example
 * ```ts
 * const field: CustomFieldConfig = {
 *   type: "slider",
 *   label: "Refresh Rate (s)",
 *   default: 30,
 *   min: 5,
 *   max: 300,
 *   step: 5,
 * };
 * ```
 * @see WidgetSettings
 */
export interface CustomFieldConfig {
  /** Input control rendered for this field. */
  readonly type: "text" | "number" | "boolean" | "select" | "color" | "slider";
  /** Human-readable label shown next to the control. */
  readonly label: string;
  /** Initial value applied before the user changes it. */
  readonly default?: unknown;
  /** Selectable options; only meaningful when `type` is `"select"`. */
  readonly options?: readonly string[];
  /** Minimum allowed value; only meaningful when `type` is `"number"` or `"slider"`. */
  readonly min?: number;
  /** Maximum allowed value; only meaningful when `type` is `"number"` or `"slider"`. */
  readonly max?: number;
  /** Increment step; only meaningful when `type` is `"number"` or `"slider"`. */
  readonly step?: number;
}
