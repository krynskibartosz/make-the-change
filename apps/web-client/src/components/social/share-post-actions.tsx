'use client'

import { Button, Card, CardContent } from '@make-the-change/core/ui'
import { Copy, ExternalLink, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { recordPostShare } from '@/lib/social/feed.actions'

type SharePostActionsProps = {
  title?: string
  postId: string
}

export function SharePostActions({ title, postId }: SharePostActionsProps) {
  const { toast } = useToast()
  const t = useTranslations('community')
  const [shareUrl, setShareUrl] = useState('')
  const [canNativeShare, setCanNativeShare] = useState(false)
  const resolvedTitle = title || t('post.share_fallback_title')

  useEffect(() => {
    setShareUrl(window.location.href.replace(/\/share\/?$/, ''))
    setCanNativeShare(typeof navigator.share === 'function')
  }, [])

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(resolvedTitle)

  const shareTargets = [
    {
      channel: 'x' as const,
      label: t('share.share_on_x'),
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      channel: 'linkedin' as const,
      label: t('share.share_on_linkedin'),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      channel: 'facebook' as const,
      label: t('share.share_on_facebook'),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ]

  const trackShare = async (channel: 'copy' | 'x' | 'linkedin' | 'facebook' | 'native') => {
    try {
      await recordPostShare(postId, channel)
    } catch {
      // Analytics tracking failures should not block sharing actions.
    }
  }

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
      await trackShare('copy')
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

  const handleShareTargetClick = async (
    event: MouseEvent<HTMLAnchorElement>,
    channel: 'x' | 'linkedin' | 'facebook',
  ) => {
    if (!shareUrl) {
      event.preventDefault()
      toast({
        title: t('share.link_unavailable_title'),
        description: t('share.link_unavailable_description'),
        variant: 'destructive',
      })
      return
    }

    await trackShare(channel)
  }

  const shareNatively = async () => {
    if (!canNativeShare || !shareUrl) {
      return
    }

    try {
      await navigator.share({
        title: resolvedTitle,
        url: shareUrl,
      })
      await trackShare('native')
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
              <a
                href={target.href}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  void handleShareTargetClick(event, target.channel)
                }}
              >
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
