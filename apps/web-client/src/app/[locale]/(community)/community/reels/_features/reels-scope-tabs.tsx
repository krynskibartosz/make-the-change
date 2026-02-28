'use client'

import { Button } from '@make-the-change/core/ui'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type ReelsScope = 'all' | 'following'

type ReelsScopeTabsProps = {
  scope: ReelsScope
}

export function ReelsScopeTabs({ scope }: ReelsScopeTabsProps) {
  const t = useTranslations('community')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const setScope = (nextScope: ReelsScope) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('scope', nextScope)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-border/70 bg-background/80 p-1">
      <Button
        type="button"
        size="sm"
        variant={scope === 'all' ? 'default' : 'ghost'}
        className={cn('rounded-full', scope === 'all' && 'shadow-sm')}
        onClick={() => setScope('all')}
      >
        {t('feed_controls.tab_for_you')}
      </Button>
      <Button
        type="button"
        size="sm"
        variant={scope === 'following' ? 'default' : 'ghost'}
        className={cn('rounded-full', scope === 'following' && 'shadow-sm')}
        onClick={() => setScope('following')}
      >
        {t('feed_controls.tab_following')}
      </Button>
    </div>
  )
}
