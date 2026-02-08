'use client';

import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import type { SupportedLanguage } from '@make-the-change/shared';

import type { EnrichedSpeciesData } from '../types/species-form.types';

export type TranslationContextValue = {
  currentLanguage: SupportedLanguage;
  setCurrentLanguage: (lang: SupportedLanguage) => void;
  translationCompletion: Record<SupportedLanguage, number>;
};

const TranslationContext = createContext<TranslationContextValue | undefined>(
  undefined
);

type TranslationProviderProps = {
  species: EnrichedSpeciesData;
} & PropsWithChildren;

const calculateTranslationCompletion = (
  species: EnrichedSpeciesData,
  language: SupportedLanguage
): number => {
  const translations = species.translations?.[language];
  if (!translations) return 0;

  const fields = ['name', 'description', 'scientific_name'];
  const completedFields = fields.filter(
    field => translations[field as keyof typeof translations] != null
  );

  return Math.round((completedFields.length / fields.length) * 100);
};

export const TranslationProvider: FC<TranslationProviderProps> = ({
  species,
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr');

  const translationCompletion = {
    fr: 100,
    en: calculateTranslationCompletion(species, 'en'),
    nl: calculateTranslationCompletion(species, 'nl'),
  };

  return (
    <TranslationContext.Provider
      value={{ currentLanguage, setCurrentLanguage, translationCompletion }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      'useTranslationContext must be used within a TranslationProvider'
    );
  }
  return context;
};