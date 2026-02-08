import React from "react";

export type CheckboxOption = {
  value: string;
  title: string;
  subtitle: string;
};

export type CardCheckboxGroupProps = {
  legend: string;
  options: CheckboxOption[];
  name: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
};

export const CardCheckboxGroup: React.FC<CardCheckboxGroupProps> = ({
  legend,
  options,
  name,
  selectedValues,
  onChange,
}) => {
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <fieldset>
      <legend className="form-label">{legend}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {options.map((option) => (
          <div key={option.value}>
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="peer hidden"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="block cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm ring-2 ring-transparent transition-all hover:shadow-md peer-checked:border-[var(--brand-primary-start)] peer-checked:ring-2 peer-checked:ring-[var(--brand-primary-start)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{option.title}</p>
                  <span className="text-sm text-gray-500">{option.subtitle}</span>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 transition-all peer-checked:border-[var(--brand-primary-start)] peer-checked:bg-[var(--brand-primary-start)]">
                  {/* Coche visuelle */}
                  <svg
                    className={`h-4 w-4 text-white transition-all ${selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M5 10l4 4 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
