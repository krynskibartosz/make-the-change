import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLearningCourseById, getLearningPathById } from '@/lib/learning/catalog'
import type { LearningCourse } from '@/lib/learning/schema'
import { GuidedPathExperience } from './_components/guided-path-experience'

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
    title: path
      ? `${path.title} | Parcours | Make the Change`
      : 'Parcours non trouve | Make the Change',
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

  return <GuidedPathExperience path={path} courses={courses} />
}
