'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import { CheckCircle2, SendIcon } from 'lucide-react'
import { type ComponentProps, type FC, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

type Props = ComponentProps<typeof Button> & {
  pendingText?: string
  successText?: string
  showLoadingIndicator?: boolean
  showSuccessIndicator?: boolean
  successDuration?: number
  autoSuccess?: boolean
  forceSuccess?: boolean
}

export const SubmitButton: FC<Props> = ({
  children,
  pendingText = 'En cours...',
  successText = 'Succès!',
  showLoadingIndicator: _showLoadingIndicator = true,
  showSuccessIndicator = true,
  successDuration = 2000,
  autoSuccess = false,
  forceSuccess = false,
  className,
  variant = 'default',
  icon,
  ...props
}) => {
  const { pending } = useFormStatus()
  const [showSuccess, setShowSuccess] = useState(false)
  const [wasPending, setWasPending] = useState(false)

  useEffect(() => {
    if (pending) setWasPending(true)
  }, [pending])

  useEffect(() => {
    if (!forceSuccess) return
    setShowSuccess(true)
    const timer = setTimeout(() => setShowSuccess(false), successDuration)
    return () => clearTimeout(timer)
  }, [forceSuccess, successDuration])

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (wasPending && !pending) {
      if (autoSuccess) {
        setShowSuccess(true)
        setWasPending(false)
        const timer = setTimeout(() => setShowSuccess(false), successDuration)
        cleanup = () => clearTimeout(timer)
      } else {
        setWasPending(false)
      }
    }

    return cleanup
  }, [pending, wasPending, successDuration, autoSuccess])

  return (
    <Button
      className={cn('transition-all duration-200', pending && 'cursor-wait', className)}
      disabled={pending || showSuccess}
      icon={
        showSuccess ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          (icon ?? <SendIcon className="h-4 w-4" />)
        )
      }
      loading={pending}
      loadingText={pendingText}
      type="submit"
      variant={showSuccess ? 'success' : variant}
      {...props}
    >
      {showSuccess && showSuccessIndicator ? successText : children}
    </Button>
  )
}
