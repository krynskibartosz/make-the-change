'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Droplets,
  Leaf,
  LockKeyhole,
  Network,
  Play,
  Route,
  ShieldAlert,
  Sparkles,
  Sprout,
  Sun,
  Waves,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { MOCK_ACADEMY_VIEWER_ID } from '@/app/[locale]/(lab)/_lib/mock-academy'
import { Link } from '@/i18n/navigation'
import { readLearningProgress } from '@/lib/learning/progress'
import type { LearningCourse, LearningPath, LearningProgress } from '@/lib/learning/schema'
import { getLearningCoursePlayHref } from '@/lib/learning/selectors'
import { cn } from '@/lib/utils'

type GuidedPathExperienceProps = {
  path: LearningPath
  courses: LearningCourse[]
}

type StepStatus = 'completed' | 'active' | 'upcoming'

const levelLabel: Record<LearningPath['level'], string> = {
  base: 'Fondamental',
  intermediaire: 'Intermediaire',
  avance: 'Avance',
}

const courseKindLabel: Record<LearningCourse['entry']['kind'], string> = {
  academy_unit: 'Cours interactif',
  project_experience: 'Experience projet',
  living_web: 'Toile vivante',
}

function getCourseIcon(course: LearningCourse) {
  const blob = `${course.subject} ${course.theme} ${course.tags.join(' ')}`.toLowerCase()

  if (blob.includes('soleil')) return Sun
  if (blob.includes('eau') || blob.includes('ocean') || blob.includes('recif')) return Droplets
  if (blob.includes('sol') || blob.includes('foret')) return Leaf
  if (blob.includes('pollin') || blob.includes('symbio') || blob.includes('relation')) {
    return Network
  }
  if (blob.includes('menace') || blob.includes('blanchissement') || blob.includes('climat')) {
    return ShieldAlert
  }
  if (blob.includes('impact') || blob.includes('preuve') || blob.includes('carbone')) return Waves
  if (course.entry.kind === 'living_web') return Sparkles

  return Sprout
}

function getStatusLabel(status: StepStatus) {
  if (status === 'completed') return 'Revoir'
  if (status === 'active') return 'A continuer'
  return 'A suivre'
}

function getStepStatus(index: number, currentIndex: number, completed: boolean): StepStatus {
  if (completed) return 'completed'
  if (index === currentIndex) return 'active'
  return 'upcoming'
}

function PathHeader({
  path,
  completedCount,
  totalCount,
}: {
  path: LearningPath
  completedCount: number
  totalCount: number
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/6 bg-[#0B0B10]/82 px-3 pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
        <Link
          href="/learn/parcours"
          aria-label="Retour aux parcours"
          className="flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          <ArrowLeft className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          <span className="hidden text-[11px] font-black sm:inline">Parcours</span>
        </Link>

        <div className="flex min-w-0 items-center gap-1.5">
          <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 text-[11px] font-black tabular-nums text-emerald-200">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {completedCount}/{totalCount}
          </span>
          <span className="hidden min-h-10 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-[11px] font-black text-white/75 min-[380px]:inline-flex">
            <Clock3 className="h-3.5 w-3.5 text-white/45" aria-hidden="true" />
            {path.durationMinutes} min
          </span>
          <span className="min-h-10 rounded-full border border-white/10 bg-white/5 px-3 py-3 text-[11px] font-black text-white/75">
            {levelLabel[path.level]}
          </span>
        </div>
      </div>
    </header>
  )
}

function PathHero({
  path,
  completedCount,
  totalCount,
}: {
  path: LearningPath
  completedCount: number
  totalCount: number
}) {
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] px-5 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-xl bg-black/38 px-3 py-2 text-sm font-black text-white/82 backdrop-blur-sm">
        {completedCount}/{totalCount}
        <Crown className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
      </div>
      <div className="relative z-10 mx-auto mb-4 h-16 w-16 drop-shadow-[0_0_20px_rgba(52,211,153,0.34)]">
        <Image src="/images/mascots/melli.png" alt="" fill className="object-contain" priority />
      </div>
      <p className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
        Module guide
      </p>
      <h1 className="relative z-10 mx-auto mt-2 max-w-[22rem] text-[30px] font-black leading-[0.98] tracking-tight text-white sm:text-[38px]">
        {path.title}
      </h1>
      <p className="relative z-10 mx-auto mt-4 max-w-[28rem] text-[15px] font-bold leading-relaxed text-white/58">
        {path.description}
      </p>
      <div className="relative z-10 mt-6 rounded-2xl border border-white/10 bg-black/30 p-3 text-left">
        <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
          <span>Voyage Learning</span>
          <span>{totalCount} etapes</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
          />
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[54px]" />
    </section>
  )
}

