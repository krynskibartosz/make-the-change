import { BookOpen, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getCoursesForProject } from '@/lib/learning/selectors'
import { cn } from '@/lib/utils'

type ProjectLearningLinksProps = {
  projectSlug: string
  variant?: 'mobile' | 'desktop'
}

export function ProjectLearningLinks({ projectSlug, variant = 'mobile' }: ProjectLearningLinksProps) {
  const courses = getCoursesForProject(projectSlug, 3)

  if (courses.length === 0) {
    return null
  }

  if (variant === 'mobile') {
    return (
      <section>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          Continuer à apprendre
        </p>
        <p className="mb-4 text-sm leading-relaxed text-white/45">
          Cours courts reliés aux espèces, aux milieux et aux indicateurs du projet.
        </p>
        <ul className="m-0 list-none divide-y divide-white/[0.06] p-0">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/learn/courses/${course.id}`}
                className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-white/75 active:opacity-60"
              >
                <span className="line-clamp-1">{course.title}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/30" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-border/50 bg-background/50 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={cn('flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-primary')}>
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Comprendre ce projet
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Cours courts reliés aux espèces, aux milieux et aux métriques d&apos;impact.
          </p>
        </div>
        <Link
          href={`/learn/courses?project=${projectSlug}`}
          className="shrink-0 text-sm font-black text-primary hover:text-primary/80"
        >
          Voir
        </Link>
      </div>

      <div className="mt-4 grid gap-2">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/learn/courses/${course.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl bg-muted/50 px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <span className="line-clamp-1">{course.title}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}
