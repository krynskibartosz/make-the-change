import { format, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'

import { mockClarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'
import { PlanningClient } from '@/features/planning/components/planning-client'

export default async function PlanningPage() {
  const now = new Date()
  const todayStr = format(now, 'yyyy-MM-dd')
  const weekStartStr = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const [summary, timelineEvents, weeklyPlan] = await Promise.all([
    mockClarusRepository.getTodaySummary(todayStr),
    mockClarusRepository.getTimelineEvents(),
    mockClarusRepository.getWeeklyPlan(weekStartStr)
  ])

  const formattedDate = format(now, 'EEEE d MMMM', { locale: fr })

  return (
    <TabScreen eyebrow={formattedDate} title="Suivi Chantier" contentClassName="px-0 sm:px-5">
      <PlanningClient 
        summary={summary}
        timelineEvents={timelineEvents}
        weeklyPlan={weeklyPlan}
      />
    </TabScreen>
  )
}
