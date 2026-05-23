import type { PersistenceAdapter } from "../types";
import { STORAGE_KEY_PREFIX } from "./index";

// ============================================================
// LocalStorage Adapter (Default)
// ============================================================

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

export function createPersistenceAdapter(
  storage: "localStorage" | "sessionStorage" = "localStorage"
): PersistenceAdapter {
  return storage === "sessionStorage"
    ? sessionStorageAdapter
    : localStorageAdapter;
}