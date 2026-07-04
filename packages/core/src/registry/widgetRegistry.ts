// ============================================================
// Widget Registry - Central Widget Type Registration
// ============================================================

import type React from "react";
import type { Size } from "../types";

/**
 * Props passed to a widget's rendering component, as registered via
 * {@link WidgetRegistration.component}.
 *
 * The index signature permits arbitrary additional props beyond `id`/
 * `title`/`settings` since a widget component may need custom data props
 * supplied by its host.
 * @example
 * ```tsx
 * import type { WidgetComponentProps } from "@dashcraft/core";
 *
 * function ChartWidget({ id, title, settings }: WidgetComponentProps) {
 *   return <div>{title ?? id}</div>;
 * }
 * ```
 * @see WidgetRegistration
 * @see WidgetSettingsProps
 */
export interface WidgetComponentProps {
  /** The widget instance's unique id. */
  id: string;
  /** Optional display title for the widget. */
  title?: string;
  /** The widget's current settings, as stored in {@link WidgetState.settings}. */
  settings?: Record<string, unknown>;
  /** Additional props supplied by the widget's host beyond the known ones above. */
  [key: string]: unknown;
}

/**
 * Props passed to a widget's settings-panel component, as registered via
 * {@link WidgetRegistration.settings}.
 *
 * The settings component is expected to call `onUpdate` with the full
 * (or partially merged) settings object whenever the user changes a value;
 * the host applies the update via
 * {@link DashboardStoreState.updateWidgetSettings}.
 * @example
 * ```tsx
 * import type { WidgetSettingsProps } from "@dashcraft/core";
 *
 * function ChartSettings({ settings, onUpdate }: WidgetSettingsProps) {
 *   return (
 *     <input
 *       value={String(settings.endpoint ?? "")}
 *       onChange={(e) => onUpdate({ endpoint: e.target.value })}
 *     />
 *   );
 * }
 * ```
 * @see WidgetRegistration
 * @see WidgetComponentProps
 */
export interface WidgetSettingsProps {
  /** The widget instance's unique id. */
  id: string;
  /** The widget's current settings. */
  settings: Record<string, unknown>;
  /** Call with new or merged settings to persist the change to the store. */
  onUpdate: (settings: Record<string, unknown>) => void;
}

/**
 * Registration configuration for a widget type: everything the registry
 * and dashboard UI need to render, add, and configure widgets of this
 * type.
 *
 * Register one via {@link widgetRegistry}`.register()`; read it back via
 * {@link widgetRegistry}`.get()` or the {@link useWidgetRegistration} family
 * of hooks.
 * @example
 * ```tsx
 * import type { WidgetRegistration } from "@dashcraft/core";
 *
 * const chartWidget: WidgetRegistration = {
 *   type: "chart",
 *   label: "Chart",
 *   component: ChartWidget,
 *   defaultSize: { width: 400, height: 300 },
 *   category: "visualization",
 * };
 * ```
 * @see widgetRegistry
 * @see WidgetComponentProps
 * @see WidgetSettingsProps
 */
export interface WidgetRegistration {
  /** Unique type identifier */
  type: string;
  /** Display label for the widget */
  label: string;
  /** React component to render the widget */
  component: React.ComponentType<WidgetComponentProps>;
  /** Default size when widget is created */
  defaultSize: Size;
  /** Optional icon component for the widget */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional settings component */
  settings?: React.ComponentType<WidgetSettingsProps>;
  /** Optional description */
  description?: string;
  /** Optional category for grouping */
  category?: string;
  /** Optional tags for searching */
  tags?: string[];
}

/**
 * Widget Registry - manages widget type registrations
 *
 * @example
 * ```tsx
 * import { widgetRegistry } from '@dashcraft/core';
 * import { ChartWidget, ChartWidgetIcon } from './widgets';
 *
 * // Register a widget type
 * widgetRegistry.register({
 *   type: 'chart',
 *   label: 'Chart',
 *   component: ChartWidget,
 *   defaultSize: { width: 400, height: 300 },
 *   icon: ChartWidgetIcon,
 *   category: 'visualization',
 *   tags: ['chart', 'graph', 'data'],
 * });
 *
 * // Later, get the registration
 * const registration = widgetRegistry.get('chart');
 * if (registration) {
 *   const Widget = registration.component;
 *   return <Widget id="widget-1" />;
 * }
 * ```
 */
class WidgetRegistry {
  private registrations = new Map<string, WidgetRegistration>();

  /**
   * Register a new widget type
   * @param registration - Widget registration configuration
   */
  register(registration: WidgetRegistration): void {
    if (this.registrations.has(registration.type)) {
      console.warn(
        `[DashCraft] Widget type "${registration.type}" is already registered. Overwriting.`
      );
    }
    this.registrations.set(registration.type, registration);
  }

  /**
   * Unregister a widget type
   * @param type - Widget type to unregister
   */
  unregister(type: string): boolean {
    return this.registrations.delete(type);
  }

