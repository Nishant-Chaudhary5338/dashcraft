// ============================================================
// HTTP Client Types
// ============================================================

/**
 * Configuration for the `useWidgetData` HTTP client hook.
 *
 * Describes what to fetch, how, and on what cadence. Mirrors the
 * data-fetching-related fields on {@link WidgetSettings} (`endpoint`,
 * `method`, `headers`, `body`, `pollingInterval`) so a widget's settings can
 * be passed straight through to the hook.
 *
 * @see HttpClientState
 * @see HttpClientReturn
 */
export interface HttpClientConfig {
  /** API endpoint URL to fetch from. */
  readonly endpoint: string;
  /** HTTP method used for the request. Defaults to `"GET"`. */
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Custom headers sent with the request. */
  readonly headers?: Record<string, string>;
  /** Request body, serialized for `POST`/`PUT`/`PATCH` requests. */
  readonly body?: Record<string, unknown>;
  /** Automatic re-fetch interval in milliseconds; `0` (or omitted) disables polling. */
  readonly pollingInterval?: number;
  /** Whether the hook should fetch at all; set `false` to pause fetching without unmounting. */
  readonly enabled?: boolean;
}

/**
 * Current state of an HTTP request managed by `useWidgetData`.
 *
 * Generic over the expected response shape `TData`. All fields reflect the
 * most recent request lifecycle: `loading` is `true` while in flight,
 * `error` is populated on failure, and `data`/`lastFetched` are only updated
 * on success.
 *
 * @see HttpClientReturn
 * @see HttpClientConfig
 */
export interface HttpClientState<TData = unknown> {
  /** Most recently fetched data, or `null` before the first successful fetch. */
  readonly data: TData | null;
  /** Whether a request is currently in progress. */
  readonly loading: boolean;
  /** Error from the most recent failed request, or `null` if the last request succeeded. */
  readonly error: Error | null;
  /** Timestamp of the most recent successful fetch, or `null` if none has occurred yet. */
  readonly lastFetched: Date | null;
}

/**
 * Full return value of the `useWidgetData` hook.
 *
 * Extends {@link HttpClientState} with imperative actions for controlling
 * the request lifecycle from widget code (e.g. a manual refresh button).
 *
 * @example
 * ```ts
 * const { data, loading, error, refetch, cancel } = useWidgetData<Metrics>({
 *   endpoint: "/api/metrics",
 *   pollingInterval: 15_000,
 * });
 * ```
 * @see HttpClientState
 * @see HttpClientConfig
 */
export interface HttpClientReturn<TData = unknown> extends HttpClientState<TData> {
  /** Manually triggers an immediate re-fetch, resolving once it completes. */
  readonly refetch: () => Promise<void>;
  /** Cancels any in-flight request and stops polling. */
  readonly cancel: () => void;
}
