'use client'

import { Button } from '@make-the-change/core/ui'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ContactCopyButton({
  email = 'contact@make-the-change.com',
  srLabel = 'Copy the email address',
  className,
}: {
  email?: string
  srLabel?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'h-12 w-12 rounded-full border-marketing-overlay-light/20 bg-marketing-overlay-light/10 text-marketing-overlay-light backdrop-blur-sm transition-all duration-300 hover:bg-marketing-overlay-light/20',
        className,
      )}
      onClick={handleCopy}
    >
      <span className="sr-only">{srLabel}</span>
      {copied ? (
        <Check className="h-5 w-5 animate-in zoom-in duration-300" />
      ) : (
        <Copy className="h-5 w-5" />
      )}
    </Button>
  )
}
