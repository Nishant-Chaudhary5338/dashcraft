import React from "react";
import { DashboardCard } from "../../components/DashboardCard";
import type { DashboardCardProps } from "../../components/DashboardCard";

// ============================================================
// Types
// ============================================================

/**
 * Direction of change relative to a previous value. Drives both the trend
 * icon (up/down arrow or flat line) and its color (emerald/red/gray).
 */
export type KPITrend = "up" | "down" | "neutral";

/**
 * Display format applied to a numeric {@link KPIWidgetProps.value} (ignored
 * for string values, which are always rendered verbatim).
 * - `"number"` — locale-formatted plain number (`Intl.NumberFormat`).
 * - `"currency"` — locale-formatted currency using {@link KPIWidgetProps.currency}.
 * - `"percentage"` — fixed-decimal number suffixed with `%`.
 * - `"text"` — falls through to the default (`"number"`) formatting branch; use a string `value` instead if you want truly unformatted text.
 */
export type KPIFormat = "number" | "currency" | "percentage" | "text";

/**
 * Props for {@link KPIWidget}. Extends every base dashboard-card prop
 * (title, id, drag/resize handles, etc — see {@link DashboardCardProps})
 * except `children` and `type`, since the widget hardcodes `type="kpi"` and
 * the formatted value/trend is the card's content.
 */
export interface KPIWidgetProps extends Omit<DashboardCardProps, "children" | "type"> {
  /** The main value to display. Strings are rendered as-is (no formatting applied); numbers are formatted per `format`. */
  readonly value: number | string;
  /** Label/title shown beneath the value. */
  readonly label: string;
  /** Previous value used to auto-calculate `trend` and the default `trendLabel` (as a `+X%`/`-X%` change). Ignored if `value` is a string. */
  readonly previousValue?: number;
  /** Display format for a numeric `value`.
   * @default "number" */
  readonly format?: KPIFormat;
  /** ISO 4217 currency code (e.g. `"USD"`, `"EUR"`) used only when `format="currency"`.
   * @default "USD" */
  readonly currency?: string;
  /** Number of decimal places for numeric formatting and the auto-calculated trend percentage.
   * @default 0 */
  readonly decimals?: number;
  /** Explicit trend direction. Overrides the auto-calculation from `value`/`previousValue`.
   * @default Auto-calculated from `value` vs `previousValue` when both are numeric; `"neutral"` otherwise. */
  readonly trend?: KPITrend;
  /** Custom trend caption (e.g. `"+12% vs last month"`). Overrides the auto-calculated `±X%` label.
   * @default Auto-calculated `±X%` change vs `previousValue` when both `value` and `previousValue` are numeric; hidden entirely otherwise. */
  readonly trendLabel?: string;
  /** Icon rendered above the value, dimmed to 50% opacity. */
  readonly icon?: React.ReactNode;
  /** Inline color override for the value text (any CSS color). Falls back to the surrounding theme's text color when omitted. */
  readonly valueColor?: string;
  /** Whether to render a subtle white-to-gray gradient background behind the content.
   * @default false */
  readonly showBackground?: boolean;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Formats a KPI value for display per {@link KPIFormat}. String values pass
 * through unchanged (formatting only applies to numbers). Not exported —
 * internal to {@link KPIWidget}.
 *
 * @param value - Raw value to format.
 * @param format - Which format to apply (`"text"` behaves the same as `"number"`; see {@link KPIFormat}).
 * @param currency - ISO 4217 currency code, used only when `format === "currency"`.
 * @param decimals - Decimal places for `"number"`/`"currency"`/`"percentage"` formatting.
 * @returns The formatted string.
 */
function formatValue(
  value: number | string,
  format: KPIFormat,
  currency: string,
  decimals: number
): string {
  if (typeof value === "string") return value;

  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    case "percentage":
      return `${value.toFixed(decimals)}%`;
    case "number":
    default:
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
  }
}

