import {
  ArrowRight,
  BookOpen,
  Clock3,
  Compass,
  LockKeyhole,
  Network,
  Play,
  Route,
  Search,
  Sprout,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { AtlasDomainWithCourses, LearningCourse, LearningDomainId, LearningPath } from '@/lib/learning/schema'
import { getLearningCoursePlayHref } from '@/lib/learning/selectors'

export const LEARNING_DOMAIN_LABELS: Record<LearningDomainId, string> = {
  'alphabet-du-vivant': "Alphabet du vivant",
  'milieux-habitats': 'Milieux & habitats',
  'relations-du-vivant': 'Relations du vivant',
  menaces: 'Menaces',
  solutions: 'Solutions',
  'lire-impact': "Lire l'impact",
}

const DOMAIN_TONE: Record<LearningDomainId, string> = {
  'alphabet-du-vivant': 'border-emerald-200/16 bg-emerald-300/8 text-emerald-100',
  'milieux-habitats': 'border-teal-200/16 bg-teal-300/8 text-teal-100',
  'relations-du-vivant': 'border-amber-200/16 bg-amber-300/8 text-amber-100',
  menaces: 'border-rose-200/18 bg-rose-300/8 text-rose-100',
  solutions: 'border-lime-200/16 bg-lime-300/8 text-lime-100',
  'lire-impact': 'border-sky-200/16 bg-sky-300/8 text-sky-100',
}

const ENTRY_LABEL: Record<LearningCourse['entry']['kind'], string> = {
  academy_unit: 'Cours interactif',
  project_experience: 'Expérience projet',
  living_web: 'Toile vivante',
}

export const PROJECT_LABEL_BY_SLUG: Record<string, string> = {
  'miellerie-manakara-ilanga-nature': 'Rucher de Manakara',
  'ruchers-apiculteurs-independants-antsirabe': 'Ruchers Antsirabe',
  'recifs-coraux-karimunjawa': 'Récif Karimunjawa',
  'habeebee-belgique': 'Habeebee',
  'oliviers-sardaigne': 'Oliviers de Sardaigne',
}

export function LearningScreenIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children: ReactNode
}) {
  return (
    <header className="px-1 pt-2">
      {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.18em] text-teal-200/65">{eyebrow}</p>}
      <h1 className="mt-1 text-[28px] font-black tracking-tight text-white">{title}</h1>
      <p className="mt-2 max-w-2xl text-[15px] font-medium leading-relaxed text-white/55">{children}</p>
    </header>
  )
}

export function LearningSectionTitle({
  title,
  href,
  action,
}: {
  title: string
  href?: string
  action?: string
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 px-1">
      <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-black text-teal-300 active:text-teal-200">
          {action ?? 'Voir'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export function LearningCourseCard({
  course,
  compact = false,
}: {
  course: LearningCourse
  compact?: boolean
}) {
  return (
    <Link
      href={`/learn/courses/${course.id}`}
      className={cn(
        'group block rounded-[1.35rem] border border-white/8 bg-white/[0.045] transition-colors active:bg-white/[0.07]',
        compact ? 'p-3.5' : 'p-4',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-black', DOMAIN_TONE[course.domain])}>
              {LEARNING_DOMAIN_LABELS[course.domain]}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
              {ENTRY_LABEL[course.entry.kind]}
            </span>
          </div>
          <h3 className={cn('mt-2 font-black leading-tight text-white', compact ? 'text-[15px]' : 'text-[17px]')}>
            {course.title}
          </h3>
          <p className={cn('mt-1 leading-relaxed text-white/48', compact ? 'line-clamp-2 text-[12px]' : 'text-[13px]')}>
            {course.subtitle}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/[0.055] text-white/35 transition-colors group-active:text-teal-200">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/38">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {course.durationMinutes} min
        </span>
        <span>{course.level === 'base' ? 'Base' : course.level === 'intermediaire' ? 'Intermédiaire' : 'Avancé'}</span>
        <span>{course.theme}</span>
      </div>
    </Link>
  )
}

export function LearningPlayButton({
  course,
  returnTo,
  label,
}: {
  course: LearningCourse
  returnTo?: string
  label?: string
}) {
  return (
    <Link
      href={getLearningCoursePlayHref(course, returnTo)}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-teal-300 px-4 text-[14px] font-black text-[#04110e] shadow-lg shadow-teal-300/15 active:scale-[0.98]"
    >
      {course.entry.kind === 'academy_unit' ? <Play className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      {label ?? (course.entry.kind === 'academy_unit' ? 'Commencer' : 'Ouvrir')}
    </Link>
  )
}

export function AtlasDomainCard({ domain }: { domain: AtlasDomainWithCourses }) {
  const Icon = domain.id === 'relations-du-vivant'
    ? Network
    : domain.id === 'lire-impact'
      ? Search
      : domain.id === 'solutions'
        ? Sprout
        : Compass

  return (
    <Link
      href={`/learn/atlas?domain=${domain.id}`}
      className={cn('block rounded-[1.35rem] border p-4 transition-colors active:bg-white/[0.07]', DOMAIN_TONE[domain.id])}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-black/18 text-current">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-black/15 px-2 py-1 text-[10px] font-black">{domain.courseCount} cours</span>
      </div>
      <h3 className="mt-4 text-[17px] font-black leading-tight text-white">{domain.title}</h3>
      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/50">{domain.subtitle}</p>
    </Link>
  )
}

export function LearningPathCard({ path }: { path: LearningPath }) {
  return (
    <Link
      href={`/learn/parcours/${path.id}`}
      className="block rounded-[1.35rem] border border-white/8 bg-white/[0.045] p-4 transition-colors active:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-300/10 text-teal-200">
          <Route className="h-5 w-5" aria-hidden="true" />
        </span>
        {path.isAcademyPrimary && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] font-black text-emerald-100">
            <LockKeyhole className="h-3 w-3" aria-hidden="true" />
            Guidé
          </span>
        )}
      </div>
      <h3 className="mt-4 text-[17px] font-black leading-tight text-white">{path.title}</h3>
      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/50">{path.subtitle}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-white/38">
        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
        {path.courseIds.length} étapes · {path.durationMinutes} min
      </div>
    </Link>
  )
}
