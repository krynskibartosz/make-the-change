import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  CheckCircle2,
  Clock,
  Camera,
  Receipt,
  Hammer,
  Trash2,
  Truck,
  Shield,
  Wrench,
  Package,
  ShoppingCart,
  FileText,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import type { TimelineEvent, InterventionType } from '@/lib/domain'
import { groupByDate } from '@/lib/utils/group-by-date'

// ─── Label mapping ─────────────────────────────────────────────────────────

const INTERVENTION_TYPE_LABEL: Record<InterventionType, string> = {
  work: 'Travaux',
  demolition: 'Démolition',
  evacuation: 'Évacuation',
  protection: 'Protection',
  dismantling: 'Démontage',
  structure: 'Structure',
  preparation: 'Préparation',
  material_need: 'Besoin matériaux',
  material_use: 'Utilisation matériaux',
  expense: 'Dépense',
  task: 'Tâche',
  decision: 'Décision',
  photo: 'Photo',
  extra: 'Travaux supplémentaires',
  other: 'Autre',
}

function getInterventionTypeIcon(type: InterventionType) {
  switch (type) {
    case 'work': return Hammer
    case 'demolition': return Trash2
    case 'evacuation': return Truck
    case 'protection': return Shield
    case 'dismantling': return Wrench
    case 'structure': return Wrench
    case 'preparation': return Wrench
    case 'material_need': return ShoppingCart
    case 'material_use': return Package
    default: return FileText
  }
}

// ─── Date label helper ─────────────────────────────────────────────────────

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return "Aujourd'hui"
  if (isYesterday(date)) return 'Hier'
  return format(date, 'EEEE d MMMM', { locale: fr })
}

// ─── Event type config ─────────────────────────────────────────────────────

type EventConfig = {
  color: string       // Tailwind text color
  bgColor: string     // Tailwind bg color for dot
  borderColor: string // left border accent on card
  badgeColor: string  // pill badge
}

