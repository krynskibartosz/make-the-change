'use client';

import { useState, useRef, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '@/hooks/use-click-outside';

import type { ReactNode } from 'react';

/**
 * Structure d'une option du CustomSelect
 */
export type SelectOption = {
  value: string;
  title: string;
  subtitle: string;
  icon: ReactNode; // Icône spécifique à l'option
};

/**
 * Props du composant CustomSelect
 */
export type CustomSelectProps = {
  /** Liste des options disponibles */
  options: SelectOption[];
  /** Valeur actuellement sélectionnée */
  value: string;
  /** Callback appelé lors d'un changement de sélection */
  onChange: (value: string) => void;
  /** Nom pour l'input caché (utile pour les formulaires) */
  name: string;
  /** ID unique pour l'input caché et les labels */
  id?: string;
  /** Texte affiché quand aucune option n'est sélectionnée */
  placeholder?: string;
  /** Icône contextuelle affichée à gauche du bouton */
  contextIcon: ReactNode;
  /** Classe CSS personnalisée pour le wrapper */
  className?: string;
  /** Désactiver le select */
  disabled?: boolean;
  /** Label optionnel affiché au-dessus */
  label?: string;
};

/**
 * CustomSelect - Composant de sélection premium
 *
 * Remplace les <select> natifs avec un design entièrement customisé,
 * en harmonie avec le design system "Make the CHANGE".
 *
 * Caractéristiques :
 * - Options riches avec icône, titre et sous-titre
 * - Icône contextuelle globale
 * - Navigation clavier complète
 * - Fermeture automatique au clic extérieur
 * - Input caché pour compatibilité formulaires
 * - ARIA complet pour accessibilité
 * - Dark mode automatique
 *
 * @example
 * ```tsx
 * <CustomSelect
 *   name="project_type"
 *   id="project-type"
 *   contextIcon={<Globe />}
 *   options={[
 *     {
 *       value: 'ruche',
 *       title: 'Protéger une ruche',
 *       subtitle: 'Soutien à l\'apiculture locale',
 *       icon: <Sparkles />
 *     }
 *   ]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 *   placeholder="Choisir un projet..."
 * />
 * ```
 */
export function CustomSelect({
  options,
  value,
  onChange,
  name,
  id: providedId,
  placeholder = 'Choisir une option...',
  contextIcon,
  className = '',
  disabled = false,
  label,
}: CustomSelectProps) {
  // États
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);

  // ID unique pour les attributs ARIA
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const buttonId = `${id}-button`;
  const listboxId = `${id}-listbox`;

  // Option actuellement sélectionnée
  const selectedOption = options.find((opt) => opt.value === value);

  // Fermeture au clic extérieur
  useClickOutside(wrapperRef as React.RefObject<HTMLElement>, () => setIsOpen(false), isOpen);

  /**
   * Toggle l'ouverture/fermeture de la liste
   */
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setFocusedIndex(-1);
  };

  /**
   * Sélectionne une option
   */
  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setFocusedIndex(-1);
    // Remettre le focus sur le bouton après sélection
    buttonRef.current?.focus();
  };

  /**
   * Gestion de la navigation clavier
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && options[focusedIndex]) {
          handleSelect(options[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
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

      case 'Tab':
        // Fermer le dropdown au Tab
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
    }
  };

  /**
   * Scroll automatique vers l'option focalisée
   */
  const scrollToFocusedOption = (index: number) => {
    if (!optionsRef.current) return;

    const optionElements = optionsRef.current.querySelectorAll('li');
    const focusedElement = optionElements[index];

    if (focusedElement) {
      focusedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  };

  // Scroll vers l'option focalisée quand focusedIndex change
  if (isOpen && focusedIndex >= 0) {
    scrollToFocusedOption(focusedIndex);
  }

  return (
    <div ref={wrapperRef} className={`custom-select-wrapper ${className}`}>
      {/* Label optionnel */}
      {label && (
        <label htmlFor={buttonId} className="form-label mb-2 block">
          {label}
        </label>
      )}

      {/* Wrapper avec icône de contexte */}
      <div className="input-wrapper">
        {/* Icône de contexte (à gauche) */}
        <div className="custom-select-context-icon" aria-hidden="true">
          {contextIcon}
        </div>

        {/* Bouton de sélection */}
        <button
          ref={buttonRef}
          type="button"
          id={buttonId}
          className="custom-select-button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? undefined : buttonId}
          aria-controls={listboxId}
          disabled={disabled}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
        >
          {/* Valeur sélectionnée ou placeholder */}
          <span id="selected-value">
            {selectedOption ? selectedOption.title : placeholder}
          </span>

          {/* Flèche chevron */}
          <ChevronDown className="custom-select-arrow" aria-hidden="true" />
        </button>
      </div>

      {/* Liste déroulante des options */}
      {isOpen && !disabled && (
        <ul
          ref={optionsRef}
          id={listboxId}
          className="custom-select-options"
          role="listbox"
          aria-labelledby={buttonId}
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`custom-select-option ${
                option.value === value ? 'selected' : ''
              } ${focusedIndex === index ? 'focused' : ''}`}
              role="option"
              aria-selected={option.value === value}
              data-value={option.value}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {/* Icône de l'option */}
              <div className="option-icon" aria-hidden="true">
                {option.icon}
              </div>

              {/* Bloc de texte (titre + sous-titre) */}
              <div className="option-content">
                <span className="option-title">{option.title}</span>
                <span className="option-subtitle">{option.subtitle}</span>
              </div>

              {/* Icône checkmark (visible uniquement si sélectionné) */}
              <Check className="checkmark-icon" aria-hidden="true" />
            </li>
          ))}
        </ul>
      )}

      {/* Input caché pour la gestion des formulaires */}
      <input type="hidden" name={name} id={id} value={value} />
    </div>
  );
}
