/**
 * Shared type definitions for UI components
 */

import type * as React from 'react'

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'

export interface BaseComponentProps {
  className?: string
  disabled?: boolean
  error?: string
}

export interface FormFieldState {
  value: unknown
  errors: string[]
  touched: boolean
  isDirty: boolean
}

export interface ListItem<T = unknown> {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  data: T
  disabled?: boolean
}

export interface SelectOption<T extends string | number = string> {
  label: React.ReactNode
  value: T
  disabled?: boolean
  group?: string
}

export type HTMLElementType = React.ElementType | React.ForwardRefExoticComponent<unknown>
