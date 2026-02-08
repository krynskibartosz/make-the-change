import React from "react";

export type RadioOption = {
  value: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
};

export type CardRadioGroupProps = {
  legend?: string;
  options: RadioOption[];
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
};

export const CardRadioGroup: React.FC<CardRadioGroupProps> = ({
  legend,
  options,
  name,
  selectedValue,
  onChange,
}) => (
  <div role="group" aria-label={legend}>
    {legend && <div className="form-label mb-2">{legend}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option) => {
        const isChecked = selectedValue === option.value;
        return (
          <div key={option.value}>
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => onChange(option.value)}
              className="peer hidden"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="block cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm ring-2 ring-transparent transition-all hover:shadow-md peer-checked:border-[var(--brand-primary-start)] peer-checked:ring-2 peer-checked:ring-[var(--brand-primary-start)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {option.icon && (
                    <div className="flex-shrink-0 mt-0.5">{option.icon}</div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{option.title}</p>
                    <span className="text-sm text-gray-500">{option.subtitle}</span>
                  </div>
                </div>
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 transition-all peer-checked:border-[var(--brand-primary-start)] peer-checked:bg-[var(--brand-primary-start)]">
                  {isChecked && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </label>
          </div>
        );
      })}
    </div>
  </div>
);
