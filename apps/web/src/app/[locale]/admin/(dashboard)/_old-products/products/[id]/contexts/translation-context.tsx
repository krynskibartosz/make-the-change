'use client'

import type { Translation } from '@make-the-change/shared'
import {
  getTranslationCompleteness,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@make-the-change/shared'
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

export interface TranslationData {
  [fieldName: string]: {
    fr: string
    en: string
    nl: string
  }
}

export interface TranslationContextValue {
  // Current active language
  currentLanguage: SupportedLanguage
  setCurrentLanguage: (lang: SupportedLanguage) => void

  // Translation data management
  translations: TranslationData
  setFieldTranslation: (fieldName: string, language: SupportedLanguage, value: string) => void
  getFieldTranslation: (fieldName: string, language: SupportedLanguage) => string

  // Completion tracking
  translationCompletion: Record<SupportedLanguage, number>
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
  initialTranslations?: Translation[]
  translatableFields: string[]
  defaultValues: Record<string, string>
}

export const TranslationProvider: FC<TranslationProviderProps> = ({
  children,
  initialTranslations = [],
  translatableFields,
  defaultValues,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr')
  const [isDirty, setIsDirty] = useState(false)

  // Build translation data structure from initial translations
  const [translations, setTranslations] = useState<TranslationData>(() => {
    const data: TranslationData = {}

    translatableFields.forEach((fieldName) => {
      // Initialize with French value from defaultValues
      data[fieldName] = {
        fr: defaultValues[fieldName] || '',
        en: '',
        nl: '',
      }

      // Populate from initial translations (EN/NL only)
      initialTranslations.forEach((t) => {
        if (
          t.field_name === fieldName &&
          t.language !== 'fr' &&
          (t.language === 'en' || t.language === 'nl')
        ) {
          if (data[fieldName]) {
            data[fieldName][t.language] = t.value
          }
        }
      })
    })

    console.log('[TranslationProvider] Initial translations:', data)
    return data
  })

  // Update field translation
  const setFieldTranslation = useCallback(
    (fieldName: string, language: SupportedLanguage, value: string) => {
      console.log(
        `[TranslationContext] setFieldTranslation: ${fieldName} [${language}] = "${value}"`,
      )

      setTranslations((prev) => {
        // Only update if value actually changed
        if (prev[fieldName]?.[language] === value) {
          console.log(`[TranslationContext] No change detected, skipping update`)
          return prev
        }

        const updated: TranslationData = {
          ...prev,
          [fieldName]: {
            fr: prev[fieldName]?.fr ?? '',
            en: prev[fieldName]?.en ?? '',
            nl: prev[fieldName]?.nl ?? '',
            [language]: value,
          },
        }

        console.log(
          `[TranslationContext] Updated translations for ${fieldName}:`,
          updated[fieldName],
        )
        return updated
      })
      setIsDirty(true)
    },
    [],
  )

  // Get field translation
  const getFieldTranslation = useCallback(
    (fieldName: string, language: SupportedLanguage): string => {
      const value = translations[fieldName]?.[language] || ''
      console.log(
        `[TranslationContext] getFieldTranslation: ${fieldName} [${language}] = "${value}"`,
      )
      return value
    },
    [translations],
  )

  // Calculate completion percentage
  const translationCompletion = useMemo(() => {
    const completion: Record<SupportedLanguage, number> = {
      fr: 100, // French is always 100% (base language)
      en: 0,
      nl: 0,
    }

    SUPPORTED_LANGUAGES.forEach((lang) => {
      if (lang === 'fr') return

      const translatedCount = translatableFields.filter((field) => {
        const value = translations[field]?.[lang]
        return value && value.trim().length > 0
      }).length

      completion[lang] = Math.round((translatedCount / translatableFields.length) * 100)
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
