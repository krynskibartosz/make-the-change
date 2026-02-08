'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@make-the-change/core/shared/utils';

import type { ReactNode } from 'react';

export type CustomSelectOption = {
  value: string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
};

export type CustomSelectV2Props = {
  label?: string;
  options: CustomSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * CustomSelect Component - Design System v2.0
 *
 * Un composant de sélection personnalisé, riche et accessible
 * qui remplace le <select> natif.
 *
 * Spécifications :
 * - Hauteur : 52px (trigger)
 * - Border radius : 14px
 * - Options avec icône, titre, sous-titre
 * - Checkmark pour l'option sélectionnée
 * - Accessible (clavier, aria)
 *
 * Exemple :
 * <CustomSelectV2
 *   label="Choisissez un projet"
 *   options={[
 *     { value: 'ruche', label: 'Protéger une ruche', subtitle: 'Soutien à l\'apiculture locale', icon: <Bee /> },
 *     { value: 'arbre', label: 'Planter un arbre', subtitle: 'Reforestation durable', icon: <Tree /> }
 *   ]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 * />
 */
export function CustomSelectV2({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionnez une option',
  className,
  disabled = false,
}: CustomSelectV2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          onChange?.(options[focusedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case 'Home':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(0);
        }
        break;
      case 'End':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(options.length - 1);
        }
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={cn('custom-select-wrapper', className)}>
      {label && (
        <label className="form-label mb-2 block">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? undefined : 'select-label'}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <span className="option-icon flex-shrink-0">
              {selectedOption.icon}
            </span>
          )}
          <span className={cn(!selectedOption && 'text-muted-foreground')}>
            {selectedOption?.label ?? placeholder}
          </span>
        </div>

        <ChevronDown className="custom-select-chevron" />
      </button>

      {isOpen && !disabled && (
        <ul
          ref={optionsRef}
          className="custom-select-options"
          role="listbox"
          aria-labelledby={label ? undefined : 'select-label'}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={cn(
                'custom-select-option',
                focusedIndex === index && 'ring-2 ring-primary/30'
              )}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleOptionClick(option.value)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option.icon && (
                <span className="option-icon">
                  {option.icon}
                </span>
              )}

              <div className="option-content">
                <span className="option-title">{option.label}</span>
                {option.subtitle && (
                  <span className="option-subtitle">{option.subtitle}</span>
                )}
              </div>

              <Check className="checkmark-icon" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
