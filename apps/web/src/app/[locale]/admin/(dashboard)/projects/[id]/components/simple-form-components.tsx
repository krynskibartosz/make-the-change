'use client'

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextArea,
} from '@make-the-change/core/ui'
import { type FC, useId } from 'react'

type SimpleInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
}

export const SimpleInput: FC<SimpleInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
}) => {
  const id = useId()
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

type SimpleTextAreaProps = {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  rows?: number
  disabled?: boolean
}

export const SimpleTextArea: FC<SimpleTextAreaProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 3,
  disabled = false,
}) => {
  const id = useId()
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <TextArea
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

type SimpleSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  disabled?: boolean
}

export const SimpleSelect: FC<SimpleSelectProps> = ({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}) => {
  const id = useId()
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <Select
        disabled={disabled}
        value={value}
        onValueChange={(nextValue) => onChange(nextValue ?? '')}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} disabled={option.disabled} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