  /**
   * Get a widget registration by type
   * @param type - Widget type
   * @returns Widget registration or undefined
   */
  get(type: string): WidgetRegistration | undefined {
    return this.registrations.get(type);
  }

  /**
   * Check if a widget type is registered
   * @param type - Widget type
   * @returns True if registered
   */
  has(type: string): boolean {
    return this.registrations.has(type);
  }

  /**
   * List all registered widget types
   * @returns Array of widget type strings
   */
  list(): string[] {
    return Array.from(this.registrations.keys());
  }

  /**
   * List all registrations
   * @returns Array of widget registrations
   */
  listAll(): WidgetRegistration[] {
    return Array.from(this.registrations.values());
  }

  /**
   * Get registrations by category
   * @param category - Category to filter by
   * @returns Array of matching registrations
   */
  getByCategory(category: string): WidgetRegistration[] {
    return this.listAll().filter((reg) => reg.category === category);
  }

  /**
   * Search registrations by tags
   * @param tags - Tags to search for
   * @returns Array of matching registrations
   */
  searchByTags(tags: string[]): WidgetRegistration[] {
    const lowerTags = tags.map((t) => t.toLowerCase());
    return this.listAll().filter((reg) =>
      reg.tags?.some((tag) => lowerTags.includes(tag.toLowerCase()))
    );
  }

  /**
   * Get all unique categories
   * @returns Array of category strings
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.listAll().forEach((reg) => {
      if (reg.category) {
        categories.add(reg.category);
      }
    });
    return Array.from(categories);
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.registrations.clear();
  }

  /**
   * Get the count of registered widgets
   */
  get size(): number {
    return this.registrations.size;
  }
}

// Singleton instance
export const widgetRegistry = new WidgetRegistry();

/**
 * React hook wrapping `widgetRegistry.get(type)` for looking up a single
 * widget type's registration.
 *
 * Note: the registry is a plain mutable singleton, not a reactive store —
 * this hook reads the current value at render time but does not
 * re-render automatically if the registration is added/changed/removed
 * after mount. Prefer registering widget types once at app startup, before
 * any component that reads them mounts.
 * @param type - Widget type identifier to look up.
 * @returns The matching {@link WidgetRegistration}, or `undefined` if not
 * registered.
 * @example
 * ```tsx
 * import { useWidgetRegistration } from "@dashcraft/core";
 *
 * function WidgetHost({ type }: { type: string }) {
 *   const registration = useWidgetRegistration(type);
 *   if (!registration) return null;
 *   const Widget = registration.component;
 *   return <Widget id="widget-1" />;
 * }
 * ```
 * @see widgetRegistry
 * @see useWidgetRegistrations
 */
export function useWidgetRegistration(type: string): WidgetRegistration | undefined {
  return widgetRegistry.get(type);
}

/**
 * React hook wrapping `widgetRegistry.listAll()` for reading every
 * registered widget type, e.g. to render a widget picker/palette.
 *
 * Same non-reactive caveat as {@link useWidgetRegistration}: re-render is
 * not triggered automatically by later registry changes.
 * @returns Array of all registered {@link WidgetRegistration}s.
 * @example
 * ```tsx
 * import { useWidgetRegistrations } from "@dashcraft/core";
 *
 * function WidgetPalette() {
 *   const registrations = useWidgetRegistrations();
 *   return (
 *     <ul>
 *       {registrations.map((r) => (
 *         <li key={r.type}>{r.label}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 * @see widgetRegistry
 * @see useWidgetRegistrationsByCategory
 */
export function useWidgetRegistrations(): WidgetRegistration[] {
  return widgetRegistry.listAll();
}

/**
 * React hook wrapping `widgetRegistry.getByCategory(category)` for reading
 * only the widget types tagged with a given category, e.g. to render a
 * category-filtered widget picker.
 *
 * Same non-reactive caveat as {@link useWidgetRegistration}.
 * @param category - Category to filter by (matches {@link WidgetRegistration.category}).
 * @returns Array of matching {@link WidgetRegistration}s.
 * @example
 * ```tsx
 * import { useWidgetRegistrationsByCategory } from "@dashcraft/core";
 *
 * function VisualizationWidgets() {
 *   const registrations = useWidgetRegistrationsByCategory("visualization");
 *   return <ul>{registrations.map((r) => <li key={r.type}>{r.label}</li>)}</ul>;
 * }
 * ```
 * @see widgetRegistry
 * @see useWidgetRegistrations
 */
export function useWidgetRegistrationsByCategory(category: string): WidgetRegistration[] {
  return widgetRegistry.getByCategory(category);
}

/**
 * Type of the {@link widgetRegistry} singleton, exported so consumers can
 * type their own references to it (e.g. when passing it through a
 * dependency-injection boundary) without constructing a second instance.
 * @see widgetRegistry
 */
export type { WidgetRegistry };