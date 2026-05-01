'use client'

import { Button } from '@make-the-change/core/ui'
import { Check, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

type ProjectShareButtonProps = {
  projectName: string
  projectSlug: string
  className?: string
}

export function ProjectShareButton({
  projectName,
  projectSlug,
  className,
}: ProjectShareButtonProps) {
  const t = useTranslations('products.detail_page')
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  const handleShare = async () => {
    const url = `${window.location.origin}/projects/${projectSlug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: projectName,
          text: `Check out ${projectName} on Make The Change!`,
          url,
        })
        return
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setHasCopied(true)
      toast({
        title: t('share_success'),
        variant: 'success',
      })

      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy project link', error)
      toast({
        title: t('share_error'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={handleShare}
      title={t('share')}
    >
      {hasCopied ? (
        <Check className="h-5 w-5 scale-110 text-marketing-positive-500 transition-all duration-300" />
      ) : (
        <Share2 className="h-5 w-5 transition-transform duration-300" />
      )}
      <span className="sr-only">{t('share')}</span>
    </Button>
  )
}
