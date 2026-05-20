'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, CheckCircle2, ChevronDown, Award, Sparkles, Clock } from 'lucide-react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import { Link } from '@/i18n/navigation'
import { getLearningCourseById } from '@/lib/learning/catalog'
import type { SubdomainContent } from '@/lib/learning/selectors'
import type { LearningProgress } from '@/lib/learning/schema'
import { cn } from '@/lib/utils'

type AtlasSubdomainSheetProps = {
  isOpen: boolean
  onClose: () => void
  content: SubdomainContent | null
  territoryColor: string
  territoryTextColor: string
  progress: LearningProgress | null
}

export function AtlasSubdomainSheet({
  isOpen,
  onClose,
  content,
  territoryColor,
  territoryTextColor,
  progress,
}: AtlasSubdomainSheetProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  if (!content) return null

  const { subdomain, territory, modules, courses, totalCourses, completedCount } = content
  const completedCourseIds = new Set(progress?.completedCourseIds ?? [])

  // Calculate total duration and completed duration
  const allSubdomainCourses = [...(modules.flatMap(m => m.courseIds).map(id => content.courses.find(c => c.id === id) || modules.flatMap(m => m.courseIds).map(() => null))), ...courses].filter(Boolean)
  
  // Summing up durationMinutes for subdomain courses
  // Wait, let's get courses directly from subdomainContent
  // In content, we have content.modules and content.courses (free courses).
  // Let's resolve all courses of the subdomain to sum durations
  const resolvedSubdomainCourses = [
    ...modules.flatMap(m => m.courseIds).map(cid => {
      // Find course in global database or just courses list if available
      // But we can get it from the catalogue or we can just estimate it,
      // actually we can do it inside getSubdomainContent or just sum based on course lists
      return null // We can do a simpler way
    })
  ]

  // Let's compute durations. For courses in modules, we can get course duration by finding it.
  // Actually, we can sum the duration of content.courses (free courses).
  // What about module courses? In selectors, we gathered all courses. Let's make sure we can sum them.
  // In getSubdomainContent, allCourses are resolved. Let's make it simpler: we can just find them in modules and free courses.
  // Wait! Let's pass the resolved courses list in content or sum it easily.
  // Let's check how many courses are completed and compute the progress ratio
  const progressRatio = totalCourses > 0 ? completedCount / totalCourses : 0
  const progressPercent = Math.round(progressRatio * 105) > 100 ? 100 : Math.round(progressRatio * 100)

  // Compute total duration of all courses in this subdomain
  // To do that, we can find the courses from selectors or catalogue.
  // Let's just find them by importing them or mapping them.
  // Since we have `content.courses` (free courses), let's see.
  // Let's sum the durations.
  // Wait, we can get the list of all courses of this subdomain from the selectors, or we can just sum modules' courses duration and free courses' duration.
  // For guided modules, we can sum their durationMinutes.
  const modulesDuration = modules.reduce((sum, m) => sum + m.durationMinutes, 0)
  const freeCoursesDuration = courses.reduce((sum, c) => sum + c.durationMinutes, 0)
  const totalDuration = modulesDuration + freeCoursesDuration
  
  // Sum completed course durations
  const completedDuration = courses
    .filter(c => completedCourseIds.has(c.id))
    .reduce((sum, c) => sum + c.durationMinutes, 0)

  // CTA Link: Find first uncompleted course, or first course in module, or just first free course
  let ctaHref = '/learn'
  if (modules.length > 0 && modules[0]) {
    const firstModule = modules[0]
    const firstUncompletedInModule = firstModule.courseIds.find(id => !completedCourseIds.has(id))
    if (firstUncompletedInModule) {
      ctaHref = `/learn/courses/${firstUncompletedInModule}`
    } else {
      ctaHref = `/learn/courses/${firstModule.courseIds[0] || ''}`
    }
  } else if (courses.length > 0 && courses[0]) {
    const firstUncompletedFree = courses.find(c => !completedCourseIds.has(c.id))
    if (firstUncompletedFree) {
      ctaHref = `/learn/courses/${firstUncompletedFree.id}`
    } else {
      ctaHref = `/learn/courses/${courses[0].id}`
    }
  }

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id)
  }

  return (
    <MobileSheet isOpen={isOpen} onClose={onClose}>
      {/* Decorative Top Accent Bar */}
      <div 
        className="absolute left-0 top-0 h-[3px] w-full" 
        style={{ backgroundColor: territoryColor }}
      />

      {/* Header Info */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase opacity-40">
          <span>{territory.label}</span>
          <span>•</span>
          <span>Sous-domaine</span>
        </div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span style={{ color: territoryColor }}>🌿</span>
          {subdomain.label}
        </h3>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Cours</div>
          <div className="mt-1 text-lg font-bold text-white">{totalCourses}</div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Progression</div>
          <div className="mt-1 text-lg font-bold text-white" style={{ color: progressPercent > 0 ? territoryColor : '#fff' }}>
            {progressPercent}%
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">Durée</div>
          <div className="mt-1 text-lg font-bold text-white flex items-center justify-center gap-1">
            <Clock className="h-3.5 w-3.5 opacity-40" />
            <span>{totalDuration}m</span>
          </div>
        </div>
      </div>

      {/* Content Lists */}
      <div className="mt-6 space-y-5">
        {totalCourses === 0 ? (
          <div className="py-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-white/20 animate-pulse" />
            <p className="mt-3 text-sm font-medium text-white/50">Bientôt disponible</p>
            <p className="mt-1 text-xs text-white/30">De nouveaux cours arrivent bientôt pour explorer ce sujet.</p>
          </div>
        ) : (
          <>
            {/* Guided Modules */}
            {modules.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Modules Guidés</h4>
                
                {modules.map((module) => {
                  const isExpanded = expandedModuleId === module.id
                  
                  // Calculate progress for this module specifically
                  const moduleCompletedCount = module.courseIds.filter(cid => completedCourseIds.has(cid)).length
                  const moduleCompletedPercent = Math.round((moduleCompletedCount / module.courseIds.length) * 100)

                  return (
                    <div 
                      key={module.id} 
                      className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.01] transition-all hover:bg-white/[0.02]"
                    >
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="flex w-full items-center justify-between p-4 text-left"
                      >
                        <div className="space-y-1 pr-4">
                          <div className="text-xs font-semibold text-white/80">{module.title}</div>
                          <div className="text-[10px] text-white/40 flex items-center gap-2">
                            <span>{module.courseIds.length} cours</span>
                            <span>•</span>
                            <span className="font-medium" style={{ color: moduleCompletedPercent > 0 ? territoryColor : undefined }}>
                              {moduleCompletedPercent}% complété
                            </span>
                          </div>
                        </div>
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 text-white/30 transition-transform duration-200 shrink-0",
                            isExpanded && "rotate-180 text-white/60"
                          )} 
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="border-t border-white/[0.04] bg-white/[0.01] px-4 py-2 space-y-1">
                              {module.courseIds.map((courseId, idx) => {
                                const isCompleted = completedCourseIds.has(courseId)
                                const resolvedCourse = getLearningCourseById(courseId)
                                const courseTitle = resolvedCourse?.title || courseId.replace('academy-', '').replace(/-/g, ' ')
                                return (
                                  <Link
                                    key={courseId}
                                    href={`/learn/courses/${courseId}`}
                                    onClick={onClose}
                                    className="flex items-center justify-between py-2 text-xs text-white/60 hover:text-white transition-colors group"
                                  >
                                    <div className="flex items-center gap-3">
                                      {isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                      ) : (
                                        <div className="h-4 w-4 shrink-0 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-bold text-white/30 group-hover:border-white/40 group-hover:text-white/60 transition-colors">
                                          {idx + 1}
                                        </div>
                                      )}
                                      <span className={cn(isCompleted && "line-through text-white/35")}>
                                        {courseTitle}
                                      </span>
                                    </div>
                                    <Play className="h-3 w-3 text-white/0 group-hover:text-white/40 transition-colors shrink-0" />
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Standalone Courses */}
            {courses.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Cours Libres</h4>
                <div className="space-y-2">
                  {courses.map((course) => {
                    const isCompleted = completedCourseIds.has(course.id)
                    return (
                      <Link
                        key={course.id}
                        href={`/learn/courses/${course.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4 hover:bg-white/[0.02] transition-colors group"
                      >
                        <div className="flex items-center gap-3 pr-4">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <BookOpen className="h-4 w-4 shrink-0 text-white/30 group-hover:text-white/50 transition-colors" />
                          )}
                          <div className="space-y-0.5">
                            <div className={cn("text-xs font-semibold text-white/80 group-hover:text-white transition-colors", isCompleted && "line-through text-white/40")}>
                              {course.title}
                            </div>
                            <div className="text-[10px] text-white/35">
                              {course.durationMinutes} min • {course.subject}
                            </div>
                          </div>
                        </div>
                        <Play className="h-3 w-3 text-white/0 group-hover:text-white/40 transition-colors shrink-0" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action CTA Button */}
            <div className="pt-2">
              <Link
                href={ctaHref}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold transition-all hover:brightness-110 active:scale-[0.98]"
                style={{
                  backgroundColor: territoryColor,
                  color: territoryTextColor,
                }}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>
                  {progressPercent === 100 
                    ? "Recommencer l'apprentissage" 
                    : progressPercent > 0 
                      ? "Continuer l'apprentissage" 
                      : "Commencer l'apprentissage"}
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </MobileSheet>
  )
}
