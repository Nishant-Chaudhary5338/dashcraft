import React, { useCallback } from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import type { CustomFieldConfig } from "../../types";

// ============================================================
// Props
// ============================================================

/**
 * Props for {@link SettingsCustomFields}.
 */
export interface SettingsCustomFieldsProps {
  /** Map of field key → its {@link CustomFieldConfig} (type, label, and type-specific constraints like min/max/options).
   * Keyed by the same field name used in `values` and passed back to `onChange`. */
  fields: Record<string, CustomFieldConfig>;
  /** Current value for every settings key, including but not limited to custom fields — each field reads `values[key]`,
   * falling back to `fields[key].default` when unset. */
  values: Record<string, unknown>;
  /** Called with the field's key and its new value whenever any custom field control changes. */
  onChange: (key: string, value: unknown) => void;
}

// ============================================================
// Component
// ============================================================

/**
 * Renders a dynamic list of widget-specific settings controls driven entirely
 * by a `fields` config map, so widget authors can add custom settings
 * (numbers, sliders, colors, toggles, selects, free text) without writing
 * dedicated Settings UI. Renders nothing when `fields` is empty.
 *
 * Each entry's `type` (see {@link CustomFieldConfig}) selects the control:
 * `"text"` → text input, `"number"` → number input (respects `min`/`max`/`step`),
 * `"boolean"` → switch, `"select"` → dropdown of `options`, `"color"` → native
 * color input, `"slider"` → Radix slider (respects `min`/`max`/`step`).
 *
 * @example
 * ```tsx
 * import { SettingsCustomFields } from "@dashcraft/core";
 *
 * <SettingsCustomFields
 *   fields={{ refreshLabel: { type: "text", label: "Refresh Label" } }}
 *   values={{ refreshLabel: "Live" }}
 *   onChange={(key, value) => updateSettings({ [key]: value })}
 * />
 * ```
 *
 * @see {@link SettingsPanel} for the container that composes this section.
 */
export const SettingsCustomFields = React.memo(
  function SettingsCustomFields({
    fields,
    values,
    onChange,
  }: SettingsCustomFieldsProps): React.JSX.Element | null {
    const fieldEntries = Object.entries(fields);

    if (fieldEntries.length === 0) {
      return null;
    }

    return (
      <>
        {fieldEntries.map(([key, config]) => (
          <CustomFieldItem
            key={key}
            fieldKey={key}
            config={config}
            value={values[key]}
            onChange={onChange}
          />
        ))}
      </>
    );
  }
);

SettingsCustomFields.displayName = "SettingsCustomFields";

// ============================================================
// CustomFieldItem Component
// ============================================================

/**
 * Props for the internal {@link CustomFieldItem} renderer (not exported —
 * one is rendered per entry of {@link SettingsCustomFieldsProps.fields}).
 */
interface CustomFieldItemProps {
  /** The settings key this field controls. */
  fieldKey: string;
  /** Field configuration determining which control renders and its constraints. */
  config: CustomFieldConfig;
  /** Current value for this field; falls back to `config.default` when `undefined`. */
  value: unknown;
  /** Called with `(fieldKey, newValue)` when the rendered control changes. */
  onChange: (key: string, value: unknown) => void;
}

/**
 * Renders a single labeled control for one custom field, chosen by
 * `config.type`. Internal helper for {@link SettingsCustomFields} — not part
 * of the public API.
 */
const CustomFieldItem = React.memo(function CustomFieldItem({
  fieldKey,
  config,
  value,
  onChange,
}: CustomFieldItemProps): React.JSX.Element {
  const handleChange = useCallback(
    (newValue: unknown) => {
      onChange(fieldKey, newValue);
    },
    [fieldKey, onChange]
  );

  const renderField = (): React.ReactNode => {
    const currentValue = value ?? config.default;

    switch (config.type) {
      case "text":
        return (
          <input
            type="text"
            value={(currentValue as string) ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={config.label}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={(currentValue as number) ?? ""}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={config.min}
            max={config.max}
            step={config.step}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );

      case "boolean":
        return (
          <Switch.Root
            checked={(currentValue as boolean) ?? false}
            onCheckedChange={handleChange}
            className="w-9 h-5 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
          >
            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-4" />
          </Switch.Root>
        );

      case "select":
        return (
          <select
            value={(currentValue as string) ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {config.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "color":
        return (
          <input
            type="color"
            value={(currentValue as string) ?? "#000000"}
            onChange={(e) => handleChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
        );

      case "slider": {
        const sliderMin = config.min ?? 0;
        const sliderMax = config.max ?? 100;
        const sliderStep = config.step ?? 1;
        return (
          <Slider.Root
            value={[(currentValue as number) ?? sliderMin]}
            onValueChange={(vals) => handleChange(vals[0])}
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            className="relative flex items-center select-none touch-none w-full h-5"
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Slider.Root>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {config.label}
      </label>
      {renderField()}
    </div>
  );
});

CustomFieldItem.displayName = "CustomFieldItem";