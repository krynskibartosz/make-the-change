'use client'

import { Plus } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '../base/button'

export type FormSubmitButtonProps = {
  children?: ReactNode
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  loadingText?: string
  icon?: ReactNode
  disableWhenInvalid?: boolean
}

export const FormSubmitButton: FC<FormSubmitButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  loadingText = 'Envoi en cours...',
  icon = <Plus className="h-4 w-4" />,
  disableWhenInvalid = true,
}) => {
  const { formState } = useFormContext()
  const { isSubmitting, isValid } = formState
  const canSubmit = disableWhenInvalid ? isValid : true

  return (
    <Button
      className={className}
      disabled={!canSubmit || isSubmitting}
      size={size}
      type="submit"
      variant={variant}
    >
      {isSubmitting ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  )
}
