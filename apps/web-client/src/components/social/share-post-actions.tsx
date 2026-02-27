'use client'

import type { ShareChannel } from '@make-the-change/core/shared'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { Copy, ExternalLink, Loader2, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from '@/i18n/navigation'
import { issueShareToken, recordPostShare, recordShareEvent } from '@/lib/social/feed.actions'

type SharePostActionsProps = {
  title?: string
  description?: string | null
  imageUrl?: string | null
  postId: string
  canonicalUrl: string
  embedUrl?: string | null
  oEmbedUrl?: string | null
  ogImageUrl?: string | null
}

type ShareActionKind = 'external' | 'copy' | 'native' | 'embed' | 'internal_quote'

type ShareActionDefinition = {
  channel: ShareChannel
  label: string
  kind: ShareActionKind
}

const LEGACY_SHARE_CHANNELS: ShareChannel[] = ['x', 'linkedin', 'facebook']
const SHARE_V2_ENABLED = process.env.NEXT_PUBLIC_COMMUNITY_SHARE_V2 !== 'false'

const trimToLength = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`
}

const buildTrackedPostUrl = (baseUrl: string, channel: ShareChannel, shareToken: string | null) => {
  const url = new URL(baseUrl)
  url.searchParams.set('utm_source', 'community')
  url.searchParams.set('utm_medium', 'social')
  url.searchParams.set('utm_campaign', 'post_share')
  url.searchParams.set('share_channel', channel)

  if (shareToken) {
    url.searchParams.set('share_token', shareToken)
  }

  return url.toString()
}

const buildExternalShareUrl = (
  channel: ShareChannel,
  shareUrl: string,
  shareTitle: string,
  shareDescription: string,
) => {
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(shareTitle)
  const encodedDescription = encodeURIComponent(shareDescription)
  const emailBody = encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)

  if (channel === 'x') {
    return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  }

  if (channel === 'linkedin') {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  }

  if (channel === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  }

  if (channel === 'whatsapp') {
    return `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
  }

  if (channel === 'telegram') {
    return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  }

  if (channel === 'email') {
    return `mailto:?subject=${encodedTitle}&body=${emailBody}`
  }

  if (channel === 'reddit') {
    return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
  }

  return null
}

const copyTextToClipboard = async (value: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard unavailable')
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!copied) {
    throw new Error('Clipboard unavailable')
  }
}

