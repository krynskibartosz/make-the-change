'use client';

import { type FC, useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { type SupportedLanguage, LANGUAGE_FLAGS, LANGUAGE_NAMES } from '@make-the-change/shared';
import { cn } from '@make-the-change/core/shared/utils';

interface TranslationContextValue {
  currentLanguage: SupportedLanguage;
  setCurrentLanguage: (lang: SupportedLanguage) => void;
  translationCompletion: Record<SupportedLanguage, number>;
}

interface LanguageSwitcherProps {
  translationContext: TranslationContextValue;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ translationContext }) => {
  const { currentLanguage, setCurrentLanguage, translationCompletion } = translationContext;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return undefined;
  }, [isOpen]);

  const languages: SupportedLanguage[] = ['fr', 'en', 'nl'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Compact on mobile, full on desktop */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-50',
          'dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700',
          isOpen && 'bg-neutral-50 dark:bg-neutral-700'
        )}
      >
        <Globe className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        <span className="flex items-center gap-1.5">
          <span>{LANGUAGE_FLAGS[currentLanguage]}</span>
          {/* Hide language name on mobile, show on desktop */}
          <span className="hidden sm:inline">{LANGUAGE_NAMES[currentLanguage]}</span>
        </span>
        <svg
          className={cn('h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          <div className="p-2">
            <div className="mb-2 px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Choisir la langue
            </div>

            {languages.map((lang) => {
              const completion = translationCompletion[lang];
              const isActive = currentLanguage === lang;

              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setCurrentLanguage(lang);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
                    <span className="font-medium">{LANGUAGE_NAMES[lang]}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Completion Badge */}
                    {lang !== 'fr' && (
                      <span
                        className={cn(
                          'rounded px-2 py-0.5 text-xs font-medium',
                          completion === 100
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : completion > 0
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        )}
                      >
                        {completion}%
                      </span>
                    )}

                    {lang === 'fr' && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Base
                      </span>
                    )}

                    {/* Active Checkmark */}
                    {isActive && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Footer */}
          <div className="border-t border-neutral-100 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <p>Le français est la langue par défaut</p>
          </div>
        </div>
      )}
    </div>
  );
};
