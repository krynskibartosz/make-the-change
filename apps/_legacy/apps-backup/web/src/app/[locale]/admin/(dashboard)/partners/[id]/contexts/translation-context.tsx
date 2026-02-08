'use client';

import { createContext, useContext, useState, useCallback, useMemo, type FC, type PropsWithChildren } from 'react';
import { type SupportedLanguage, SUPPORTED_LANGUAGES } from '@make-the-change/shared';
import type { Translation } from '@make-the-change/shared';

// ============================================================================
// Types
// ============================================================================

export interface TranslationData {
  [fieldName: string]: {
    fr: string;
    en: string;
    nl: string;
  };
}

export interface TranslationContextValue {
  // Current active language
  currentLanguage: SupportedLanguage;
  setCurrentLanguage: (lang: SupportedLanguage) => void;

  // Translation data management
  translations: TranslationData;
  setTranslation: (fieldName: string, language: SupportedLanguage, value: string) => void;
  getTranslationValue: (fieldName: string) => string;

  // Completion tracking
  translationCompletion: Record<SupportedLanguage, number>;
  translatableFields: string[];

  // Utilities
  isDirty: boolean;
  markDirty: () => void;
  clearDirty: () => void;
}

// ============================================================================
// Context
// ============================================================================

const TranslationContext = createContext<TranslationContextValue | null>(null);

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within TranslationProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

interface TranslationProviderProps extends PropsWithChildren {
  initialTranslations?: Translation[];
  translatableFields: string[];
  defaultValues: Record<string, string>;
}

export const TranslationProvider: FC<TranslationProviderProps> = ({
  children,
  initialTranslations = [],
  translatableFields,
  defaultValues,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr');
  const [isDirty, setIsDirty] = useState(false);

  // Build translation data structure from initial translations
  const [translations, setTranslations] = useState<TranslationData>(() => {
    const data: TranslationData = {};

    translatableFields.forEach((fieldName) => {
      // Initialize with French value from defaultValues
      data[fieldName] = {
        fr: defaultValues[fieldName] || '',
        en: '',
        nl: '',
      };

      // Populate from initial translations (EN/NL only)
      initialTranslations.forEach((t) => {
        if (t.field_name === fieldName && t.language !== 'fr' && (t.language === 'en' || t.language === 'nl')) {
          if (data[fieldName]) {
            data[fieldName][t.language] = t.value;
          }
        }
      });
    });

    console.log('[TranslationProvider - Partners] Initial translations:', data);
    return data;
  });

  // Update field translation
  const setTranslation = useCallback((fieldName: string, language: SupportedLanguage, value: string) => {
    console.log(`[TranslationContext - Partners] setTranslation: ${fieldName} [${language}] = "${value}"`);

    setTranslations((prev) => {
      // Only update if value actually changed
      if (prev[fieldName]?.[language] === value) {
        console.log(`[TranslationContext - Partners] No change detected, skipping update`);
        return prev;
      }

      const updated: TranslationData = {
        ...prev,
        [fieldName]: {
          fr: prev[fieldName]?.fr ?? '',
          en: prev[fieldName]?.en ?? '',
          nl: prev[fieldName]?.nl ?? '',
          [language]: value,
        },
      };

      console.log(`[TranslationContext - Partners] Updated translations for ${fieldName}:`, updated[fieldName]);
      return updated;
    });
    setIsDirty(true);
  }, []);

  // Get field translation value for current language
  const getTranslationValue = useCallback(
    (fieldName: string): string => {
      const value = translations[fieldName]?.[currentLanguage] || '';
      console.log(`[TranslationContext - Partners] getTranslationValue: ${fieldName} [${currentLanguage}] = "${value}"`);
      return value;
    },
    [translations, currentLanguage]
  );

  // Calculate completion percentage
  const translationCompletion = useMemo(() => {
    const completion: Record<SupportedLanguage, number> = {
      fr: 100, // French is always 100% (base language)
      en: 0,
      nl: 0,
    };

    SUPPORTED_LANGUAGES.forEach((lang) => {
      if (lang === 'fr') return;

      const translatedCount = translatableFields.filter((field) => {
        const value = translations[field]?.[lang];
        return value && value.trim().length > 0;
      }).length;

      completion[lang] = Math.round((translatedCount / translatableFields.length) * 100);
    });

    return completion;
  }, [translations, translatableFields]);

  const value: TranslationContextValue = {
    currentLanguage,
    setCurrentLanguage,
    translations,
    setTranslation,
    getTranslationValue,
    translationCompletion,
    translatableFields,
    isDirty,
    markDirty: () => setIsDirty(true),
    clearDirty: () => setIsDirty(false),
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};
