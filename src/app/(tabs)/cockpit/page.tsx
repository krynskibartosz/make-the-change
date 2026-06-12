import { format } from 'date-fns'
import { TodayView } from '@/features/planning/components/today-view'
import { mockClarusRepository } from '@/lib/repositories'

export default async function CockpitPage() {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const summary = await mockClarusRepository.getTodaySummary(todayStr)

  return (
    <div className="flex flex-col h-[calc(100dvh-4.5rem)] text-foreground bg-background overflow-hidden">
      <header className="flex-none flex flex-col gap-4 p-4 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Cockpit</h1>
          <p className="text-sm text-muted-foreground">Vue d'ensemble et urgences</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-2">
        <TodayView summary={summary} />
      </main>
    </div>
  )
}
