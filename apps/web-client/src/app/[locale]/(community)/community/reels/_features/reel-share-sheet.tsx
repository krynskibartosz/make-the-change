'use client'

import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
} from '@make-the-change/core/ui'
import { Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SharePostActions } from '@/components/social/share-post-actions'

type ReelShareSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  title?: string | null
  description?: string | null
  imageUrl?: string | null
  canonicalUrl: string
  embedUrl?: string | null
  ogImageUrl?: string | null
  onShareRecorded?: () => void
}

export function ReelShareSheet({
  open,
  onOpenChange,
  postId,
  title,
  description,
  imageUrl,
  canonicalUrl,
  embedUrl,
  ogImageUrl,
  onShareRecorded,
}: ReelShareSheetProps) {
  const t = useTranslations('community')

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="sm:max-w-2xl">
        <BottomSheetHeader className="px-0 pb-3 pt-0">
          <div>
            <BottomSheetTitle className="flex items-center gap-2 text-base font-semibold">
              <Share2 className="h-4 w-4 text-primary" />
              {t('share.title')}
            </BottomSheetTitle>
            <BottomSheetDescription className="text-sm text-muted-foreground">
              {t('reels.share_sheet_description')}
            </BottomSheetDescription>
          </div>
        </BottomSheetHeader>

        <BottomSheetBody className="px-0 pb-0">
          <SharePostActions
            postId={postId}
            title={title || undefined}
            description={description}
            imageUrl={imageUrl}
            canonicalUrl={canonicalUrl}
            embedUrl={embedUrl}
            ogImageUrl={ogImageUrl}
            onShareRecorded={onShareRecorded ? () => onShareRecorded() : undefined}
          />
        </BottomSheetBody>
      </BottomSheetContent>
    </BottomSheet>
  )
}
