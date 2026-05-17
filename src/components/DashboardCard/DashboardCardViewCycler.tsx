import React, { useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WidgetActionButton } from "./WidgetActions";
import type { ViewBreakpoints } from "../../types";

// ============================================================
// DashboardCardViewCycler Props
// ============================================================

export interface DashboardCardViewCyclerProps {
  /** View breakpoints to cycle through */
  breakpoints: ViewBreakpoints | undefined;
  /** Current breakpoint index (controlled) */
  currentIndex?: number;
  /** Callback when breakpoint changes */
  onCycle?: (breakpoint: number | "initial") => void;
  /** Whether button is visible */
  visible?: boolean;
  /** Additional className */
  className?: string;
}

// ============================================================
// Default Breakpoint Order
// ============================================================

const DEFAULT_BREAKPOINT_ORDER: (number | "initial")[] = ["initial", 300, 600, 900];

// ============================================================
// Get Breakpoint Label
// ============================================================

function getBreakpointLabel(breakpoint: number | "initial"): string {
  if (breakpoint === "initial") {
    return "S";
  }
  if (breakpoint <= 300) {
    return "S";
  }
  if (breakpoint <= 600) {
    return "M";
  }
  if (breakpoint <= 900) {
    return "L";
  }
  return "XL";
}

// ============================================================
// DashboardCardViewCycler Component
// ============================================================

export const DashboardCardViewCycler = React.memo(function DashboardCardViewCycler({
  breakpoints,
  currentIndex: controlledIndex,
  onCycle,
  visible = true,
  className = "",
}: DashboardCardViewCyclerProps): React.JSX.Element | null {
  // ==========================================================
  // Internal State
  // ==========================================================

  const [internalIndex, setInternalIndex] = useState(0);

  // ==========================================================
  // Computed Values
  // ==========================================================

  const breakpointOrder = useMemo<(number | "initial")[]>(() => {
    if (!breakpoints) return DEFAULT_BREAKPOINT_ORDER;

    const keys = Object.keys(breakpoints)
      .map((k) => (k === "initial" ? "initial" : Number(k)))
      .filter((k) => k === "initial" || !isNaN(k as number))
      .sort((a, b) => {
        if (a === "initial") return -1;
        if (b === "initial") return 1;
        return (a as number) - (b as number);
      });

    return keys.length > 0 ? keys : DEFAULT_BREAKPOINT_ORDER;
  }, [breakpoints]);

  const currentIndex = controlledIndex ?? internalIndex;
  const currentBreakpoint = breakpointOrder[currentIndex] ?? "initial";
  const label = getBreakpointLabel(currentBreakpoint);

  // ==========================================================
  // Cycle Handler
  // ==========================================================

  const handleCycle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const nextIndex = (currentIndex + 1) % breakpointOrder.length;
      const nextBreakpoint = breakpointOrder[nextIndex] ?? "initial";

      if (controlledIndex === undefined) {
        setInternalIndex(nextIndex);
      }

      onCycle?.(nextBreakpoint);
    },
    [currentIndex, breakpointOrder, controlledIndex, onCycle]
  );

  // ==========================================================
  // Render
  // ==========================================================

  if (!visible) {
    return null;
  }

  return (
    <WidgetActionButton
      position="top-left-second"
      icon={
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-xs font-medium"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      }
      onClick={handleCycle}
      tooltip={`View: ${label} (${currentBreakpoint === "initial" ? "auto" : `${currentBreakpoint}px`})`}
      className={className}
      visible={visible}
    />
  );
});

DashboardCardViewCycler.displayName = "DashboardCardViewCycler";