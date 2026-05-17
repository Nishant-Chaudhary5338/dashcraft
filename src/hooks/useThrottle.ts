import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// useThrottle Hook
// ============================================================

/**
 * Hook to throttle a value by a specified interval.
 * Useful for scroll events, resize handlers, and real-time updates.
 *
 * @param value - The value to throttle
 * @param interval - Minimum interval in milliseconds between updates (default: 300ms)
 * @returns The throttled value
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScroll = useThrottle(scrollY, 100);
 *
 * useEffect(() => {
 *   // Expensive operation runs at most every 100ms
 *   updateParallax(throttledScroll);
 * }, [throttledScroll]);
 * ```
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      setThrottledValue(value);
      lastUpdated.current = now;
      return () => {};
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - timeSinceLastUpdate);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Hook to create a throttled callback function.
 * Returns a memoized function that executes at most once per interval.
 *
 * @param callback - The function to throttle
 * @param interval - Minimum interval in milliseconds between executions (default: 300ms)
 * @returns The throttled callback function
 *
 * @example
 * ```tsx
 * const throttledScroll = useThrottledCallback((event) => {
 *   updateScrollPosition(event.target.scrollTop);
 * }, 100);
 *
 * <div onScroll={throttledScroll}>
 * ```
 */
export function useThrottledCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  interval: number = 300
): (...args: TArgs) => void {
  const callbackRef = useRef(callback);
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: TArgs): void => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecuted.current;

      if (timeSinceLastExecution >= interval) {
        // Execute immediately
        lastExecuted.current = now;
        callbackRef.current(...args);
      } else {
        // Schedule execution
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastExecuted.current = Date.now();
          callbackRef.current(...args);
        }, interval - timeSinceLastExecution);
      }
    },
    [interval]
  );
}