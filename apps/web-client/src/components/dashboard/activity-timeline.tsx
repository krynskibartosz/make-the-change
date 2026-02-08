'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type ActivityItem = {
  id: string
  icon: ReactNode
  title: string
  subtitle: string
  value: ReactNode
}

type ActivityTimelineProps = {
  items: ActivityItem[]
  title?: string
  viewAllHref?: string
  viewAllLabel?: string
  emptyMessage?: string
  emptyAction?: { label: string; href: string }
  className?: string
}

export const ActivityTimeline: FC<ActivityTimelineProps> = ({
  items,
  title = 'Activité récente',
  viewAllHref,
  viewAllLabel = 'Voir tout',
  emptyMessage = 'Aucune activité récente',
  emptyAction,
  className,
}) => {
  return (
    <Card className={cn('border bg-background/70 shadow-sm backdrop-blur', className)}>
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-8">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <Button variant="ghost" size="sm">
              {viewAllLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent className="p-4 sm:p-8 sm:pt-4">
        {items.length > 0 ? (
          <div className="relative space-y-4">
            <div className="absolute left-5 top-0 h-full w-px bg-border/60" />
            {items.map((item, index) => (
              <div key={item.id} className="relative pl-12">
                <div
                  className={cn(
                    'absolute left-3 top-6 h-3 w-3 rounded-full border bg-background shadow-sm',
                    index === 0 && 'border-primary/40 bg-primary/30',
                  )}
                />
                <div
                  className={cn(
                    'group flex items-center justify-between rounded-2xl border bg-background/80 p-4 transition-all hover:-translate-y-0.5 hover:bg-muted/50 hover:shadow-md',
                    index === 0 && 'border-primary/20 bg-primary/5',
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/70 transition-colors group-hover:bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
            {emptyAction && (
              <Link href={emptyAction.href} className="mt-4 inline-block">
                <Button>{emptyAction.label}</Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
