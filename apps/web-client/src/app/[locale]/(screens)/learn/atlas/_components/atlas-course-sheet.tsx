'use client'

import { motion } from 'framer-motion'
import { Play, CheckCircle2, Clock, BookOpen, Layers } from 'lucide-react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import { Link } from '@/i18n/navigation'
import { getLearningCourseById, getLearningPathById } from '@/lib/learning/catalog'
import type { LearningProgress } from '@/lib/learning/schema'
import { cn } from '@/lib/utils'

type AtlasCourseSheetProps = {
  isOpen: boolean
  onClose: () => void
  contentId: string | null
  kind: 'module' | 'course' | null
  territoryColor: string
  progress: LearningProgress | null
}

export function AtlasCourseSheet({
  isOpen,
  onClose,
  contentId,
  kind,
  territoryColor,
  progress,
}: AtlasCourseSheetProps) {
  if (!contentId || !kind) return null

  const completedCourseIds = new Set(progress?.completedCourseIds ?? [])

  if (kind === 'module') {
    const moduleContent = getLearningPathById(contentId)
    if (!moduleContent) return null

    const moduleCompletedCount = moduleContent.courseIds.filter((cid) =>
      completedCourseIds.has(cid),
    ).length
    const moduleCompletedPercent = Math.round(
      (moduleCompletedCount / moduleContent.courseIds.length) * 100,
    )
    const isModuleCompleted = moduleCompletedCount === moduleContent.courseIds.length

    // Find first uncompleted course to continue
    const firstUncompletedId = moduleContent.courseIds.find((id) => !completedCourseIds.has(id))
    const ctaHref = firstUncompletedId
      ? `/learn/courses/${firstUncompletedId}`
      : `/learn/courses/${moduleContent.courseIds[0] || ''}`
    const ctaText = isModuleCompleted
      ? 'Revoir le module'
      : moduleCompletedCount > 0
        ? 'Continuer le module'
        : 'Commencer le module'

    return (
      <MobileSheet isOpen={isOpen} onClose={onClose}>
        <div className="absolute left-0 top-0 h-[3px] w-full" style={{ backgroundColor: territoryColor }} />

        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-40">
            <Layers className="h-3.5 w-3.5" />
            <span>Parcours Guidé</span>
          </div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-white">
            {moduleContent.title}
          </h3>
          <p className="mt-2 text-sm text-white/60">{moduleContent.subtitle}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Progression</div>
            <div
              className="mt-1 text-lg font-bold text-white"
              style={{ color: moduleCompletedPercent > 0 ? territoryColor : '#fff' }}
            >
              {moduleCompletedPercent}%
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Durée</div>
            <div className="mt-1 flex items-center justify-center gap-1 text-lg font-bold text-white">
              <Clock className="h-3.5 w-3.5 opacity-40" />
              <span>{moduleContent.durationMinutes}m</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
            Leçons du parcours
          </h4>
          <div className="space-y-1 rounded-2xl border border-white/[0.04] bg-white/[0.01] px-4 py-2">
            {moduleContent.courseIds.map((courseId, idx) => {
              const isCompleted = completedCourseIds.has(courseId)
              const resolvedCourse = getLearningCourseById(courseId)
              const courseTitle = resolvedCourse?.title || courseId.replace('academy-', '').replace(/-/g, ' ')
              return (
                <Link
                  key={courseId}
                  href={`/learn/courses/${courseId}`}
                  onClick={onClose}
                  className="group flex items-center justify-between py-2.5 text-xs text-white/60 transition-colors hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/20 text-[8px] font-bold text-white/30 transition-colors group-hover:border-white/40 group-hover:text-white/60">
                        {idx + 1}
                      </div>
                    )}
                    <span className={cn(isCompleted && 'text-white/35 line-through')}>
                      {courseTitle}
                    </span>
                  </div>
                  <Play className="h-3 w-3 shrink-0 text-white/0 transition-colors group-hover:text-white/40" />
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-8 pb-4">
          <Link
            href={ctaHref}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-[0.92rem] font-bold text-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-transform active:scale-95"
            style={{ backgroundColor: territoryColor }}
          >
            <Play className="h-4 w-4" fill="currentColor" />
            {ctaText}
          </Link>
        </div>
      </MobileSheet>
    )
  }

  // Kind is 'course'
  const courseContent = getLearningCourseById(contentId)
  if (!courseContent) return null

  const isCompleted = completedCourseIds.has(courseContent.id)

  return (
    <MobileSheet isOpen={isOpen} onClose={onClose}>
      <div className="absolute left-0 top-0 h-[3px] w-full" style={{ backgroundColor: territoryColor }} />

      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-40">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Cours Libre</span>
        </div>
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          {courseContent.title}
        </h3>
        <p className="mt-2 text-sm text-white/60">{courseContent.subtitle}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Statut</div>
          <div className="mt-1 flex justify-center text-lg font-bold text-white">
            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Terminé
              </span>
            ) : (
              <span className="text-white/80">À faire</span>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Durée</div>
          <div className="mt-1 flex items-center justify-center gap-1 text-lg font-bold text-white">
            <Clock className="h-3.5 w-3.5 opacity-40" />
            <span>{courseContent.durationMinutes}m</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pb-4">
        <Link
          href={`/learn/courses/${courseContent.id}`}
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-[0.92rem] font-bold text-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-transform active:scale-95"
          style={{ backgroundColor: territoryColor }}
        >
          <Play className="h-4 w-4" fill="currentColor" />
          {isCompleted ? 'Revoir le cours' : 'Commencer le cours'}
        </Link>
      </div>
    </MobileSheet>
  )
}
