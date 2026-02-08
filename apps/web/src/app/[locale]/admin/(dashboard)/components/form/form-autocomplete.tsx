'use client'

import { useController, useFormContext } from 'react-hook-form'
import { SingleAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/single-autocomplete'
import { TagsAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/tags-autocomplete'

export type FormAutocompleteProps = {
  name: string
  mode?: 'single' | 'tags'
  suggestions?: string[]
  placeholder?: string
  className?: string
  disabled?: boolean
  // Single-specific
  allowCreate?: boolean
  // Tags-specific
  maxTags?: number
}

export const FormAutocomplete = ({
  name,
  mode = 'single',
  suggestions = [],
  placeholder,
  className,
  disabled,
  allowCreate = true,
  maxTags = 10,
}: FormAutocompleteProps) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ control, name })
  const errorMessage = fieldState.error?.message

  if (mode === 'tags') {
    const value = Array.isArray(field.value) ? (field.value as string[]) : []
    return (
      <div className="space-y-1">
        <TagsAutocomplete
          className={className}
          disabled={disabled}
          maxTags={maxTags}
          placeholder={placeholder}
          suggestions={suggestions}
          value={value}
          onChange={(tags) => field.onChange(tags)}
        />
        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
      </div>
    )
  }

  const value = typeof field.value === 'string' ? field.value : ''
  return (
    <div className="space-y-1">
      <SingleAutocomplete
        allowCreate={allowCreate}
        className={className}
        disabled={disabled}
        placeholder={placeholder}
        suggestions={suggestions}
        value={value}
        onChange={(v) => field.onChange(v)}
      />
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </div>
  )
}
