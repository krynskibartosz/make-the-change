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

  const isDesktop = variant === 'desktop'

  return (
    <section
      className={cn(
        isDesktop
          ? 'rounded-3xl border border-border/50 bg-background/50 p-6 shadow-sm'
          : 'rounded-[1.5rem] border border-white/8 bg-white/[0.045] p-4',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={cn(
              'flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]',
              isDesktop ? 'text-primary' : 'text-teal-200/65',
            )}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Comprendre ce projet
          </div>
          <p className={cn('mt-1 text-sm leading-relaxed', isDesktop ? 'text-muted-foreground' : 'text-white/48')}>
            Cours courts reliés aux espèces, aux milieux et aux métriques d’impact.
          </p>
        </div>
        <Link
          href={`/learn/courses?project=${projectSlug}`}
          className={cn(
            'shrink-0 text-sm font-black',
            isDesktop ? 'text-primary hover:text-primary/80' : 'text-teal-300 active:text-teal-200',
          )}
        >
          Voir
        </Link>
      </div>

      <div className="mt-4 grid gap-2">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/learn/courses/${course.id}`}
            className={cn(
              'flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors',
              isDesktop
                ? 'bg-muted/50 text-foreground hover:bg-muted'
                : 'bg-white/[0.045] text-white/75 active:bg-white/[0.07]',
            )}
          >
            <span className="line-clamp-1">{course.title}</span>
            <ChevronRight className={cn('h-4 w-4 shrink-0', isDesktop ? 'text-muted-foreground' : 'text-white/30')} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}
