'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@make-the-change/core/shared/utils';

import type { InputHTMLAttributes, ReactNode, ForwardedRef } from 'react';

export type InputV2State = 'default' | 'error' | 'success';

export type InputV2Props = {
  label?: string;
  error?: string;
  helpText?: string;
  leadingIcon?: ReactNode;
  state?: InputV2State;
} & InputHTMLAttributes<HTMLInputElement>;

/**
 * Input Component - Design System v2.0
 *
 * Spécifications :
 * - Hauteur : 52px
 * - Border radius : 14px
 * - Focus ring : Jaune/Or (#FBBF24)
 * - Support icône à gauche
 * - États : default, error, success
 * - Messages d'erreur accessibles (aria-describedby)
 *
 * Exemple :
 * <InputV2
 *   label="Adresse e-mail"
 *   type="email"
 *   required
 *   leadingIcon={<Mail />}
 *   error="Veuillez entrer une adresse e-mail valide."
 * />
 */
const InputV2 = forwardRef<HTMLInputElement, InputV2Props>(
  (
    {
      className,
      type,
      label,
      error,
      helpText,
      leadingIcon,
      state = 'default',
      required,
      ...props
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const inputId = useId();
    const ariaDescribedBy = error
      ? `${inputId}-error`
      : (helpText
        ? `${inputId}-help`
        : undefined);

    // Determine state from props
    const computedState = error ? 'error' : state;

    // State-specific classes
    const stateClasses = {
      default: '',
      error: 'input-error',
      success: 'input-success',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="form-label"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="input-wrapper">
          {leadingIcon && (
            <div className="input-icon">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error ? 'true' : undefined}
            aria-required={required ? 'true' : undefined}
            id={inputId}
            type={type}
            required={required}
            className={cn(
              'form-input',
              stateClasses[computedState],
              !leadingIcon && 'pl-4', // Remove left padding if no icon
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="error-message"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helpText && (
          <p
            id={`${inputId}-help`}
            className="help-text"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

InputV2.displayName = 'InputV2';

export { InputV2 };
