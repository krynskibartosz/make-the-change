'use client'

import { Button } from '@make-the-change/core/ui'
import type { FeedScope, FeedSort } from '@make-the-change/core/shared'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type CommunityFeedControlsProps = {
  sort: FeedSort
  scope?: FeedScope
  showScope?: boolean
}

const SORT_VALUES: FeedSort[] = ['best', 'newest', 'oldest']
const SCOPE_VALUES: FeedScope[] = ['all', 'my_guilds']

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
      SCOPE_VALUES.map((value) => ({
        value,
        label: t(`feed_controls.scope_${value}`),
      })),
    [t],
  )

  return (
    <div className="space-y-2 rounded-xl border border-border/70 bg-background/80 p-2.5 sm:p-3">
      <div className={cn('grid gap-2', showScope && 'sm:grid-cols-[3fr_2fr]')}>
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

        {showScope && (
          <div className="grid grid-cols-2 gap-1.5">
            {scopeItems.map((item) => (
              <Button
                key={item.value}
                type="button"
                variant={scope === item.value ? 'secondary' : 'outline'}
                size="sm"
                className="h-9 min-h-9 w-full rounded-full px-2 text-sm sm:px-3 whitespace-nowrap"
                onClick={() => updateQueryParam('scope', item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