/**
 * Derives a {@link KPITrend} by comparing `current` to `previous`. Not
 * exported — internal to {@link KPIWidget}.
 *
 * @param current - The current KPI value; string values always yield `"neutral"` (trend comparison requires a number).
 * @param previous - The prior value to compare against.
 * @returns `"up"` if greater, `"down"` if lesser, `"neutral"` if equal or `current` isn't numeric.
 */
function calculateTrend(current: number | string, previous: number): KPITrend {
  if (typeof current === "string") return "neutral";
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "neutral";
}

/** Maps a {@link KPITrend} to its Tailwind text-color class. Not exported — internal to {@link KPIWidget}. */
function getTrendColor(trend: KPITrend): string {
  switch (trend) {
    case "up":
      return "text-emerald-500";
    case "down":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

/** Maps a {@link KPITrend} to its inline SVG arrow (up/down) or flat-line icon. Not exported — internal to {@link KPIWidget}. */
function getTrendIcon(trend: KPITrend): React.ReactNode {
  switch (trend) {
    case "up":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    case "down":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      );
  }
}

// ============================================================
// KPIWidget Component
// ============================================================

/**
 * Displays a single formatted metric with an optional trend indicator,
 * wrapped in a {@link DashboardCard} (`type="kpi"`). Trend direction and
 * label are auto-calculated from `value`/`previousValue` when not explicitly
 * overridden via `trend`/`trendLabel`.
 *
 * @returns A {@link DashboardCard} showing the formatted value, label, and (if applicable) a colored trend row.
 *
 * @example
 * ```tsx
 * import { KPIWidget } from "@dashcraft/core";
 *
 * <KPIWidget
 *   id="mrr"
 *   title="Monthly Recurring Revenue"
 *   label="MRR"
 *   value={48200}
 *   previousValue={43000}
 *   format="currency"
 *   currency="USD"
 *   decimals={0}
 * />
 * ```
 *
 * @see {@link RechartsWidget}, {@link HierarchyWidget}
 */
export const KPIWidget = React.memo(function KPIWidget({
  value,
  label,
  previousValue,
  format = "number",
  currency = "USD",
  decimals = 0,
  trend: trendProp,
  trendLabel,
  icon,
  valueColor,
  showBackground = false,
  ...cardProps
}: KPIWidgetProps): React.JSX.Element {
  // ==========================================================
  // Computed Values
  // ==========================================================

  const trend: KPITrend = trendProp ?? (previousValue !== undefined && typeof value === "number"
    ? calculateTrend(value, previousValue)
    : "neutral");

  const formattedValue = formatValue(value, format, currency, decimals);

  const displayTrendLabel = trendLabel ?? (previousValue !== undefined && typeof value === "number"
    ? `${trend === "up" ? "+" : ""}${((value - previousValue) / previousValue * 100).toFixed(decimals)}%`
    : null);

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <DashboardCard {...cardProps} type="kpi">
      <div
        className={`
          w-full h-full flex flex-col items-center justify-center p-4 rounded-lg
          ${showBackground ? "bg-gradient-to-br from-white to-gray-50" : ""}
        `}
      >
        {/* Icon */}
        {icon && (
          <div className="mb-2 opacity-50">
            {icon}
          </div>
        )}

        {/* Value — inherits the consumer theme's text color unless overridden */}
        <div
          className="text-3xl font-bold tracking-tight"
          style={{ color: valueColor }}
        >
          {formattedValue}
        </div>

        {/* Label */}
        <div className="mt-1 text-sm font-medium opacity-60">
          {label}
        </div>

        {/* Trend */}
        {displayTrendLabel && (
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${getTrendColor(trend)}`}>
            {getTrendIcon(trend)}
            <span>{displayTrendLabel}</span>
          </div>
        )}
      </div>
    </DashboardCard>
  );
});

KPIWidget.displayName = "KPIWidget";