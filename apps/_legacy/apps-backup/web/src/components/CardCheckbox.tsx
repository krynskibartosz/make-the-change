import React from "react";
import { Check } from "lucide-react";

export type CardCheckboxProps = {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  name?: string;
  icon?: React.ReactNode;
};

export const CardCheckbox: React.FC<CardCheckboxProps> = ({
  title,
  subtitle,
  checked,
  onChange,
  id,
  name,
  icon,
}) => {
  const checkboxId = id ?? `card-checkbox-${name ?? title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer hidden"
      />
      <label
        htmlFor={checkboxId}
        className="block cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm ring-2 ring-transparent transition-all hover:shadow-md peer-checked:border-[var(--brand-primary-start)] peer-checked:ring-2 peer-checked:ring-[var(--brand-primary-start)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {icon && (
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
            )}
            <div>
              <p className="font-semibold text-gray-800">{title}</p>
              {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
            </div>
          </div>
          {/* Indicateur visuel du checkbox (carré au lieu de rond) */}
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 border-gray-300 transition-all peer-checked:border-[var(--brand-primary-start)] peer-checked:bg-[var(--brand-primary-start)]">
            {checked && <Check className="h-3.5 w-3.5 text-white font-bold stroke-[3]" />}
          </div>
        </div>
      </label>
    </div>
  );
};
