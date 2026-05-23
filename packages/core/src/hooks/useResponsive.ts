import { useState, useEffect, useRef, useCallback } from "react";
import type { ResponsiveConfig, ResponsiveReturn } from "../types";

// ============================================================
// useResponsive Hook
// ============================================================

/**
 * Hook to handle responsive content based on container width.
 * Returns the appropriate component for the current breakpoint.
 *
 * @param config - Configuration with breakpoints and initial content
 * @returns Object with content, current breakpoint, and container ref
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