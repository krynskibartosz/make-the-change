import { forwardRef } from 'react';
import { cn } from '@make-the-change/core/shared/utils';

import type { ButtonHTMLAttributes, ReactNode, ForwardedRef } from 'react';

export type ButtonV2Variant = 'primary' | 'secondary' | 'accent';
export type ButtonV2Size = 'default' | 'sm' | 'lg';

export type ButtonV2Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonV2Variant;
  size?: ButtonV2Size;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
};

/**
 * Button Component - Design System v2.0
 *
 * Trois variantes principales :
 * - primary : Gradient Bleu → Turquoise
 * - secondary : Bordure gradient, fond blanc
 * - accent : Gradient Jaune → Or
 *
 * Spécifications :
 * - Hauteur : 52px (default)
 * - Border radius : 14px
 * - Font : 16px / 700 (bold)
 * - Hover : translateY(-2px) + shadow lift
 */
const ButtonV2 = forwardRef<HTMLButtonElement, ButtonV2Props>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      loading = false,
      loadingText,
      disabled,
      children,
      icon,
      fullWidth = false,
      ...props
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const isDisabled = disabled ?? loading;

    // Size classes
    const sizeClasses = {
      default: 'h-[52px] px-8 text-base',
      sm: 'h-10 px-4 text-sm [border-radius:12px]',
      lg: 'h-16 px-12 text-lg [border-radius:16px]',
    };

    // Variant classes (using utility classes from globals.css)
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
    };

    return (
      <button
        ref={ref}
        aria-disabled={isDisabled ? 'true' : undefined}
        className={cn(
          // Base styles
          'btn',
          'inline-flex items-center justify-center gap-2',
          'font-bold transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          '[&_svg]:size-5 [&_svg]:shrink-0',

          // Variant-specific
          variantClasses[variant],

          // Size-specific
          sizeClasses[size],

          // Full width
          fullWidth && 'w-full',

          // Focus ring color based on variant
          variant === 'accent'
            ? 'focus-visible:ring-[#FBBF24]'
            : 'focus-visible:ring-[#3B82F6]',

          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{loadingText ?? children}</span>
          </div>
        ) : (
          <>
            {icon && <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </button>
    );
  }
);

ButtonV2.displayName = 'ButtonV2';

export { ButtonV2 };
