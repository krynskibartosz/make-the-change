'use client'

import type { Locale } from '@make-the-change/core/i18n'
import { Badge, Input, TextArea } from '@make-the-change/core/ui'
import { type FC, useId } from 'react'

import { useTranslatableField, useTranslatableFieldControlled } from './use-translatable-field'

// ============================================================================
// Helpers
// ============================================================================

const LanguageBadge: FC<{ language: Locale }> = ({ language }) => {
  const flags: Record<Locale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    nl: '🇳🇱',
  }

  return (
    <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 h-4 bg-muted/50 border-muted-foreground/20">
      <span className="mr-1">{flags[language]}</span>
      {language.toUpperCase()}
    </Badge>
  )
}

// ============================================================================
// TranslatableInput (RHF)
// ============================================================================

type TranslatableInputProps = {
  name: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  onBlur?: () => void
}

export const TranslatableInput: FC<TranslatableInputProps> = ({
  name,
  label,
  onBlur: onBlurProp,
  required,
  ...props
}) => {
  const { value, onChange, onBlur, language, isBaseLang } = useTranslatableField(
    name,
    onBlurProp,
  )

  const showRequired = required && isBaseLang
  const id = useId()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium flex items-center">
          {label}
          {showRequired && <span className="text-destructive ml-1">*</span>}
          <LanguageBadge language={language} />
        </label>
      </div>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={showRequired}
        {...props}
      />
      {!isBaseLang && !value && (
        <p className="text-[10px] text-muted-foreground">
          Traduction manquante (la valeur par défaut sera utilisée si vide)
        </p>
      )}
    </div>
  )
}

// ============================================================================
// TranslatableTextArea (RHF)
// ============================================================================

type TranslatableTextAreaProps = {
  name: string
  label: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  onBlur?: () => void
}

export const TranslatableTextArea: FC<TranslatableTextAreaProps> = ({
  name,
  label,
  onBlur: onBlurProp,
  ...props
}) => {
  const { value, onChange, onBlur, language, isBaseLang } = useTranslatableField(
    name,
    onBlurProp,
  )

  const id = useId()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium flex items-center">
          {label}
          <LanguageBadge language={language} />
        </label>
      </div>
      <TextArea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        {...props}
      />
      {!isBaseLang && !value && (
        <p className="text-[10px] text-muted-foreground">
          Traduction manquante (la valeur par défaut sera utilisée si vide)
        </p>
      )}
    </div>
  )
}

// ============================================================================
// TranslatableInputControlled
// ============================================================================

type TranslatableInputControlledProps = TranslatableInputProps & {
  value: string
  onChange: (value: string) => void
}

export const TranslatableInputControlled: FC<TranslatableInputControlledProps> = ({
  name,
  label,
  value: baseValue,
  onChange: onBaseChange,
  onBlur: onBlurProp,
  required,
  ...props
}) => {
  const { value, onChange, onBlur, language, isBaseLang } = useTranslatableFieldControlled(
    name,
    baseValue,
    onBaseChange,
    onBlurProp,
  )

  const showRequired = required && isBaseLang
  const id = useId()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium flex items-center">
          {label}
          {showRequired && <span className="text-destructive ml-1">*</span>}
          <LanguageBadge language={language} />
        </label>
      </div>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={showRequired}
        {...props}
      />
      {!isBaseLang && !value && (
        <p className="text-[10px] text-muted-foreground">
          Traduction manquante (la valeur par défaut sera utilisée si vide)
        </p>
      )}
    </div>
  )
}

// ============================================================================
// TranslatableTextAreaControlled
// ============================================================================

type TranslatableTextAreaControlledProps = TranslatableTextAreaProps & {
  value: string
  onChange: (value: string) => void
}

export const TranslatableTextAreaControlled: FC<TranslatableTextAreaControlledProps> = ({
  name,
  label,
  value: baseValue,
  onChange: onBaseChange,
  onBlur: onBlurProp,
  ...props
}) => {
  const { value, onChange, onBlur, language, isBaseLang } = useTranslatableFieldControlled(
    name,
    baseValue,
    onBaseChange,
    onBlurProp,
  )

  const id = useId()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium flex items-center">
          {label}
          <LanguageBadge language={language} />
        </label>
      </div>
      <TextArea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        {...props}
      />
      {!isBaseLang && !value && (
        <p className="text-[10px] text-muted-foreground">
          Traduction manquante (la valeur par défaut sera utilisée si vide)
        </p>
      )}
    </div>
  )
}
