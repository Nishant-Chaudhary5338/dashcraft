import React, { useCallback } from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import type { CustomFieldConfig } from "../../types";

// ============================================================
// Props
// ============================================================

export interface SettingsCustomFieldsProps {
  fields: Record<string, CustomFieldConfig>;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

// ============================================================
// Component
// ============================================================

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

interface CustomFieldItemProps {
  fieldKey: string;
  config: CustomFieldConfig;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}

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