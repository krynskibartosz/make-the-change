import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Clock, Image as ImageIcon, Receipt, CheckSquare } from 'lucide-react'
import type { TimelineEvent } from '@/lib/domain'
import Link from 'next/link'

export function TimelineView({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Aucune activité dans la timeline.</p>
  }

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const list = acc[event.date] || []
    list.push(event)
    acc[event.date] = list
    return acc
  }, {} as Record<string, TimelineEvent[]>)

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a))

  return (
    <div className="flex flex-col gap-8 pb-24 relative">
      <div className="absolute left-[15px] top-2 bottom-24 w-px bg-border" />
      
      {sortedDates.map(date => (
        <div key={date} className="relative z-10">
          <div className="sticky top-[108px] z-20 -mx-4 px-4 py-1 backdrop-blur-md bg-background/80 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface border rounded-full px-3 py-1">
              {format(new Date(date), 'EEEE d MMMM', { locale: fr })}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {groupedEvents[date]?.map((event, idx) => (
              <div key={idx} className="flex gap-4 items-start pl-8 relative">
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-surface border shadow-sm">
                  {event.type === 'intervention' && <Clock className="size-4 text-blue-500" />}
                  {event.type === 'task' && <CheckSquare className="size-4 text-green-500" />}
                  {event.type === 'expense' && <Receipt className="size-4 text-purple-500" />}
                  {event.type === 'photo' && <ImageIcon className="size-4 text-orange-500" />}
                </div>

                {/* Card */}
                <div className="flex-1 rounded-[var(--radius-card)] bg-surface border p-3 shadow-sm hover:border-primary/30 transition-colors">
                  {event.type === 'intervention' && (
                    <Link href={`/interventions/${event.data.id}`}>
                      <p className="font-semibold text-sm">{event.data.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Intervention • {event.data.type}</p>
                    </Link>
                  )}
                  {event.type === 'task' && (
                    <div>
                      <p className="font-semibold text-sm line-through text-muted-foreground">{event.data.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Tâche complétée</p>
                    </div>
                  )}
                  {event.type === 'expense' && (
                    <div>
                      <p className="font-semibold text-sm">{event.data.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Achat: {event.data.amount}€ • {event.data.supplier}</p>
                    </div>
                  )}
                  {event.type === 'photo' && (
                    <div>
                      <div className="h-20 w-32 rounded-md bg-cover bg-center mb-1 border" style={{ backgroundImage: `url(${event.data.url})` }} />
                      <p className="text-xs text-muted-foreground">Photo ajoutée • {event.data.type}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
