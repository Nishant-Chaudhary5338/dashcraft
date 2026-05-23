import React from "react";
import { GripVertical } from "lucide-react";

// ============================================================
// DashboardCardDragHandle Props
// ============================================================

export interface DashboardCardDragHandleProps {
  /** Whether the handle should be visible */
  visible?: boolean;
  /** Custom className for positioning/styling */
  className?: string;
}

// ============================================================
// DashboardCardDragHandle Component
// ============================================================

export const DashboardCardDragHandle = React.memo(function DashboardCardDragHandle({
  visible = true,
  className = "",
}: DashboardCardDragHandleProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`dashcraft-drag-handle absolute top-2 left-2 w-3 h-3 opacity-50 hover:opacity-100 transition-opacity select-none ${className}`}
      title="Drag to move"
    >
      <GripVertical size={12} className="text-gray-400 hover:text-gray-600 transition-colors pointer-events-none" />
    </div>
  );
});

DashboardCardDragHandle.displayName = "DashboardCardDragHandle";