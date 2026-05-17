// ============================================================
// HTTP Client Utility
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import type { HttpClientConfig, HttpClientReturn, HttpClientState } from "../types";

/**
 * Built-in HTTP client hook for data fetching with polling support.
 * Provides loading, error, and data states with automatic refresh.
 *
 * @param config - Configuration with endpoint, method, polling, etc.
 * @returns Object with data, loading, error, refetch, and cancel
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