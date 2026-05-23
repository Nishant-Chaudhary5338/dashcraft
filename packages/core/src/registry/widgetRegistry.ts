// ============================================================
// Widget Registry - Central Widget Type Registration
// ============================================================

import type React from "react";
import type { Size } from "../types";

/**
 * Props passed to widget components
 */
export interface WidgetComponentProps {
  id: string;
  title?: string;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Props passed to widget settings components
 */
export interface WidgetSettingsProps {
  id: string;
  settings: Record<string, unknown>;
  onUpdate: (settings: Record<string, unknown>) => void;
}

/**
 * Registration configuration for a widget type
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
 * Hook to get widget registration
 * @param type - Widget type
 * @returns Widget registration or undefined
 */
export function useWidgetRegistration(type: string): WidgetRegistration | undefined {
  return widgetRegistry.get(type);
}

/**
 * Hook to get all widget registrations
 * @returns Array of all registrations
 */
export function useWidgetRegistrations(): WidgetRegistration[] {
  return widgetRegistry.listAll();
}

/**
 * Hook to get widget registrations by category
 * @param category - Category to filter by
 * @returns Array of matching registrations
 */
export function useWidgetRegistrationsByCategory(category: string): WidgetRegistration[] {
  return widgetRegistry.getByCategory(category);
}

export type { WidgetRegistry };