'use client'

import { type Locale, locales } from '@make-the-change/core/i18n'
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

// ============================================================================
// Types
// ============================================================================

export interface Translation {
  field_name: string
  language: string
  value: string
}

export interface TranslationData {
  [fieldName: string]: {
    [key in Locale]?: string
  }
}

export interface TranslationContextValue {
  // Current active language
  currentLanguage: Locale
  setCurrentLanguage: (lang: Locale) => void

  // Translation data management
  translations: TranslationData
  setFieldTranslation: (fieldName: string, language: Locale, value: string) => void
  getFieldTranslation: (fieldName: string, language: Locale) => string

  // Completion tracking
  translationCompletion: Record<Locale, number>
  translatableFields: string[]

  // Utilities
  isDirty: boolean
  markDirty: () => void
  clearDirty: () => void
}

// ============================================================================
// Context
// ============================================================================

const TranslationContext = createContext<TranslationContextValue | null>(null)

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return context
}

// ============================================================================
// Provider
// ============================================================================

interface TranslationProviderProps extends PropsWithChildren {
  initialTranslations?: TranslationData
  translatableFields: string[]
  defaultValues: Record<string, unknown>
  onTranslationChange?: (translations: TranslationData) => void
}

export const TranslationProvider: FC<TranslationProviderProps> = ({
  children,
  initialTranslations = {},
  translatableFields,
  defaultValues,
  onTranslationChange,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Locale>('fr')
  const [isDirty, setIsDirty] = useState(false)

  // Build translation data structure from initial translations
  const [translations, setTranslations] = useState<TranslationData>(() => {
    const data: TranslationData = {}

    translatableFields.forEach((fieldName) => {
      // Initialize with French value from defaultValues
      data[fieldName] = {
        fr: (defaultValues[fieldName] as string) || '',
        en: '',
        nl: '',
        ...initialTranslations[fieldName], // Merge initial translations if present
      }
    })

    return data
  })

  // Update field translation
  const setFieldTranslation = useCallback(
    (fieldName: string, language: Locale, value: string) => {
      setTranslations((prev) => {
        // Only update if value actually changed
        if (prev[fieldName]?.[language] === value) {
          return prev
        }

        const updated: TranslationData = {
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            [language]: value,
          },
        }
        
        // Notify parent about change
        if (onTranslationChange) {
          onTranslationChange(updated)
        }

        return updated
      })
      setIsDirty(true)
    },
    [onTranslationChange],
  )

  // Get field translation
  const getFieldTranslation = useCallback(
    (fieldName: string, language: Locale): string => {
      return translations[fieldName]?.[language] || ''
    },
    [translations],
  )

  // Calculate completion percentage
  const translationCompletion = useMemo(() => {
    const completion: Record<Locale, number> = {
      fr: 100, // French is always 100% (base language)
      en: 0,
      nl: 0,
    }

    locales.forEach((lang) => {
      if (lang === 'fr') return

      const translatedCount = translatableFields.filter((field) => {
        const value = translations[field]?.[lang]
        return value && value.trim().length > 0
      }).length

      completion[lang] =
        translatableFields.length > 0
          ? Math.round((translatedCount / translatableFields.length) * 100)
          : 100
    })

    return completion
  }, [translations, translatableFields])

  const value: TranslationContextValue = {
    currentLanguage,
    setCurrentLanguage,
    translations,
    setFieldTranslation,
    getFieldTranslation,
    translationCompletion,
    translatableFields,
    isDirty,
    markDirty: () => setIsDirty(true),
    clearDirty: () => setIsDirty(false),
  }

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}
