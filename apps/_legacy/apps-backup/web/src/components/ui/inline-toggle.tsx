'use client';

import * as Switch from '@radix-ui/react-switch';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

export type InlineToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

/**
 * InlineToggle Component
 *
 * Interrupteur simple (switch) avec le dégradé de marque "Make the CHANGE".
 * Utilise Radix UI Switch pour l'accessibilité et les interactions.
 *
 * @example
 * ```tsx
 * <InlineToggle
 *   checked={isVisible}
 *   onCheckedChange={setIsVisible}
 *   aria-label="Basculer la visibilité"
 * />
 * ```
 */
export const InlineToggle: FC<InlineToggleProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}) => {
  return (
    <Switch.Root
      aria-label={ariaLabel}
      checked={checked}
      disabled={disabled}
      className={cn(
        // Structure de base
        'relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-all duration-300',
        // Focus state
        'focus-visible:ring-2 focus-visible:ring-[var(--brand-primary-start)] focus-visible:ring-offset-2 focus-visible:outline-none',
        // État désactivé
        'disabled:cursor-not-allowed disabled:opacity-50',
        // État non-checked (gris)
        'data-[state=unchecked]:bg-gray-200',
        // État checked (dégradé de marque)
        'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[var(--brand-primary-start)] data-[state=checked]:to-[var(--brand-primary-end)]',
        // Dark mode
        'dark:data-[state=unchecked]:bg-gray-600',
        className
      )}
      onCheckedChange={onCheckedChange}
    >
      <Switch.Thumb
        className={cn(
          // Cercle blanc mobile
          'pointer-events-none block h-3 w-3 rounded-full bg-white shadow-sm ring-0 transition-transform duration-300',
          // Position selon l'état
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1'
        )}
      />
    </Switch.Root>
  );
};
