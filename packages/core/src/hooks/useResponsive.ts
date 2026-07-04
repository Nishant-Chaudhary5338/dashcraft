import { useState, useEffect, useRef, useCallback } from "react";
import type { ResponsiveConfig, ResponsiveReturn } from "../types";

// ============================================================
// useResponsive Hook
// ============================================================

/**
 * Renders different content per container width, using a `ResizeObserver`
 * on a container element rather than the viewport — so it works correctly
 * inside a dashboard widget whose available width depends on its grid
 * cell, not the browser window.
 *
 * Attach the returned `containerRef` to the element whose width should
 * drive content selection. `breakpoints` are numeric minimum widths (in
 * pixels); the hook picks the largest breakpoint whose value is `<=` the
 * container's current width, falling back to `breakpoints.initial` (or
 * the `initial` config value) below the smallest breakpoint.
 *
 * @param config - Breakpoint map (`{ [minWidth]: content }`) plus the
 * fallback `initial` content shown before measurement / below the
 * smallest breakpoint. See {@link ResponsiveConfig}.
 * @returns The content to render for the current width, the matched
 * breakpoint key (or `"initial"`), and the ref to attach to the
 * container. See {@link ResponsiveReturn}.
 *
 * @example
 * ```tsx
 * import { useResponsive } from "@dashcraft/core";
 *
 * function AdaptiveWidget() {
 *   const { content, containerRef } = useResponsive({
 *     initial: <CompactView />,
 *     breakpoints: { 400: <MediumView />, 800: <FullView /> },
 *   });
 *   return <div ref={containerRef}>{content}</div>;
 * }
 * ```
 *
 * @see {@link useMeasure} for raw width/height without the breakpoint mapping.
 */
export function useResponsive(config: ResponsiveConfig): ResponsiveReturn {
  const { breakpoints, initial } = config;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<number | "initial">("initial");
  const [content, setContent] = useState<React.ReactNode>(initial);

  // ==========================================================
  // Find matching breakpoint
  // ==========================================================

  const findMatchingBreakpoint = useCallback(
    (width: number): number | "initial" => {
      if (!breakpoints) return "initial";

      // Get all numeric breakpoints sorted descending
      const breakpointValues = Object.keys(breakpoints)
        .map(Number)
        .filter((n) => !isNaN(n))
        .sort((a, b) => b - a);

      // Find the largest breakpoint that fits
      for (const bp of breakpointValues) {
        if (width >= bp) {
          return bp;
        }
      }

      return "initial";
    },
    [breakpoints]
  );

  // ==========================================================
  // Update content based on breakpoint
  // ==========================================================

  const updateContent = useCallback(
    (width: number) => {
      if (!breakpoints) {
        setContent(initial);
        return;
      }

      const matchingBreakpoint = findMatchingBreakpoint(width);
      setCurrentBreakpoint(matchingBreakpoint);

      if (matchingBreakpoint === "initial") {
        setContent(breakpoints.initial ?? initial);
      } else {
        setContent(breakpoints[matchingBreakpoint] ?? breakpoints.initial ?? initial);
      }
    },
    [breakpoints, initial, findMatchingBreakpoint]
  );

  // ==========================================================
  // ResizeObserver
  // ==========================================================

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial measurement
    updateContent(container.clientWidth);

    // Create ResizeObserver
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        updateContent(width);
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [updateContent]);

  // ==========================================================
  // Return
  // ==========================================================

  return {
    content,
    currentBreakpoint,
    containerRef,
  };
}