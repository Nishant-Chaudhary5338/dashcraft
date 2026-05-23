import { useCallback, useRef, useState } from "react";

// ============================================================
// Types
// ============================================================

export interface StateWithHistory<T> {
  /** Current value */
  value: T;
  /** Full history array */
  history: T[];
  /** Current index in history */
  index: number;
  /** Whether there is a previous state to go back to */
  canGoBack: boolean;
  /** Whether there is a future state to go forward to */
  canGoForward: boolean;
  /** Set a new value (or functional update) — truncates future on new entry */
  set: (valueOrUpdater: T | ((prev: T) => T)) => void;
  /** Move one step back in history */
  back: () => void;
  /** Move one step forward in history */
  forward: () => void;
  /** Jump to a specific index */
  go: (index: number) => void;
  /** Reset history to a fresh initial value */
  reset: (initialValue: T) => void;
}

export interface UseStateWithHistoryOptions {
  /** Maximum number of history entries to keep (default: unlimited) */
  maxHistory?: number;
}

// ============================================================
// Hook
// ============================================================

/**
 * Like useState but keeps a navigable history of all values.
 * Returns a single-element tuple: [stateWithHistory]
 */
export function useStateWithHistory<T>(
  initialValue: T,
  options?: UseStateWithHistoryOptions
): [StateWithHistory<T>] {
  const maxHistory = options?.maxHistory;

  // Store history and index in a ref to avoid stale closures while keeping
  // a single setState trigger that forces a re-render when anything changes.
  const historyRef = useRef<T[]>([initialValue]);
  const indexRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  const commit = useCallback(() => forceUpdate((n) => n + 1), []);

  const set = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      const current = historyRef.current[indexRef.current] as T;
      const next =
        typeof valueOrUpdater === "function"
          ? (valueOrUpdater as (prev: T) => T)(current)
          : valueOrUpdater;

      // Truncate future entries
      const newHistory = [...historyRef.current.slice(0, indexRef.current + 1), next];
      // Apply maxHistory limit
      const trimmed =
        maxHistory !== undefined && newHistory.length > maxHistory
          ? newHistory.slice(newHistory.length - maxHistory)
          : newHistory;

      historyRef.current = trimmed;
      indexRef.current = trimmed.length - 1;
      commit();
    },
    [maxHistory, commit]
  );

  const back = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      commit();
    }
  }, [commit]);

  const forward = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      commit();
    }
  }, [commit]);

  const go = useCallback(
    (targetIndex: number) => {
      const clamped = Math.max(0, Math.min(historyRef.current.length - 1, targetIndex));
      if (clamped !== indexRef.current) {
        indexRef.current = clamped;
        commit();
      }
    },
    [commit]
  );

  const reset = useCallback(
    (initialVal: T) => {
      historyRef.current = [initialVal];
      indexRef.current = 0;
      commit();
    },
    [commit]
  );

  const currentIndex = indexRef.current;
  const history = historyRef.current;

  const stateWithHistory: StateWithHistory<T> = {
    value: history[currentIndex] as T,
    history,
    index: currentIndex,
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < history.length - 1,
    set,
    back,
    forward,
    go,
    reset,
  };

  return [stateWithHistory];
}
