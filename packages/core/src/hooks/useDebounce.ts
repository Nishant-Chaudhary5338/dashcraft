import { useState, useEffect, useRef } from "react";

// ============================================================
// useDebounce Hook
// ============================================================

/**
 * Hook to debounce a value by a specified delay.
 * Useful for search inputs, form validation, and API calls.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // API call with debounced value
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 *
 * @see {@link useDebouncedCallback} to debounce a function call instead of a value.
 * @see {@link useThrottle} for a rate-limited (rather than delayed) alternative.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to create a debounced callback function.
 * Returns a memoized function that delays execution until after delay milliseconds.
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced callback function
 *
 * @example
 * ```tsx
 * const debouncedSave = useDebouncedCallback((data) => {
 *   saveToServer(data);
 * }, 1000);
 *
 * // Call immediately, but execution is delayed
 * debouncedSave(formData);
 * ```
 *
 * Note: the returned function is a new reference on every render (it is
 * not wrapped in `useCallback`), but the `callback` you pass is always
 * read from a ref at call time, so you never get a stale closure even if
 * you don't memoize `callback` yourself.
 *
 * @see {@link useDebounce} to debounce a value instead of a callback.
 * @see {@link useThrottledCallback} for a rate-limited (rather than delayed) alternative.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number = 300
): (...args: TArgs) => void {
  const callbackRef = useRef(callback);
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

  return (...args: TArgs): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
}