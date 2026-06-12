'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { TimelineEvent, TodaySummary, WeeklyPlan } from '@/lib/domain'
import { TimelineView } from './timeline-view'
import { TodayView } from './today-view'
import { WeekView } from './week-view'

type TabValue = 'today' | 'week' | 'timeline'

export function PlanningClient({
  summary,
  timelineEvents,
  weeklyPlan,
}: {
  summary: TodaySummary
  timelineEvents: TimelineEvent[]
  weeklyPlan: WeeklyPlan | null
}) {
  const [activeTab, setActiveTab] = useState<TabValue>('today')

  return (
    <div className="flex flex-col h-full relative pb-20">
      {/* Segmented Control */}
      <div className="sticky top-0 z-30 px-4 sm:px-0 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex p-1 bg-surface border rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'today'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'week'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'timeline'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Journal
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-0 pt-2">
        {activeTab === 'today' && <TodayView summary={summary} />}
        {activeTab === 'week' && <WeekView plan={weeklyPlan} />}
        {activeTab === 'timeline' && <TimelineView events={timelineEvents} />}
      </div>

      {/* Floating Action Button */}
      {activeTab !== 'timeline' && (
        <div className="fixed bottom-[calc(max(env(safe-area-inset-bottom),0.75rem)+5.5rem)] inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <Link
            className="pointer-events-auto flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform active:scale-[0.98]"
            href="/ajouter"
          >
            <Plus className="size-6" />
            Ajouter
          </Link>
        </div>
      )}
    </div>
  )
}
