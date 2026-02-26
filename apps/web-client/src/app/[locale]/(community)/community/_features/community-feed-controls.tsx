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
    <div className="space-y-3 rounded-xl border border-border/70 bg-background/80 p-3">
      <div className="flex flex-wrap gap-2">
        {sortItems.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant={sort === item.value ? 'default' : 'outline'}
            size="sm"
            className={cn('rounded-full px-4', sort === item.value && 'shadow-sm')}
            onClick={() => updateQueryParam('sort', item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {showScope && (
        <div className="flex flex-wrap gap-2">
          {scopeItems.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant={scope === item.value ? 'secondary' : 'outline'}
              size="sm"
              className="rounded-full px-3"
              onClick={() => updateQueryParam('scope', item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
