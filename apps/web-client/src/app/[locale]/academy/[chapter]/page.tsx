'use client'

import { Check, Lock, Play } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  decorateAcademyWithProgress,
  getChapterBySlug,
  getDefaultAcademyProgress,
  type AcademyProgress,
} from '@/lib/mock/mock-academy'
import { cn } from '@/lib/utils'

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default function ChapterPage() {
  const router = useRouter()
  const params = useParams<{ chapter?: string | string[] }>()
  const chapterSlug = getParam(params.chapter)
  const [progress, setProgress] = useState<AcademyProgress>(() =>
    getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID),
  )

  useEffect(() => {
    setProgress(academyRepository.getProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  const chapter = useMemo(() => {
    const baseChapter = chapterSlug ? getChapterBySlug(chapterSlug) : null
    if (!baseChapter) {
      return null
    }

    return decorateAcademyWithProgress([baseChapter], progress)[0] ?? null
  }, [chapterSlug, progress])

  if (!chapter) {
    return (
      <FullScreenSlideModal title="Chapitre introuvable" headerMode="back" fallbackHref="/academy" className="bg-[#05050A] text-white">
        <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="mb-3 text-3xl font-black">Chapitre introuvable</h1>
          <p className="text-white/60">Ce chapitre n'existe pas dans le curriculum mock.</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  return (
    <FullScreenSlideModal
      title={chapter.title}
      headerMode="back"
      fallbackHref="/academy/chapters"
      className="bg-[#05050A] text-white"
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-32 pt-8">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
            Chapitre {chapter.order} · {chapter.level}
          </p>
          <h1 className="mb-3 text-3xl font-black">{chapter.title}</h1>
          <p className="text-sm leading-relaxed text-white/60">{chapter.subtitle}</p>
          <div className="mt-5 rounded-2xl bg-black/30 px-4 py-3 text-sm font-bold text-white/60">
            {chapter.completedUnitsCount} / {chapter.units.length} unités terminées
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {chapter.units.map((unit) => {
            const isLocked = unit.status === 'locked'
            const isCompleted = unit.status === 'completed'
            const isActive = unit.status === 'active'

            return (
              <button
                type="button"
                key={unit.id}
                disabled={isLocked}
                onClick={() => router.push(`/academy/${chapter.slug}/${unit.slug}`)}
                className={cn(
                  'flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
                  isActive && 'border-emerald-500/30 bg-emerald-500/10',
                  isCompleted && 'border-white/10 bg-white/5 hover:bg-white/10',
                  isLocked && 'border-white/5 bg-white/[0.02] opacity-50',
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                    isActive && 'bg-emerald-500 text-black',
                    isCompleted && 'bg-white/10 text-white',
                    isLocked && 'bg-black/40 text-white/30',
                  )}
                >
                  {isActive && <Play className="ml-0.5 h-5 w-5 fill-current" />}
                  {isCompleted && <Check className="h-5 w-5" strokeWidth={3} />}
                  {isLocked && <Lock className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                    Unité {unit.order} · {unit.reward.label}
                  </p>
                  <h2 className="truncate text-lg font-black text-white">{unit.title}</h2>
                  <p className="line-clamp-2 text-sm text-white/50">{unit.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