function GuidedCourseNode({
  course,
  index,
  status,
  returnTo,
}: {
  course: LearningCourse
  index: number
  status: StepStatus
  returnTo: string
}) {
  const Icon = getCourseIcon(course)
  const reduceMotion = useReducedMotion()
  const active = status === 'active'
  const completed = status === 'completed'
  const upcoming = status === 'upcoming'

  return (
    <div
      className={cn(
        'relative my-4 flex min-h-48 flex-col items-center justify-start pt-12',
        index % 4 === 1 && 'mr-16 sm:mr-24',
        index % 4 === 3 && 'ml-16 sm:ml-24',
      )}
    >
      {active && (
        <motion.div
          aria-hidden="true"
          animate={
            reduceMotion
              ? { opacity: 0.24 }
              : { scale: [0.94, 1.1, 0.94], opacity: [0.16, 0.36, 0.16] }
          }
          transition={{ duration: 2.4, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 -z-10 m-auto h-36 w-36 rounded-full bg-emerald-400/25 blur-2xl"
        />
      )}
      <motion.span
        initial={{ y: 4, opacity: 0 }}
        animate={active && !reduceMotion ? { y: [0, -3, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={{
          duration: 2.2,
          repeat: active && !reduceMotion ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className={cn(
          'absolute top-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-black shadow-[0_10px_26px_rgba(0,0,0,0.24)]',
          active && 'border border-emerald-300/30 bg-emerald-400 text-[#03140d]',
          completed && 'border border-emerald-400/18 bg-emerald-500/10 text-emerald-100/85',
          upcoming && 'border border-white/10 bg-white/[0.06] text-white/45',
        )}
      >
        {getStatusLabel(status)}
      </motion.span>

      <Link
        href={getLearningCoursePlayHref(course, returnTo)}
        aria-label={`${course.title} - ${courseKindLabel[course.entry.kind]} - ${getStatusLabel(status)}`}
        className={cn(
          'group relative flex h-[88px] w-[88px] items-center justify-center rounded-full transition-all duration-100 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300',
          active &&
            'h-[96px] w-[96px] bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700 shadow-[0_10px_0_#064e3b,0_0_34px_rgba(16,185,129,0.36)] ring-2 ring-emerald-300/40 ring-offset-[6px] ring-offset-[#05050A] hover:translate-y-[2px] hover:shadow-[0_8px_0_#064e3b,0_0_36px_rgba(16,185,129,0.42)] active:translate-y-[9px] active:shadow-[0_1px_0_#064e3b]',
          completed &&
            'bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-[0_8px_0_#064e3b] hover:translate-y-[2px] hover:shadow-[0_6px_0_#064e3b] active:translate-y-[8px] active:shadow-none',
          upcoming &&
            'border border-white/10 bg-gradient-to-b from-white/10 to-white/5 text-white/22 shadow-[0_8px_0_#000] hover:translate-y-[2px] hover:shadow-[0_6px_0_#000] active:translate-y-[8px] active:shadow-none',
        )}
      >
        {completed && (
          <span className="pointer-events-none absolute inset-x-5 top-[3px] h-1.5 rounded-full bg-emerald-100/25" />
        )}
        {upcoming ? (
          <LockKeyhole className="h-8 w-8 text-white/22" aria-hidden="true" />
        ) : (
          <Icon className="h-9 w-9 text-white drop-shadow-md" aria-hidden="true" />
        )}
        {active && (
          <span className="absolute -bottom-2 grid h-8 w-8 place-items-center rounded-full border border-black/20 bg-white text-[#063f31] shadow-[0_8px_18px_rgba(0,0,0,0.24)]">
            <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
          </span>
        )}
        {completed && (
          <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full border border-black/20 bg-white text-[#064e3b]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </Link>

      <div className="mt-4 max-w-[150px] text-center">
        <p
          className={cn(
            'text-sm font-black leading-tight',
            upcoming ? 'text-white/36' : 'text-white/92',
          )}
        >
          {course.subject}
        </p>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300/65">
          {courseKindLabel[course.entry.kind]}
        </p>
      </div>
    </div>
  )
}

export function GuidedPathExperience({ path, courses }: GuidedPathExperienceProps) {
  const [progress, setProgress] = useState<LearningProgress | null>(null)

  useEffect(() => {
    setProgress(readLearningProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  const completedCourseIds = useMemo(
    () => new Set(progress?.completedCourseIds ?? []),
    [progress?.completedCourseIds],
  )
  const completedCount = courses.filter((course) => completedCourseIds.has(course.id)).length
  const firstIncompleteIndex = courses.findIndex((course) => !completedCourseIds.has(course.id))
  const currentIndex =
    firstIncompleteIndex === -1 ? Math.max(courses.length - 1, 0) : firstIncompleteIndex
  const returnTo = `/learn/parcours/${path.id}`

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#05050A] font-sans text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-10 h-64 bg-gradient-to-b from-emerald-500/8 to-transparent" />
      <PathHeader path={path} completedCount={completedCount} totalCount={courses.length} />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(5.4rem+env(safe-area-inset-top))]">
        <PathHero path={path} completedCount={completedCount} totalCount={courses.length} />

        <div className="mt-8 flex flex-col items-center pb-12">
          {courses.map((course, index) => {
            const status = getStepStatus(index, currentIndex, completedCourseIds.has(course.id))

            return (
              <GuidedCourseNode
                key={course.id}
                course={course}
                index={index}
                status={status}
                returnTo={returnTo}
              />
            )
          })}
        </div>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
              <Route className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[16px] font-black text-white">Chemin conseille, pas prison</h2>
              <p className="mt-1 text-[13px] font-medium leading-relaxed text-white/48">
                Le parcours donne l'ordre ideal. Les cours restent accessibles librement depuis
                l'Atlas et le catalogue.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
