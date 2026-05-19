import { ArrowRight, GitBranch, Link2 } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  LEARNING_DOMAIN_LABELS,
  LearningCourseCard,
  LearningPlayButton,
  LearningScreenIntro,
  learningInteractiveClassName,
  PROJECT_LABEL_BY_SLUG,
} from '@/app/[locale]/(tabs)/learn/_features/learning-cards'
import { Link } from '@/i18n/navigation'
import { getLearningCourseById } from '@/lib/learning/catalog'
import { getRecommendedAfterCourses } from '@/lib/learning/selectors'
import { cn } from '@/lib/utils'

type LearningCourseDetailPageProps = {
  params: Promise<{
    courseId: string
    locale: string
  }>
}

export async function generateMetadata({
  params,
}: LearningCourseDetailPageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = getLearningCourseById(courseId)

  return {
    title: course
      ? `${course.title} | Apprendre | Make the Change`
      : 'Cours non trouvé | Make the Change',
  }
}

export default async function LearningCourseDetailPage({ params }: LearningCourseDetailPageProps) {
  const { courseId } = await params
  const course = getLearningCourseById(courseId)

  if (!course) {
    notFound()
  }

  const recommendedAfterCourses = getRecommendedAfterCourses(course)
  const ecosystemHref = course.relatedEcosystemIds[0]
    ? `/ecosysteme/${course.relatedEcosystemIds[0]}${course.relatedNodeIds[0] ? `?node=${course.relatedNodeIds[0]}` : ''}`
    : null

  return (
    <main className="min-h-[100dvh] bg-[#0B0F15] text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.75rem,env(safe-area-inset-top))]">
        <LearningScreenIntro eyebrow={LEARNING_DOMAIN_LABELS[course.domain]} title={course.title}>
          {course.subtitle}
        </LearningScreenIntro>

        <section className="rounded-[1.45rem] border border-white/8 bg-white/[0.025] p-5">
          <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/35">
            <span>{course.theme}</span>
            <span>·</span>
            <span>{course.durationMinutes} min</span>
            <span>·</span>
            <span>
              {course.level === 'base'
                ? 'Base'
                : course.level === 'intermediaire'
                  ? 'Intermédiaire'
                  : 'Avancé'}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LearningPlayButton course={course} returnTo={`/learn/courses/${course.id}`} />
            {ecosystemHref && (
              <Link
                href={ecosystemHref}
                className={cn(
                  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-[14px] font-black text-white/70 active:bg-white/[0.06]',
                  learningInteractiveClassName,
                )}
              >
                <GitBranch className="h-4 w-4" aria-hidden="true" />
                Voir dans la Toile vivante
              </Link>
            )}
          </div>
        </section>

        {recommendedAfterCourses.length > 0 && (
          <section>
            <h2 className="mb-3 px-1 text-[18px] font-black text-white">Recommandé après</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {recommendedAfterCourses.map((entry) => (
                <LearningCourseCard key={entry.id} course={entry} compact />
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.025] p-4">
            <h2 className="flex items-center gap-2 text-[16px] font-black text-white">
              <Link2 className="h-4 w-4 text-teal-200" aria-hidden="true" />
              Liens produit
            </h2>
            {course.relatedProjectSlugs.length > 0 ? (
              <div className="mt-3 divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025]">
                {course.relatedProjectSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/projects/${slug}`}
                    className={cn(
                      'flex min-h-12 items-center justify-between px-3 py-2 text-[13px] font-semibold text-white/72 active:bg-white/[0.07]',
                      learningInteractiveClassName,
                    )}
                  >
                    {PROJECT_LABEL_BY_SLUG[slug] ?? slug}
                    <ArrowRight className="h-3.5 w-3.5 text-white/30" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[13px] leading-relaxed text-white/42">
                Aucun projet direct : ce cours sert surtout de base transversale.
              </p>
            )}
          </div>

          <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.025] p-4">
            <h2 className="text-[16px] font-black text-white">Tags & contextes</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[course.subject, ...course.tags.slice(0, 8)].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white/48"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
