// ============================================================
// Responsive Breakpoint Types
// ============================================================

import type { ReactNode } from "react";

/**
 * Configuration for a single responsive breakpoint entry.
 *
 * Pairs a minimum container width with the content to render once the
 * container reaches that width. Primarily a documentation/authoring shape;
 * at runtime breakpoints are typically expressed as a {@link ViewBreakpoints}
 * map rather than an array of these.
 *
 * @see ViewBreakpoints
 */
export interface ViewBreakpoint {
  /** Minimum container width, in pixels, at which this breakpoint activates. */
  readonly width: number;
  /** Content rendered while this breakpoint is active. */
  readonly component: ReactNode;
}

/**
 * Map of breakpoint widths to the content shown at each.
 *
 * Numeric keys are minimum-width breakpoints (the widest matching key whose
 * value is ≤ the container's current width wins); the special key
 * `"initial"` is the fallback used before any numeric breakpoint matches.
 * Consumed by {@link WidgetConfig.viewBreakpoints} and
 * {@link ResponsiveConfig.breakpoints}.
 *
 * @example
 * ```ts
 * const breakpoints: ViewBreakpoints = {
 *   initial: <CompactView />,
 *   480: <StandardView />,
 *   960: <ExpandedView />,
 * };
 * ```
 * @see ResponsiveConfig
 * @see WidgetConfig
 */
export type ViewBreakpoints = Record<number | "initial", ReactNode>;

/**
 * Configuration for the `useResponsive` hook.
 *
 * Describes the breakpoint map to watch and the fallback content to show
 * when no breakpoint has matched (or when `breakpoints` is omitted
 * entirely).
 *
 * @example
 * ```ts
 * const config: ResponsiveConfig = {
 *   initial: <MobileLayout />,
 *   breakpoints: { 768: <TabletLayout />, 1280: <DesktopLayout /> },
 * };
 * ```
 * @see ResponsiveReturn
 * @see ViewBreakpoints
 */
export interface ResponsiveConfig {
  /** Breakpoint map; when omitted, `initial` content is always shown. */
  readonly breakpoints?: ViewBreakpoints;
  /** Content rendered when no breakpoint in `breakpoints` currently matches. */
  readonly initial: ReactNode;
}

/**
 * Return value of the `useResponsive` hook.
 *
 * Provides the currently-resolved content plus the ref that must be
 * attached to the measured container element so the hook can observe its
 * width (e.g. via `ResizeObserver`).
 *
 * @see ResponsiveConfig
 */
export interface ResponsiveReturn {
  /** Content resolved for the current container width. */
  readonly content: ReactNode;
  /** Key of the breakpoint currently active (`"initial"` if none matched). */
  readonly currentBreakpoint: number | "initial";
  /** Ref to attach to the container element being measured for width changes. */
  readonly containerRef: React.RefObject<HTMLDivElement | null>;
}
