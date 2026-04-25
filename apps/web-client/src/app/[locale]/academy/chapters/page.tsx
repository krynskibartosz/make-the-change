'use client'

import { motion } from 'framer-motion'
import { Check, Lock, Play } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  decorateAcademyWithProgress,
  getDefaultAcademyProgress,
  type AcademyProgress,
} from '@/lib/mock/mock-academy'
import { cn } from '@/lib/utils'

export default function ChaptersPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<AcademyProgress>(() =>
    getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID),
  )

  useEffect(() => {
    setProgress(academyRepository.getProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  const chapters = useMemo(
    () => decorateAcademyWithProgress(academyRepository.getCurriculum(), progress),
    [progress],
  )

  return (
    <FullScreenSlideModal
      title="Programme de l'Académie"
      headerMode="close"
      fallbackHref="/academy"
      className="bg-[#05050A] text-white"
    >
      <div className="mx-auto max-w-xl px-5 pb-32 pt-28">
        <div className="flex flex-col gap-5">
          {chapters.map((chapter) => {
            const isCompleted = chapter.status === 'completed'
            const isActive = chapter.status === 'active'
            const isLocked = chapter.status === 'locked'

            return (
              <motion.button
                type="button"
                key={chapter.id}
                onClick={() => {
                  if (!isLocked) {
                    router.push(`/academy/${chapter.slug}`)
                  }
                }}
                whileTap={!isLocked ? { scale: 0.96 } : {}}
                disabled={isLocked}
                className={cn(
                  'relative flex w-full items-center gap-5 rounded-[32px] border-2 p-5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
                  !isLocked && 'cursor-pointer',
                  isActive && 'border-emerald-500/30 bg-emerald-500/10',
                  isCompleted && 'border-transparent bg-white/5 hover:bg-white/10',
                  isLocked && 'border-transparent bg-white/[0.02] opacity-50 grayscale-[50%]',
                )}
              >
                <div
                  className={cn(
                    'flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                    isActive && 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]',
                    isCompleted && 'bg-white/10 text-white',
                    isLocked && 'border border-white/5 bg-black/40 text-white/30',
                  )}
                >
                  {isActive && <Play className="ml-1 h-7 w-7 fill-current" />}
                  {isCompleted && <Check className="h-7 w-7" strokeWidth={3} />}
                  {isLocked && <Lock className="h-6 w-6" />}
                </div>

                <div className="min-w-0 flex-1 py-1">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'text-[11px] font-black uppercase tracking-widest',
                        isActive ? 'text-emerald-400' : 'text-white/40',
                      )}
                    >
                      Chapitre {chapter.order} · {chapter.level}
                    </span>
                    {!isLocked && (
                      <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white/60">
                        {chapter.completedUnitsCount} / {chapter.units.length} unités
                      </span>
                    )}
                  </div>

                  <h3 className={cn('mb-1 truncate text-xl font-black', isLocked ? 'text-white/60' : 'text-white')}>
                    {chapter.title}
                  </h3>
                  <p className={cn('line-clamp-2 text-sm leading-relaxed', isLocked ? 'text-white/30' : 'text-white/60')}>
                    {chapter.subtitle}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
