// ============================================================
// Responsive Breakpoint Types
// ============================================================

import type { ReactNode } from "react";

/**
 * Configuration for a single responsive breakpoint.
 */
export interface ViewBreakpoint {
  /** Minimum width in pixels for this breakpoint */
  readonly width: number;
  /** Component to render at this breakpoint */
  readonly component: ReactNode;
}

/**
 * Map of breakpoints to their components.
 * Use numeric keys for min-width breakpoints, or "initial" for default.
 */
export type ViewBreakpoints = Record<number | "initial", ReactNode>;

/**
 * Configuration for the useResponsive hook.
 */
export interface ResponsiveConfig {
  /** Breakpoint map (optional) */
  readonly breakpoints?: ViewBreakpoints;
  /** Default content when no breakpoint matches */
  readonly initial: ReactNode;
}

/**
 * Return type of the useResponsive hook.
 */
export interface ResponsiveReturn {
  /** Content for the current breakpoint */
  readonly content: ReactNode;
  /** Currently active breakpoint key */
  readonly currentBreakpoint: number | "initial";
  /** Ref to attach to the container element */
  readonly containerRef: React.RefObject<HTMLDivElement | null>;
}