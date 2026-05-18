import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { TabScreen } from '@/app/[locale]/(tabs)/_components/tab-screen'
import { Link } from '@/i18n/navigation'
import { getLearningCourseById, getLearningPathById } from '@/lib/learning/catalog'
import type { LearningCourse } from '@/lib/learning/schema'
import { LearningCourseCard, LearningPlayButton, LearningScreenIntro } from '../../_features/learning-cards'

type LearningPathDetailPageProps = {
  params: Promise<{
    pathId: string
    locale: string
  }>
}

export async function generateMetadata({ params }: LearningPathDetailPageProps): Promise<Metadata> {
  const { pathId } = await params
  const path = getLearningPathById(pathId)

  return {
    title: path ? `${path.title} | Parcours | Make the Change` : 'Parcours non trouvé | Make the Change',
  }
}

export default async function LearningPathDetailPage({ params }: LearningPathDetailPageProps) {
  const { pathId } = await params
  const path = getLearningPathById(pathId)

  if (!path) {
    notFound()
  }

  const courses = path.courseIds
    .map((courseId) => getLearningCourseById(courseId))
    .filter((course): course is LearningCourse => Boolean(course))
  const firstCourse = courses[0] ?? null

  return (
    <TabScreen className="bg-[#0B0F15]">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-28 pt-[max(1.75rem,env(safe-area-inset-top))]">
        <LearningScreenIntro eyebrow="Parcours" title={path.title}>
          {path.description}
        </LearningScreenIntro>

        <section className="rounded-[1.6rem] border border-white/8 bg-white/[0.045] p-5">
          <div className="flex flex-wrap items-center gap-3">
            {path.isAcademyPrimary ? (
              <Link
                href={path.primaryHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-teal-300 px-4 text-[14px] font-black text-[#04110e] shadow-lg shadow-teal-300/15 active:scale-[0.98]"
              >
                Ouvrir l’Academy <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : firstCourse ? (
              <LearningPlayButton course={firstCourse} returnTo={`/learn/parcours/${path.id}`} label="Commencer" />
            ) : null}
            <Link
              href="/learn/parcours"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 px-4 text-[14px] font-black text-white/65 active:bg-white/[0.06]"
            >
              Tous les parcours
            </Link>
          </div>
          <div className="mt-4 grid gap-2 text-[12px] font-semibold text-white/45 sm:grid-cols-3">
            <span>{courses.length} étapes</span>
            <span>{path.durationMinutes} min estimées</span>
            <span>{path.level === 'base' ? 'Niveau base' : path.level === 'intermediaire' ? 'Niveau intermédiaire' : 'Niveau avancé'}</span>
          </div>
        </section>

        <section className="grid gap-3">
          {courses.map((course, index) => (
            <div key={course.id} className="grid gap-3 md:grid-cols-[52px_1fr] md:items-start">
              <div className="hidden md:grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.05] text-white/35">
                {index + 1}
              </div>
              <div className="relative">
                {index === 0 && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-teal-300/10 px-2 py-1 text-[10px] font-black text-teal-100">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Point d’entrée
                  </span>
                )}
                <LearningCourseCard course={course} />
              </div>
            </div>
          ))}
        </section>
      </main>
    </TabScreen>
  )
}
