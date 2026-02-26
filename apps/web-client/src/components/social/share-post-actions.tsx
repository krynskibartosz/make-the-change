'use client'

import { Button, Card, CardContent } from '@make-the-change/core/ui'
import { Copy, ExternalLink, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

type SharePostActionsProps = {
  title?: string
}

export function SharePostActions({ title = 'Publication Make the Change' }: SharePostActionsProps) {
  const { toast } = useToast()
  const t = useTranslations('community')
  const [shareUrl, setShareUrl] = useState('')
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setShareUrl(window.location.href.replace(/\/share\/?$/, ''))
    setCanNativeShare(typeof navigator.share === 'function')
  }, [])

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(title)

  const shareTargets = [
    {
      label: t('share.share_on_x'),
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      label: t('share.share_on_linkedin'),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: t('share.share_on_facebook'),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ]

  const copyLink = async () => {
    if (!shareUrl) {
      toast({
        title: t('share.link_unavailable_title'),
        description: t('share.link_unavailable_description'),
        variant: 'destructive',
      })
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: t('share.link_copied_title'),
        description: t('share.link_copied_description'),
      })
    } catch (_error) {
      toast({
        title: t('share.link_copy_error_title'),
        description: t('share.link_copy_error_description'),
        variant: 'destructive',
      })
    }
  }

  const shareNatively = async () => {
    if (!canNativeShare || !shareUrl) {
      return
    }

    try {
      await navigator.share({
        title,
        url: shareUrl,
      })
    } catch (_error) {
      // No-op when user cancels share dialog
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">{t('share.description')}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="justify-start gap-2"
            onClick={copyLink}
          >
            <Copy className="h-4 w-4" />
            {t('share.copy_link')}
          </Button>

          {canNativeShare ? (
            <Button
              type="button"
              variant="outline"
              className="justify-start gap-2"
              onClick={shareNatively}
            >
              <Share2 className="h-4 w-4" />
              {t('share.native_share')}
            </Button>
          ) : null}

          {shareTargets.map((target) => (
            <Button key={target.label} asChild variant="outline" className="justify-start gap-2">
              <a href={target.href} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                {target.label}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
