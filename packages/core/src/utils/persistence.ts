import type { PersistenceAdapter } from "../types";
import { STORAGE_KEY_PREFIX } from "./index";

// ============================================================
// LocalStorage Adapter (Default)
// ============================================================

/**
 * {@link PersistenceAdapter} backed by the browser's `localStorage`.
 *
 * All keys are namespaced with {@link STORAGE_KEY_PREFIX}. Every method
 * swallows storage exceptions (quota exceeded, disabled storage, private
 * browsing restrictions) and logs to `console.error` rather than throwing,
 * so a storage failure never crashes the caller.
 *
 * This is the default returned by {@link createPersistenceAdapter}; use it
 * directly only if you need to reference it without going through the
 * factory.
 * @see createPersistenceAdapter
 * @see sessionStorageAdapter
 */
export const localStorageAdapter: PersistenceAdapter = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    } catch {
      console.error("[DashCraft] localStorage.getItem failed");
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, value);
    } catch {
      console.error("[DashCraft] localStorage.setItem failed");
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
    } catch {
      console.error("[DashCraft] localStorage.removeItem failed");
    }
  },
};

// ============================================================
// SessionStorage Adapter
// ============================================================

/**
 * {@link PersistenceAdapter} backed by the browser's `sessionStorage`.
 *
 * Same namespacing and error-swallowing behavior as
 * {@link localStorageAdapter}, but the layout is cleared when the tab/
 * session ends rather than persisting across browser restarts.
 * @see createPersistenceAdapter
 * @see localStorageAdapter
 */
export const sessionStorageAdapter: PersistenceAdapter = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    } catch {
      console.error("[DashCraft] sessionStorage.getItem failed");
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, value);
    } catch {
      console.error("[DashCraft] sessionStorage.setItem failed");
    }
  },

  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
    } catch {
      console.error("[DashCraft] sessionStorage.removeItem failed");
    }
  },
};

// ============================================================
// Factory Function
// ============================================================

/**
 * Returns a {@link PersistenceAdapter} for the requested storage backend.
 *
 * This is the recommended way to obtain a persistence adapter (rather than
 * importing {@link localStorageAdapter} / {@link sessionStorageAdapter}
 * directly) since it centralizes the default and reads naturally at call
 * sites that configure a dashboard's persistence strategy.
 * @param storage - Which Web Storage backend to use.
 * @default "localStorage"
 * @returns A {@link PersistenceAdapter} wrapping the chosen storage.
 * @example
 * ```ts
 * import { createPersistenceAdapter } from "@dashcraft/core";
 *
 * const adapter = createPersistenceAdapter("sessionStorage");
 * adapter.setItem("main", JSON.stringify(layout));
 * ```
 * @see localStorageAdapter
 * @see sessionStorageAdapter
 */
export function createPersistenceAdapter(
  storage: "localStorage" | "sessionStorage" = "localStorage"
): PersistenceAdapter {
  return storage === "sessionStorage"
    ? sessionStorageAdapter
    : localStorageAdapter;
}