import { useState, useEffect, useCallback, useRef } from "react";
import type { PersistenceAdapter } from "../types";
import { localStorageAdapter } from "../utils/persistence";
import { useDebouncedCallback } from "./useDebounce";

// ============================================================
// usePersistence Hook
// ============================================================

/**
 * Options for usePersistence hook
 */
export interface UsePersistenceOptions<T> {
  /** Unique key for storage */
  key: string;
  /** Default value when no stored data exists */
  defaultValue: T;
  /** Persistence adapter to use (default: localStorage) */
  adapter?: PersistenceAdapter;
  /** Enable auto-save on value change */
  autoSave?: boolean;
  /** Debounce delay for auto-save in ms (default: 500) */
  autoSaveDelay?: number;
  /** Serializer function (default: JSON.stringify) */
  serializer?: (value: T) => string;
  /** Deserializer function (default: JSON.parse) */
  deserializer?: (value: string) => T;
  /** Callback when save succeeds */
  onSave?: (value: T) => void;
  /** Callback when save fails */
  onSaveError?: (error: Error) => void;
  /** Callback when load succeeds */
  onLoad?: (value: T) => void;
  /** Callback when load fails */
  onLoadError?: (error: Error) => void;
}

/**
 * Return type for usePersistence hook
 */
export interface UsePersistenceReturn<T> {
  /** Current value */
  value: T;
  /** Set value (triggers auto-save if enabled) */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Manually save to storage */
  save: () => Promise<boolean>;
  /** Manually load from storage */
  load: () => Promise<T | null>;
  /** Clear stored value */
  clear: () => Promise<boolean>;
  /** Whether currently saving */
  isSaving: boolean;
  /** Whether currently loading */
  isLoading: boolean;
  /** Last save error */
  saveError: Error | null;
  /** Last load error */
  loadError: Error | null;
  /** Whether value has unsaved changes */
  isDirty: boolean;
  /** Reset to default value */
  reset: () => void;
}

/**
 * Hook for persisting state to storage with auto-save support.
 * Provides save/load/clear operations with error handling.
 *
 * @param options - Configuration options
 * @returns Object with value state and persistence operations
 *
 * @example
 * ```tsx
 * const { value, setValue, save, load, clear, isSaving } = usePersistence({
 *   key: 'user-preferences',
 *   defaultValue: { theme: 'light', fontSize: 14 },
 *   autoSave: true,
 *   autoSaveDelay: 1000,
 *   onSave: (value) => console.log('Saved:', value),
 * });
 *
 * return (
 *   <div>
 *     <select value={value.theme} onChange={(e) => setValue({ ...value, theme: e.target.value })}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *     </select>
 *     <button onClick={save} disabled={isSaving}>
 *       {isSaving ? 'Saving...' : 'Save'}
 *     </button>
 *   </div>
 * );
 * ```
 */
export function usePersistence<T>(options: UsePersistenceOptions<T>): UsePersistenceReturn<T> {
  const {
    key,
    defaultValue,
    adapter = localStorageAdapter,
    autoSave = false,
    autoSaveDelay = 500,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onSave,
    onSaveError,
    onLoad,
    onLoadError,
  } = options;

  const [value, setValueState] = useState<T>(defaultValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultValueRef = useRef(defaultValue);
  const keyRef = useRef(key);

  // Update refs when props change
  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  /**
   * Save value to storage
   */
  const save = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const serialized = serializer(value);
      adapter.setItem(keyRef.current, serialized);
      setIsDirty(false);
      onSave?.(value);
      return true;
    } catch (error) {
      const saveErr = error instanceof Error ? error : new Error(String(error));
      setSaveError(saveErr);
      onSaveError?.(saveErr);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [value, adapter, serializer, onSave, onSaveError]);

  /**
   * Load value from storage
   */
  const load = useCallback(async (): Promise<T | null> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const storedResult = adapter.getItem(keyRef.current);
      const stored = storedResult instanceof Promise ? await storedResult : storedResult;
      if (stored === null) {
        setValueState(defaultValueRef.current);
        return defaultValueRef.current;
      }

      const parsed = deserializer(stored) as T;
      setValueState(parsed);
      setIsDirty(false);
      onLoad?.(parsed);
      return parsed;
    } catch (error) {
      const loadErr = error instanceof Error ? error : new Error(String(error));
      setLoadError(loadErr);
      onLoadError?.(loadErr);
      setValueState(defaultValueRef.current);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [adapter, deserializer, onLoad, onLoadError]);

  /**
   * Clear stored value
   */
  const clear = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);

    try {
      adapter.removeItem(keyRef.current);
      setValueState(defaultValueRef.current);
      setIsDirty(false);
      return true;
    } catch (error) {
      const clearErr = error instanceof Error ? error : new Error(String(error));
      setSaveError(clearErr);
      onSaveError?.(clearErr);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [adapter, defaultValueRef, onSaveError]);

  /**
   * Set value with dirty tracking
   */
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)): void => {
      setValueState((prev) => {
        const nextValue = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;
        setIsDirty(true);
        return nextValue;
      });
    },
    []
  );

  /**
   * Reset to default value
   */
  const reset = useCallback((): void => {
    setValueState(defaultValueRef.current);
    setIsDirty(false);
  }, []);

  // Debounced auto-save
  const debouncedSave = useDebouncedCallback(save, autoSaveDelay);

  // Auto-save on value change
  useEffect(() => {
    if (!autoSave || !isInitialized || !isDirty) return;
    debouncedSave();
  }, [value, autoSave, isInitialized, isDirty, debouncedSave]);

  // Load on mount
  useEffect(() => {
    load().finally(() => {
      setIsInitialized(true);
    });
  }, [load]);

  return {
    value,
    setValue,
    save,
    load,
    clear,
    isSaving,
    isLoading,
    saveError,
    loadError,
    isDirty,
    reset,
  };
}

/**
 * Simplified persistence hook for simple key-value storage.
 * Uses localStorage with JSON serialization by default.
 *
 * @param key - Storage key
 * @param defaultValue - Default value
 * @returns [value, setValue] tuple similar to useState
 *
 * @example
 * ```tsx
 * const [count, setCount] = usePersistedState('counter', 0);
 *
 * return (
 *   <button onClick={() => setCount(c => c + 1)}>
 *     Count: {count}
 *   </button>
 * );
 * ```
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const { value, setValue } = usePersistence({
    key,
    defaultValue,
    autoSave: true,
  });

  return [value, setValue];
}