'use client'

import type { FeedScope, FeedSort } from '@make-the-change/core/shared'
import { Button } from '@make-the-change/core/ui'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type CommunityFeedControlsProps = {
  sort: FeedSort
  scope?: FeedScope
  showScope?: boolean
}

const SORT_VALUES: FeedSort[] = ['best', 'newest', 'oldest']
const TAB_SCOPE_VALUES: Array<Extract<FeedScope, 'all' | 'following'>> = ['all', 'following']

export function CommunityFeedControls({
  sort,
  scope = 'all',
  showScope = false,
}: CommunityFeedControlsProps) {
  const t = useTranslations('community')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const paramsString = searchParams.toString()

  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(paramsString)
    params.set(key, value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const sortItems = useMemo(
    () =>
      SORT_VALUES.map((value) => ({
        value,
        label: t(`feed_controls.sort_${value}`),
      })),
    [t],
  )

  const scopeItems = useMemo(
    () =>
      TAB_SCOPE_VALUES.map((value) => ({
        value,
        label: value === 'all' ? t('feed_controls.tab_for_you') : t('feed_controls.tab_following'),
      })),
    [t],
  )

  const activeScope: 'all' | 'following' = scope === 'following' ? 'following' : 'all'

  return (
    <div className="space-y-2 rounded-xl border border-border/70 bg-background/80 p-2.5 sm:p-3">
      {showScope ? (
        <div className="grid grid-cols-2 gap-1.5 rounded-full border border-border/60 bg-background/70 p-1">
          {scopeItems.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant={activeScope === item.value ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-9 min-h-9 w-full rounded-full px-3 text-sm whitespace-nowrap',
                activeScope === item.value && 'shadow-sm',
              )}
              onClick={() => updateQueryParam('scope', item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-1.5">
        {sortItems.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant={sort === item.value ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-9 min-h-9 w-full rounded-full px-2 text-sm sm:px-3 whitespace-nowrap',
              sort === item.value && 'shadow-sm',
            )}
            onClick={() => updateQueryParam('sort', item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
