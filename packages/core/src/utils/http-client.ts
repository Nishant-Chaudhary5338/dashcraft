// ============================================================
// HTTP Client Utility
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import type { HttpClientConfig, HttpClientReturn, HttpClientState } from "../types";

/**
 * Built-in HTTP client hook for data fetching with polling support.
 *
 * Fetches `config.endpoint` on mount and whenever `endpoint`/`method`/
 * `headers`/`body`/`enabled` change, tracking loading/error/data state
 * across the request lifecycle. Cancels the in-flight request (via
 * `AbortController`) whenever a new fetch starts or the hook unmounts, and
 * silently ignores `AbortError` rather than surfacing it as `error`. When
 * `pollingInterval` is set to a positive number, re-fetches on that
 * interval as long as `enabled` is `true`; polling is not restarted for a
 * config change alone — it depends on `pollingInterval`/`enabled`/the
 * memoized `fetchData` callback.
 *
 * This shape lines up with {@link WidgetSettings} (`endpoint`, `method`,
 * `headers`, `body`, `pollingInterval`), so a widget can drive its data
 * fetching entirely from user-editable settings.
 * @param config - Fetch configuration: `endpoint`, `method` (default
 * `"GET"`), `headers`, `body`, `pollingInterval` (ms; disabled if `0` or
 * omitted), and `enabled` (default `true`; set `false` to pause fetching).
 * @returns Current `{ data, loading, error, lastFetched }` state plus
 * `refetch()` (re-runs the fetch immediately) and `cancel()` (aborts the
 * in-flight request and stops polling).
 * @example
 * ```tsx
 * import { useWidgetData } from "@dashcraft/core";
 *
 * function MetricsWidget() {
 *   const { data, loading, error, refetch } = useWidgetData<{ count: number }>({
 *     endpoint: "/api/metrics/active-users",
 *     pollingInterval: 30_000,
 *   });
 *
 *   if (loading) return <span>Loading...</span>;
 *   if (error) return <button onClick={refetch}>Retry</button>;
 *   return <span>{data?.count}</span>;
 * }
 * ```
 * @see WidgetSettings
 */
export function useWidgetData<TData = unknown>(
  config: HttpClientConfig
): HttpClientReturn<TData> {
  const { endpoint, method = "GET", headers, body, pollingInterval, enabled = true } = config;

  const [state, setState] = useState<HttpClientState<TData>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!enabled || !endpoint) return;

    // Cancel previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        ...(body !== undefined && { body: JSON.stringify(body) }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as TData;

      setState({
        data,
        loading: false,
        error: null,
        lastFetched: new Date(),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  }, [endpoint, method, headers, body, enabled]);

  const cancel = useCallback((): void => {
    abortControllerRef.current?.abort();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Fetch on mount and when config changes
  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  // Polling
  useEffect(() => {
    if (!pollingInterval || pollingInterval <= 0 || !enabled) return;

    intervalRef.current = setInterval(fetchData, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pollingInterval, fetchData, enabled]);

  return {
    ...state,
    refetch: fetchData,
    cancel,
  };
}