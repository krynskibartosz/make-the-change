'use client';

import { type FC, type ChangeEvent } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

export type ToggleCardProps = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  isChecked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

/**
 * ToggleCard Component
 *
 * Carte interactive avec toggle switch pour remplacer les checkboxes standards.
 * Utilise la technique `peer` de Tailwind pour styler la carte en fonction de l'état du checkbox.
 *
 * @example
 * ```tsx
 * <ToggleCard
 *   id="featured"
 *   label="Projet mis en avant"
 *   description="Afficher dans les projets mis en avant"
 *   icon={<Star className="h-6 w-6" />}
 *   isChecked={featured}
 *   onChange={(e) => setFeatured(e.target.checked)}
 * />
 * ```
 */
export const ToggleCard: FC<ToggleCardProps> = ({
  id,
  label,
  description,
  icon,
  isChecked,
  onChange,
  className,
}) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        // Structure de base
        'flex cursor-pointer items-center justify-between rounded-xl border p-4 shadow-sm ring-2 ring-transparent transition-all',
        // État par défaut
        'border-gray-200 bg-white',
        // État hover
        'hover:shadow-md',
        // État checked via peer
        'has-[:checked]:border-[var(--brand-primary-start)] has-[:checked]:ring-[var(--brand-primary-start)]/10',
        className
      )}
    >
      {/* Checkbox caché utilisant la classe peer */}
      <input
        checked={isChecked}
        className="peer sr-only"
        id={id}
        type="checkbox"
        onChange={onChange}
      />

      {/* Contenu textuel et icône */}
      <div className="flex items-center gap-3">
        {icon && (
          <div className="transition-colors duration-300 peer-checked:text-amber-500">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          <p className="font-semibold text-gray-800">{label}</p>
          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
      </div>

      {/* Toggle Switch visuel */}
      <div
        className={cn(
          'relative h-7 w-12 rounded-full transition-all duration-300 ease-in-out',
          // État par défaut
          'bg-gray-200',
          // État checked
          'peer-checked:bg-gradient-to-r peer-checked:from-[var(--brand-primary-start)] peer-checked:to-[var(--brand-primary-end)]'
        )}
      >
        <div
          className={cn(
            'absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out',
            // Translation quand checked
            'peer-checked:translate-x-5'
          )}
        />
      </div>
    </label>
  );
};
