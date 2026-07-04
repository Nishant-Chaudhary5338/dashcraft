import React, { useCallback } from "react";
import { useDashboardContext } from "../Dashboard/Dashboard.context";

// ============================================================
// DashboardCardHeader Props
// ============================================================

/** Props for {@link DashboardCardHeader}. */
export interface DashboardCardHeaderProps {
  /** Id of the widget this header belongs to; used when deleting via the header's delete button. */
  id: string;
  /** Title text shown on the left of the header. When absent and not in edit mode, the header renders nothing. */
  title?: string;
  /**
   * Whether the delete button is shown.
   * @deprecated use `delete` instead; when both are set `deletable` wins for backwards-compat.
   */
  deletable?: boolean;
  /**
   * Whether the delete button is shown (canonical prop; superseded by `deletable` only if that is also set).
   * @default true
   */
  delete?: boolean;
  /**
   * Whether the settings button is shown in edit mode.
   * @default true
   */
  settings?: boolean;
  /**
   * Whether the view-cycler button is shown in edit mode.
   * @default false
   */
  viewCycler?: boolean;
  /** Called before the widget is removed when the header's delete button is clicked. */
  onDelete?: () => void;
}

// ============================================================
// DashboardCardHeader Component
// ============================================================

/**
 * A title bar with edit-mode action buttons (view-cycler, settings, delete) for a widget card.
 *
 * An optional standalone header you can render at the top of custom widget content; the built-in
 * {@link DashboardCard} toolbar covers most cases, so reach for this only when composing bespoke
 * card chrome. Must be used within a {@link Dashboard}. Renders `null` in view mode when no `title`
 * is provided (nothing to show); action buttons only appear in edit mode.
 *
 * @param props - see {@link DashboardCardHeaderProps}.
 * @returns The header element, or `null` when there is nothing to display.
 *
 * @example
 * ```tsx
 * import { DashboardCardHeader } from "@dashcraft/core";
 *
 * <DashboardCardHeader id="sales" title="Sales" delete onDelete={() => console.log("removed")} />
 * ```
 *
 * @see {@link DashboardCard}
 */
export const DashboardCardHeader = React.memo(function DashboardCardHeader({
  id,
  title,
  deletable,
  delete: deleteProp = true,
  settings = true,
  viewCycler = false,
  onDelete,
}: DashboardCardHeaderProps): React.JSX.Element | null {
  // Support legacy `deletable` prop with fallback to new `delete` prop
  const canDelete = deletable ?? deleteProp;
  // ==========================================================
  // Context
  // ==========================================================

  const { isEditMode, removeWidget } = useDashboardContext();

  // ==========================================================
  // Event Handlers
  // ==========================================================

  const handleDelete = useCallback(() => {
    onDelete?.();
    removeWidget(id);
  }, [id, onDelete, removeWidget]);

  const handleViewCyclerClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // TODO: Implement view cycling
    },
    []
  );

  const handleSettingsClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // TODO: Open settings panel
    },
    []
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleDelete();
    },
    [handleDelete]
  );

  // ==========================================================
  // Render
  // ==========================================================

  // Only show header in edit mode or if title exists
  if (!isEditMode && !title) {
    return null;
  }

  return (
    <div className="dashcraft-card-header flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      {/* Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-sm font-medium text-gray-700 truncate">
            {title}
          </h3>
        )}
      </div>

      {/* Actions */}
      {isEditMode && (
        <div className="flex items-center gap-1 ml-2">
          {/* View Cycler Button */}
          {viewCycler && (
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              onClick={handleViewCyclerClick}
              title="Cycle views"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Settings Button */}
          {settings && (
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              onClick={handleSettingsClick}
              title="Settings"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}

          {/* Delete Button */}
          {canDelete && (
            <button
              type="button"
              className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
              onClick={handleDeleteClick}
              title="Delete widget"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

DashboardCardHeader.displayName = "DashboardCardHeader";