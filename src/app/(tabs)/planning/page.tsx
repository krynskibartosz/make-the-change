import { format, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { PlanningClient } from '@/features/planning/components/planning-client'
import { ProjectSwitcher } from '@/features/projects/components/project-switcher'
import { mockClarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'

export default async function PlanningPage() {
  const now = new Date()
  const todayStr = format(now, 'yyyy-MM-dd')
  const weekStartStr = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const [summary, timelineEvents, weeklyPlan] = await Promise.all([
    mockClarusRepository.getTodaySummary(todayStr),
    mockClarusRepository.getTimelineEvents(),
    mockClarusRepository.getWeeklyPlan(weekStartStr),
  ])

  const formattedDate = format(now, 'EEEE d MMMM', { locale: fr })

  return (
    <TabScreen eyebrow={formattedDate} title="Suivi Chantier" contentClassName="px-0 sm:px-4">
      <div className="flex justify-end px-4 -mt-2 mb-4 relative z-20">
        <ProjectSwitcher />
      </div>
      <PlanningClient summary={summary} timelineEvents={timelineEvents} weeklyPlan={weeklyPlan} />
    </TabScreen>
  )
}
