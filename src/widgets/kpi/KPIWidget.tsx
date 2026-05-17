import React from "react";
import { DashboardCard } from "../../components/DashboardCard";
import type { DashboardCardProps } from "../../components/DashboardCard";

// ============================================================
// Types
// ============================================================

export type KPITrend = "up" | "down" | "neutral";

export type KPIFormat = "number" | "currency" | "percentage" | "text";

export interface KPIWidgetProps extends Omit<DashboardCardProps, "children" | "type"> {
  /** The main value to display */
  readonly value: number | string;
  /** Label/title for the KPI */
  readonly label: string;
  /** Previous value for trend calculation */
  readonly previousValue?: number;
  /** Format type for the value */
  readonly format?: KPIFormat;
  /** Currency code (e.g., "USD", "EUR") for currency format */
  readonly currency?: string;
  /** Number of decimal places */
  readonly decimals?: number;
  /** Trend direction (auto-calculated if previousValue provided) */
  readonly trend?: KPITrend;
  /** Custom trend label (e.g., "+12% vs last month") */
  readonly trendLabel?: string;
  /** Icon to display */
  readonly icon?: React.ReactNode;
  /** Value color override */
  readonly valueColor?: string;
  /** Whether to show a subtle background */
  readonly showBackground?: boolean;
}

// ============================================================
// Helper Functions
// ============================================================

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

function calculateTrend(current: number | string, previous: number): KPITrend {
  if (typeof current === "string") return "neutral";
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "neutral";
}

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
  showBackground = true,
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
          w-full h-full flex flex-col items-center justify-center p-4
          ${showBackground ? "bg-gradient-to-br from-white to-gray-50" : ""}
        `}
      >
        {/* Icon */}
        {icon && (
          <div className="mb-2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Value */}
        <div
          className="text-3xl font-bold tracking-tight"
          style={{ color: valueColor }}
        >
          {formattedValue}
        </div>

        {/* Label */}
        <div className="mt-1 text-sm text-gray-500 font-medium">
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