export function SharePostActions({
  title,
  description,
  imageUrl,
  postId,
  canonicalUrl,
  embedUrl,
  oEmbedUrl,
  ogImageUrl,
}: SharePostActionsProps) {
  const { toast } = useToast()
  const t = useTranslations('community')
  const router = useRouter()
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [activeChannel, setActiveChannel] = useState<ShareChannel | null>(null)
  const shareUrl = canonicalUrl.trim()
  const resolvedEmbedUrl = (embedUrl || '').trim()
  const resolvedOEmbedUrl = (oEmbedUrl || '').trim()
  const resolvedOgImageUrl = (ogImageUrl || '').trim()
  const resolvedTitle = trimToLength(title || t('post.share_fallback_title'), 110)
  const resolvedDescription = trimToLength(
    description || title || t('share.description'),
    180,
  )

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === 'function')
  }, [])

  const shareActions = useMemo<ShareActionDefinition[]>(() => {
    if (!SHARE_V2_ENABLED) {
      return [
        { channel: 'copy', label: t('share.copy_link'), kind: 'copy' },
        { channel: 'native', label: t('share.native_share'), kind: 'native' },
        { channel: 'x', label: t('share.share_on_x'), kind: 'external' },
        { channel: 'linkedin', label: t('share.share_on_linkedin'), kind: 'external' },
        { channel: 'facebook', label: t('share.share_on_facebook'), kind: 'external' },
      ]
    }

    return [
      { channel: 'copy', label: t('share.copy_link'), kind: 'copy' },
      { channel: 'native', label: t('share.native_share'), kind: 'native' },
      { channel: 'x', label: t('share.share_on_x'), kind: 'external' },
      { channel: 'linkedin', label: t('share.share_on_linkedin'), kind: 'external' },
      { channel: 'facebook', label: t('share.share_on_facebook'), kind: 'external' },
      { channel: 'whatsapp', label: t('share.share_on_whatsapp'), kind: 'external' },
      { channel: 'telegram', label: t('share.share_on_telegram'), kind: 'external' },
      { channel: 'reddit', label: t('share.share_on_reddit'), kind: 'external' },
      { channel: 'email', label: t('share.share_via_email'), kind: 'external' },
      { channel: 'embed', label: t('share.embed_on_site'), kind: 'embed' },
      { channel: 'internal_quote', label: t('share.quote_repost'), kind: 'internal_quote' },
    ]
  }, [t])

  const recommendedChannels = useMemo<ShareChannel[]>(() => {
    if (!SHARE_V2_ENABLED) {
      return ['copy', ...(canNativeShare ? (['native'] as ShareChannel[]) : []), ...LEGACY_SHARE_CHANNELS]
    }

    return canNativeShare ? ['native', 'copy', 'whatsapp'] : ['copy', 'x', 'facebook']
  }, [canNativeShare])

  const trackEvent = (payload: {
    channel: ShareChannel
    eventType: 'channel_clicked' | 'link_copied' | 'target_opened'
    shareToken?: string | null
    targetUrl?: string
  }) => {
    void recordShareEvent({
      postId,
      channel: payload.channel,
      eventType: payload.eventType,
      shareToken: payload.shareToken || null,
      targetUrl: payload.targetUrl || shareUrl,
    })
  }

  const showUnavailableToast = () => {
    toast({
      title: t('share.link_unavailable_title'),
      description: t('share.link_unavailable_description'),
      variant: 'destructive',
    })
  }

  const handleShareAction = async (action: ShareActionDefinition) => {
    if (!shareUrl) {
      showUnavailableToast()
      return
    }

    if (action.kind === 'native' && !canNativeShare) {
      return
    }

    if (activeChannel) {
      return
    }

    setActiveChannel(action.channel)

    try {
      const shareToken = await issueShareToken(postId, action.channel)
      const trackedPostUrl = buildTrackedPostUrl(shareUrl, action.channel, shareToken)

      trackEvent({
        channel: action.channel,
        eventType: 'channel_clicked',
        shareToken,
        targetUrl: trackedPostUrl,
      })

      if (action.kind === 'copy') {
        await copyTextToClipboard(trackedPostUrl)
        trackEvent({
          channel: action.channel,
          eventType: 'link_copied',
          shareToken,
          targetUrl: trackedPostUrl,
        })
        await recordPostShare(postId, action.channel, {
          share_token: shareToken,
          target_url: trackedPostUrl,
        })
        toast({
          title: t('share.link_copied_title'),
          description: t('share.link_copied_description'),
        })
        return
      }

      if (action.kind === 'embed') {
        if (!resolvedEmbedUrl) {
          showUnavailableToast()
          return
        }

        const embedSnippet = `<iframe src="${resolvedEmbedUrl}" width="640" height="460" style="border:0;overflow:hidden;border-radius:12px;" loading="lazy" allowfullscreen title="${resolvedTitle.replace(/"/g, '&quot;')}"></iframe>`

        await copyTextToClipboard(embedSnippet)
        trackEvent({
          channel: action.channel,
          eventType: 'link_copied',
          shareToken,
          targetUrl: resolvedEmbedUrl,
        })
        await recordPostShare(postId, action.channel, {
          share_token: shareToken,
          target_url: resolvedEmbedUrl,
        })
        toast({
          title: t('share.embed_copied_title'),
          description: t('share.embed_copied_description'),
        })
        return
      }

      if (action.kind === 'internal_quote') {
        await recordPostShare(postId, action.channel, {
          share_token: shareToken,
          target_url: `/community/posts/new?quote=${postId}`,
        })
        router.push(
          `/community/posts/new?quote=${postId}&share_channel=internal_quote${shareToken ? `&share_token=${encodeURIComponent(shareToken)}` : ''}`,
        )
        return
      }

      if (action.kind === 'native') {
        try {
          await navigator.share({
            title: resolvedTitle,
            text: resolvedDescription,
            url: trackedPostUrl,
          })
          trackEvent({
            channel: action.channel,
            eventType: 'target_opened',
            shareToken,
            targetUrl: trackedPostUrl,
          })
          await recordPostShare(postId, action.channel, {
            share_token: shareToken,
            target_url: trackedPostUrl,
          })
        } catch {
          // User can cancel the native share dialog.
        }
        return
      }

      const externalShareUrl = buildExternalShareUrl(
        action.channel,
        trackedPostUrl,
        resolvedTitle,
        resolvedDescription,
      )

      if (!externalShareUrl) {
        showUnavailableToast()
        return
      }

      window.open(externalShareUrl, '_blank', 'noopener,noreferrer')
      trackEvent({
        channel: action.channel,
        eventType: 'target_opened',
        shareToken,
        targetUrl: trackedPostUrl,
      })
      await recordPostShare(postId, action.channel, {
        share_token: shareToken,
        target_url: trackedPostUrl,
      })
    } catch (_error) {
      toast({
        title: t('share.share_error_title'),
        description: t('share.share_error_description'),
        variant: 'destructive',
      })
    } finally {
      setActiveChannel(null)
    }
  }

  const recommendedActions = shareActions.filter((action) =>
    recommendedChannels.includes(action.channel),
  )
  const secondaryActions = shareActions.filter((action) => !recommendedChannels.includes(action.channel))
  const previewImage = imageUrl || resolvedOgImageUrl

  return (
    <Card>
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-base">{t('share.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('share.description')}</p>
      </CardHeader>
      <CardContent className="space-y-5 p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('share.preview_label')}
          </p>
          {previewImage ? (
            <img
              src={previewImage}
              alt={t('share.preview_image_alt')}
              className="mb-3 h-36 w-full rounded-lg object-cover"
            />
          ) : null}
          <p className="line-clamp-2 text-sm font-semibold text-foreground">{resolvedTitle}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{resolvedDescription}</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('share.recommended_channels')}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {recommendedActions.map((action) => {
              if (action.channel === 'native' && !canNativeShare) {
                return null
              }

              const isLoading = activeChannel === action.channel

              return (
                <Button
                  key={action.channel}
                  type="button"
                  variant="outline"
                  className="h-11 justify-start gap-2"
                  onClick={() => {
                    void handleShareAction(action)
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : action.channel === 'copy' ? (
                    <Copy className="h-4 w-4" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {action.label}
                </Button>
              )
            })}
          </div>
        </div>

        {secondaryActions.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('share.more_channels')}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {secondaryActions.map((action) => {
                if (action.channel === 'native' && !canNativeShare) {
                  return null
                }

                const isLoading = activeChannel === action.channel
                const isEmbed = action.channel === 'embed'
                const isQuote = action.channel === 'internal_quote'

                return (
                  <Button
                    key={action.channel}
                    type="button"
                    variant="outline"
                    className="h-11 justify-start gap-2"
                    onClick={() => {
                      void handleShareAction(action)
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEmbed ? (
                      <Copy className="h-4 w-4" />
                    ) : isQuote ? (
                      <Share2 className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>
        ) : null}

        {SHARE_V2_ENABLED && resolvedOEmbedUrl ? (
          <p className="text-xs text-muted-foreground">
            <a href={resolvedOEmbedUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {t('share.embed_help_link')}
            </a>
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
