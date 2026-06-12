'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

export type SettingsItem = {
  label: string
  description?: string
  href?: string
  icon: LucideIcon
  iconWrapperClassName: string
}

export type SettingsSection = {
  title: string
  items: SettingsItem[]
}

export function SettingsGroup({ title, items }: SettingsSection) {
  return (
    <section>
      <h2 className="mb-2 ml-8 mt-6 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
        {title}
      </h2>
      <div className="mx-4 mb-8 overflow-hidden rounded-lg border border-border/50 bg-surface shadow-sm">
        {items.map((item, index) => {
          const Icon = item.icon
          const content = (
            <>
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-md text-white ${item.iconWrapperClassName}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground/80">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/40" />
            </>
          )

          return (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 transition-colors active:bg-surface-elevated hover:bg-surface-elevated/50"
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex min-h-14 w-full cursor-not-allowed items-center justify-between gap-3 px-4 py-3 opacity-50"
                >
                  {content}
                </button>
              )}
              {index < items.length - 1 && (
                <div className="ml-[3.75rem] border-b border-border/50" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
