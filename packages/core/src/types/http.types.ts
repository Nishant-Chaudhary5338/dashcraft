// ============================================================
// HTTP Client Types
// ============================================================

/**
 * Configuration for the useWidgetData HTTP client hook.
 */
export interface HttpClientConfig {
  /** API endpoint URL */
  readonly endpoint: string;
  /** HTTP method (default: GET) */
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Custom request headers */
  readonly headers?: Record<string, string>;
  /** Request body for POST/PUT/PATCH */
  readonly body?: Record<string, unknown>;
  /** Polling interval in milliseconds (0 = disabled) */
  readonly pollingInterval?: number;
  /** Whether fetching is enabled */
  readonly enabled?: boolean;
}

/**
 * Current state of an HTTP request.
 */
export interface HttpClientState<TData = unknown> {
  /** Fetched data (null if not yet loaded) */
  readonly data: TData | null;
  /** Whether a request is in progress */
  readonly loading: boolean;
  /** Error from the last request (null if successful) */
  readonly error: Error | null;
  /** Timestamp of the last successful fetch */
  readonly lastFetched: Date | null;
}

/**
 * Return type of the useWidgetData hook.
 * Extends state with refetch and cancel actions.
 */
export interface HttpClientReturn<TData = unknown> extends HttpClientState<TData> {
  /** Manually trigger a refetch */
  readonly refetch: () => Promise<void>;
  /** Cancel the current request and polling */
  readonly cancel: () => void;
}