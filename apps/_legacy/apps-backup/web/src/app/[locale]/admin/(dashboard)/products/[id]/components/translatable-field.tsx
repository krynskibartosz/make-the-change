'use client';

import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { SupportedLanguage } from '@make-the-change/shared';

import { useTranslation } from '../contexts/translation-context';
import type { ProductFormData } from '../types/product-form.types';

/**
 * Hook for managing translatable form fields with React Hook Form
 *
 * Handles:
 * - Base language (FR) values from form state
 * - Translation language (EN/NL) values from translation context
 * - Auto-save on blur
 *
 * @param fieldName - Name of the translatable field (e.g., 'name', 'description')
 * @param onBlurSave - Optional callback to trigger save on blur
 */
export function useTranslatableField(
  fieldName: keyof ProductFormData,
  onBlurSave?: () => void
) {
  const { control, setValue } = useFormContext<ProductFormData>();
  const {
    currentLanguage,
    translations,
    setFieldTranslation,
  } = useTranslation();

  // Watch form value (for base language FR)
  const formValue = useWatch({ control, name: fieldName }) as string | undefined;

  // Get current value based on language
  const value = useMemo(() => {
    if (currentLanguage === 'fr') {
      return formValue ?? '';
    }
    // For EN/NL, get from translation context
    return translations[fieldName as string]?.[currentLanguage] ?? '';
  }, [currentLanguage, fieldName, formValue, translations]);

  // Handle value change
  const onChange = useCallback((newValue: string) => {
    if (currentLanguage === 'fr') {
      // Update form state for base language
      setValue(fieldName, newValue as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      // Update translation context for other languages
      setFieldTranslation(fieldName as string, currentLanguage, newValue);
    }
  }, [currentLanguage, fieldName, setValue, setFieldTranslation]);

  // Handle blur
  const onBlur = useCallback(() => {
    if (onBlurSave) {
      onBlurSave();
    }
  }, [onBlurSave]);

  const isBaseLang = currentLanguage === 'fr';

  return {
    value,
    onChange,
    onBlur,
    isBaseLang,
    language: currentLanguage as SupportedLanguage,
  };
}
