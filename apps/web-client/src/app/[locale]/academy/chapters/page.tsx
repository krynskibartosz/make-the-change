'use client'

import { motion } from 'framer-motion'
import { Brain, Check, ChevronRight, Lock, Play } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  decorateAcademyWithProgress,
  getCursusById,
  getCursusOptions,
  getDefaultAcademyProgress,
  type AcademyProgress,
} from '@/lib/mock/mock-academy'
import { cn } from '@/lib/utils'

function CursusSummary({
  selectedId,
  onOpen,
}: {
  selectedId: AcademyProgress['selectedCursusId']
  onOpen: () => void
}) {
  const selected = getCursusById(selectedId)

  return (
    <section className="mb-5">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 text-left transition-colors active:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
          <Brain className="h-5 w-5 text-emerald-300" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Cursus</p>
          <h2 className="text-xl font-black text-white">{selected.title}</h2>
          <p className="mt-1 line-clamp-1 text-sm leading-relaxed text-white/50">{selected.subtitle}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30">
          <ChevronRight className="h-4 w-4 text-white/45" />
        </div>
      </button>
    </section>
  )
}

function CursusModal({
  selectedId,
  onSelect,
  onClose,
}: {
  selectedId: AcademyProgress['selectedCursusId']
  onSelect: (cursusId: AcademyProgress['selectedCursusId']) => void
  onClose: () => void
}) {
  return (
    <FullScreenSlideModal
      title="Choisir un cursus"
      headerMode="close"
      onClose={onClose}
      className="z-[90] bg-[#05050A] text-white"
    >
      <div className="mx-auto flex min-h-full max-w-xl flex-col px-5 pb-12 pt-28">
        <div className="mb-8">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
            Angle d'apprentissage
          </p>
          <h1 className="text-3xl font-black leading-tight text-white">Choisis ce que l'Académie met en avant.</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Le chemin reste guidé. Le cursus change surtout le ton, les exemples et les futures missions proposées.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {getCursusOptions().map((cursus) => {
            const isSelected = cursus.id === selectedId

            return (
              <button
                key={cursus.id}
                type="button"
                onClick={() => onSelect(cursus.id)}
                className={cn(
                  'flex w-full items-start gap-4 rounded-[28px] border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
                  isSelected
                    ? 'border-emerald-400/45 bg-emerald-400/12 shadow-[0_0_24px_rgba(52,211,153,0.12)]'
                    : 'border-white/10 bg-white/[0.03] active:bg-white/[0.06]',
                )}
              >
                <div
                  className={cn(
                    'mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border',
                    isSelected ? 'border-emerald-300/50 bg-emerald-400 text-black' : 'border-white/10 bg-black/30 text-white/30',
                  )}
                >
                  {isSelected ? <Check className="h-5 w-5" strokeWidth={3} /> : <Brain className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black text-white">{cursus.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{cursus.subtitle}</p>
                  <p className="mt-3 text-xs font-bold leading-relaxed text-white/35">{cursus.tone}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </FullScreenSlideModal>
  )
}

export default function ChaptersPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<AcademyProgress>(() =>
    getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID),
  )
  const [lockedChapterTitle, setLockedChapterTitle] = useState<string | null>(null)
  const [showCursusModal, setShowCursusModal] = useState(false)

  useEffect(() => {
    setProgress(academyRepository.getProgress(MOCK_ACADEMY_VIEWER_ID))
  }, [])

  const handleCursusSelect = (cursusId: AcademyProgress['selectedCursusId']) => {
    setProgress(academyRepository.setCursus(MOCK_ACADEMY_VIEWER_ID, cursusId))
    setShowCursusModal(false)
  }

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
        <CursusSummary selectedId={progress.selectedCursusId} onOpen={() => setShowCursusModal(true)} />

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
                  if (isLocked) {
                    setLockedChapterTitle(chapter.title)
                    return
                  }
                  router.push('/academy')
                }}
                whileTap={!isLocked ? { scale: 0.96 } : {}}
                className={cn(
                  'relative flex w-full items-center gap-5 rounded-[32px] border-2 p-5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
                  'cursor-pointer',
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

        {showCursusModal && (
          <CursusModal
            selectedId={progress.selectedCursusId}
            onSelect={handleCursusSelect}
            onClose={() => setShowCursusModal(false)}
          />
        )}

        {lockedChapterTitle && (
          <FullScreenSlideModal
            title="Chapitre verrouillé"
            headerMode="close"
            onClose={() => setLockedChapterTitle(null)}
            className="z-[90] bg-[#05050A] text-white"
          >
            <div className="mx-auto flex min-h-full max-w-sm flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Lock className="h-7 w-7 text-white/45" />
              </div>
              <h3 className="mb-2 text-xl font-black text-white">{lockedChapterTitle}</h3>
              <p className="mb-6 text-sm leading-relaxed text-white/55">
                Termine le chapitre actif pour débloquer cette partie du voyage.
              </p>
              <button
                type="button"
                onClick={() => setLockedChapterTitle(null)}
                className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-black shadow-[0_5px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
              >
                Compris
              </button>
            </div>
          </FullScreenSlideModal>
        )}
      </div>
    </FullScreenSlideModal>
  )
}