const EVENT_CONFIG: Record<string, EventConfig> = {
  intervention: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15',
    borderColor: 'border-l-blue-500/60',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  task: {
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-l-emerald-500/60',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  expense: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-l-purple-500/60',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  photo: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-l-orange-500/60',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
}

const DEFAULT_CONFIG: EventConfig = {
  color: 'text-muted-foreground',
  bgColor: 'bg-muted',
  borderColor: 'border-l-muted-foreground/40',
  badgeColor: 'bg-muted text-muted-foreground border-muted-foreground/20',
}

function getEventConfig(type: string): EventConfig {
  return EVENT_CONFIG[type] ?? DEFAULT_CONFIG
}

// ─── Individual event card ─────────────────────────────────────────────────

function InterventionCard({ event }: { event: Extract<TimelineEvent, { type: 'intervention' }> }) {
  const { data } = event
  const cfg = getEventConfig('intervention')
  const Icon = getInterventionTypeIcon(data.type)

  return (
    <Link
      href={`/interventions/${data.id}`}
      className={`flex items-start gap-3 rounded-xl border border-border border-l-[3px] ${cfg.borderColor} bg-surface p-4 shadow-sm active:bg-surface-elevated transition-colors`}
    >
      <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${cfg.bgColor}`}>
        <Icon className={`size-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-snug truncate">{data.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
            {INTERVENTION_TYPE_LABEL[data.type]}
          </span>
          {data.status === 'done' && (
            <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              Terminé
            </span>
          )}
          {data.status === 'to_check' && (
            <span className="text-[10px] font-medium text-amber-400">À vérifier</span>
          )}
        </div>
      </div>
      <ChevronRight className="size-4 text-muted-foreground/40 mt-1 shrink-0" />
    </Link>
  )
}

function TaskCard({ event }: { event: Extract<TimelineEvent, { type: 'task' }> }) {
  const { data } = event
  const cfg = getEventConfig('task')
  const isDone = data.status === 'done'

  return (
    <div className={`flex items-start gap-3 rounded-xl border border-border border-l-[3px] ${cfg.borderColor} bg-surface p-4 shadow-sm`}>
      <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${cfg.bgColor}`}>
        <CheckCircle2 className={`size-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm leading-snug ${isDone ? 'line-through text-muted-foreground' : ''}`}>
          {data.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
            Tâche
          </span>
          {data.priority === 'urgent' && (
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Urgent</span>
          )}
        </div>
      </div>
    </div>
  )
}

function ExpenseCard({ event }: { event: Extract<TimelineEvent, { type: 'expense' }> }) {
  const { data } = event
  const cfg = getEventConfig('expense')

  return (
    <div className={`flex items-start gap-3 rounded-xl border border-border border-l-[3px] ${cfg.borderColor} bg-surface p-4 shadow-sm`}>
      <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${cfg.bgColor}`}>
        <Receipt className={`size-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-snug truncate">{data.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
            Dépense
          </span>
          {data.supplier && (
            <span className="text-xs text-muted-foreground truncate">{data.supplier}</span>
          )}
        </div>
      </div>
      <span className="font-bold text-sm text-foreground shrink-0">{data.amount} €</span>
    </div>
  )
}

function PhotoCard({ event }: { event: Extract<TimelineEvent, { type: 'photo' }> }) {
  const { data } = event
  const cfg = getEventConfig('photo')

  const photoTypeLabel: Record<string, string> = {
    before: 'Avant',
    during: 'En cours',
    after: 'Après',
    receipt: 'Reçu',
  }

  return (
    <Link
      href="/photos"
      className={`flex items-start gap-3 rounded-xl border border-border border-l-[3px] ${cfg.borderColor} bg-surface p-3 shadow-sm active:bg-surface-elevated transition-colors overflow-hidden`}
    >
      {/* Thumbnail */}
      <div className="relative size-14 shrink-0 rounded-lg overflow-hidden border border-border bg-surface-elevated">
        <img
          src={data.url}
          alt={data.comment ?? 'Photo du chantier'}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = 'https://placehold.co/56x56/1e293b/475569?text=📷'
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold line-clamp-1">
          {data.comment ?? 'Photo ajoutée'}
        </p>
        <span className={`mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
          {photoTypeLabel[data.type] ?? 'Photo'}
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground/40 mt-1 shrink-0" />
    </Link>
  )
}

function EventCard({ event }: { event: TimelineEvent }) {
  switch (event.type) {
    case 'intervention': return <InterventionCard event={event} />
    case 'task': return <TaskCard event={event} />
    case 'expense': return <ExpenseCard event={event} />
    case 'photo': return <PhotoCard event={event} />
  }
}

// ─── Event type icon for the timeline dot ─────────────────────────────────

function TimelineDot({ event }: { event: TimelineEvent }) {
  const cfg = getEventConfig(event.type)

  const iconMap = {
    intervention: Clock,
    task: CheckCircle2,
    expense: Receipt,
    photo: Camera,
  }
  const Icon = iconMap[event.type]

  return (
    <div className={`absolute left-0 top-3 flex size-8 items-center justify-center rounded-full border-2 border-background ${cfg.bgColor} z-10`}>
      <Icon className={`size-3.5 ${cfg.color}`} />
    </div>
  )
}

// ─── Main timeline view ────────────────────────────────────────────────────

export function TimelineView({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
        <Clock className="size-12 opacity-20" />
        <p className="text-sm">Aucune activité dans la timeline.</p>
      </div>
    )
  }

  const groupedEvents = groupByDate(events, (e) => e.date)
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a))

  return (
    <div className="flex flex-col gap-6 pb-24">
      {sortedDates.map((date) => (
        <div key={date}>
          {/* Day header */}
          <div className="sticky top-0 z-20 -mx-5 px-5 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
              {getDateLabel(date)}
            </span>
          </div>

          {/* Events with vertical line */}
          <div className="relative flex flex-col gap-3 pl-10">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

            {groupedEvents[date]?.map((event, idx) => (
              <div key={idx} className="relative">
                <TimelineDot event={event} />
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
