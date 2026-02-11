'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import {
  BRAND_GUIDELINE_NAV_GROUPS,
  BRAND_GUIDELINE_NAV_ITEM_BY_SLUG,
  isBrandGuidelineActivePath,
} from './config'

export function GuidelinesNav() {
  const pathname = usePathname()
  const t = useTranslations('brand_guidelines.nav')
  const tUi = useTranslations('brand_guidelines.ui')

  return (
    <>
      <nav className="-mx-4 overflow-x-auto px-4 pb-2 lg:hidden">
        <ul className="flex min-w-max snap-x snap-mandatory gap-2">
          {BRAND_GUIDELINE_NAV_GROUPS.flatMap((group) =>
            group.items.map((slug) => {
              const item = BRAND_GUIDELINE_NAV_ITEM_BY_SLUG[slug]
              const active = isBrandGuidelineActivePath(pathname, item.href)

              return (
                <li key={item.slug} className="snap-start">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold transition',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              )
            }),
          )}
        </ul>
      </nav>

      <nav className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:block">
        {BRAND_GUIDELINE_NAV_GROUPS.map((group, groupIndex) => {
          const groupActive = group.items.some((slug) => {
            const item = BRAND_GUIDELINE_NAV_ITEM_BY_SLUG[slug]

            return isBrandGuidelineActivePath(pathname, item.href)
          })

          return (
            <div key={group.id} className={cn(groupIndex > 0 && 'border-t border-border')}>
              <p
                className={cn(
                  'px-5 pt-4 text-xl font-black tracking-tight text-foreground',
                  groupActive && 'text-primary',
                )}
              >
                {tUi(`groups.${group.labelKey}`)}
              </p>

              <ul className="space-y-1 px-2 pb-3 pt-2">
                {group.items.map((slug) => {
                  const item = BRAND_GUIDELINE_NAV_ITEM_BY_SLUG[slug]
                  const active = isBrandGuidelineActivePath(pathname, item.href)

                  return (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <span
                          className={cn(
                            'inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black',
                            active
                              ? 'border-primary/30 bg-primary/10'
                              : 'border-border text-muted-foreground',
                          )}
                        >
                          {String(group.items.indexOf(slug) + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate">{t(item.labelKey)}</span>
                        <ChevronRight
                          className={cn(
                            'ml-auto h-4 w-4',
                            active ? 'text-primary' : 'text-muted-foreground/70',
                          )}
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>
    </>
  )
}
