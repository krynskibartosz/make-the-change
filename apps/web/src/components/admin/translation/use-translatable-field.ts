'use client'

import type { Locale } from '@make-the-change/core/i18n'
import { useCallback, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { useTranslation } from './translation-context'

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
export function useTranslatableField<T extends Record<string, unknown>>(
  fieldName: keyof T & string,
  onBlurSave?: () => void,
) {
  const { setValue, control } = useFormContext<T>()
  const { currentLanguage, translations, setFieldTranslation } = useTranslation()

  // Watch form value (for base language FR)
  // biome-ignore lint/suspicious/noExplicitAny: React Hook Form types are complex
  const formValue = useWatch({ control, name: fieldName as any }) as string | undefined

  // Get current value based on language
  const value = useMemo(() => {
    if (currentLanguage === 'fr') {
      return formValue ?? ''
    }
    // For EN/NL, get from translation context
    return translations[fieldName]?.[currentLanguage] ?? ''
  }, [currentLanguage, fieldName, formValue, translations])

  // Handle value change
  const onChange = useCallback(
    (newValue: string) => {
      if (currentLanguage === 'fr') {
        // Update form state for base language
        // biome-ignore lint/suspicious/noExplicitAny: React Hook Form types are complex
        setValue(fieldName as any, newValue as any, {
          shouldValidate: true,
          shouldDirty: true,
        })
      } else {
        // Update translation context for other languages
        setFieldTranslation(fieldName, currentLanguage, newValue)
      }
    },
    [currentLanguage, fieldName, setValue, setFieldTranslation],
  )

  // Handle blur
  const onBlur = useCallback(() => {
    if (onBlurSave) {
      onBlurSave()
    }
  }, [onBlurSave])

  const isBaseLang = currentLanguage === 'fr'

  return {
    value,
    onChange,
    onBlur,
    isBaseLang,
    language: currentLanguage as Locale,
  }
}

/**
 * Hook for managing translatable form fields in controlled mode (without React Hook Form)
 */
export function useTranslatableFieldControlled(
  fieldName: string,
  baseValue: string,
  onBaseChange: (val: string) => void,
  onBlurSave?: () => void,
) {
  const { currentLanguage, translations, setFieldTranslation } = useTranslation()

  // Get current value based on language
  const value = useMemo(() => {
    if (currentLanguage === 'fr') {
      return baseValue ?? ''
    }
    // For EN/NL, get from translation context
    return translations[fieldName]?.[currentLanguage] ?? ''
  }, [currentLanguage, fieldName, baseValue, translations])

  // Handle value change
  const onChange = useCallback(
    (newValue: string) => {
      if (currentLanguage === 'fr') {
        onBaseChange(newValue)
      } else {
        setFieldTranslation(fieldName, currentLanguage, newValue)
      }
    },
    [currentLanguage, fieldName, onBaseChange, setFieldTranslation],
  )

  // Handle blur
  const onBlur = useCallback(() => {
    if (onBlurSave) {
      onBlurSave()
    }
  }, [onBlurSave])

  const isBaseLang = currentLanguage === 'fr'

  return {
    value,
    onChange,
    onBlur,
    isBaseLang,
    language: currentLanguage as Locale,
  }
}
