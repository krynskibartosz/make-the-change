'use client';

import { type FC } from 'react';
import { Globe } from 'lucide-react';
import { type SupportedLanguage } from '@make-the-change/shared';

interface TranslationContextValue {
  currentLanguage: SupportedLanguage;
  translations: Record<string, { fr: string; en: string; nl: string }>;
  translationCompletion: Record<SupportedLanguage, number>;
}

interface TranslatableFieldProps {
  fieldName: string;
  translationContext: TranslationContextValue;
}

/**
 * TranslatableField Component
 *
 * Small indicator component that shows the current language being edited
 * for a translatable field. Used inline with form labels.
 */
export const TranslatableField: FC<TranslatableFieldProps> = ({
  fieldName,
  translationContext,
}) => {
  const { currentLanguage, translations } = translationContext;

  // Don't show indicator for base language (French)
  if (currentLanguage === 'fr') {
    return null;
  }

  // Check if field has translation for current language
  const hasTranslation = Boolean(
    translations[fieldName]?.[currentLanguage]?.trim()
  );

  return (
    <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
      <Globe className="h-3 w-3" />
      <span className="uppercase">{currentLanguage}</span>
      {hasTranslation && (
        <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          ✓
        </span>
      )}
    </span>
  );
};
