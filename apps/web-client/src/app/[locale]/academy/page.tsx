'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, Flame, Sprout, Crown, BookOpen, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter, Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getCurrentChapter, getNextChapter, type AcademyUnit } from '@/lib/mock/mock-academy'

// ─── Data ──────────────────────────────────────────────────────────────────
const currentChapter = getCurrentChapter()
const nextChapter = getNextChapter()

// ─── Loading steps ─────────────────────────────────────────────────────────
const LOADING_STEPS = [
  { label: 'Chargement du cours…',        duration: 650 },
  { label: 'Préparation des exercices…',   duration: 750 },
  { label: 'Ajustement à ton niveau…',     duration: 600 },
  { label: 'C\'est parti 🚀',              duration: 400 },
]

// ─── Sub-components ────────────────────────────────────────────────────────

function MascotSpacer({ mascotte, side, isLocked }: { mascotte: string; side: 'left' | 'right'; isLocked: boolean }) {
  return (
    <div className="relative w-20 h-28 overflow-visible flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 8 }}
        animate={{ opacity: isLocked ? 0.2 : 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 w-36 h-36 pointer-events-none',
          side === 'right' ? 'left-full translate-x-2' : 'right-full -translate-x-2',
          isLocked && 'grayscale',
        )}
      >
        <Image
          src={`/${mascotte}.png`}
          alt={mascotte}
          fill
          className={cn('object-contain drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]', side === 'left' && 'scale-x-[-1]')}
        />
      </motion.div>
    </div>
  )
}

function LockedUnitModal({ unit, onClose }: { unit: AcademyUnit; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111116] border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
          <Lock className="w-7 h-7 text-white/50" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">{unit.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Termine tous les niveaux précédents pour débloquer celui-ci.
        </p>
        <button onClick={onClose} className="w-full bg-white/10 text-white font-bold rounded-2xl py-4 shadow-[0_5px_0_rgba(0,0,0,0.5)] hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] hover:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] transition-all duration-100">
          Compris !
        </button>
      </motion.div>
    </motion.div>
  )
}

function CourseLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let accumulated = 0
    LOADING_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setStepIndex(i)
        setProgress(Math.round(((i + 1) / LOADING_STEPS.length) * 100))
        if (i === LOADING_STEPS.length - 1) {
          setTimeout(onComplete, step.duration)
        }
      }, accumulated)
      accumulated += step.duration
    })
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-[#05050A] flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Pulsing orb */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-32 rounded-full bg-emerald-500/20 border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.3)] flex items-center justify-center mb-10"
      >
        <span className="text-5xl">🌿</span>
      </motion.div>

      <h2 className="text-2xl font-black text-white mb-2">Préparation du cours</h2>

      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-white/50 text-sm mb-10 h-5"
        >
          {LOADING_STEPS[stepIndex]?.label}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-2.5 bg-white/10 rounded-full overflow-hidden mb-3">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
        />
      </div>
      <span className="text-white/30 text-xs tabular-nums">{progress}%</span>
    </motion.div>
  )
}

/** Nœud de cours — design inspiré Duolingo/Brilliant avec ombre 3D et dégradé */
function UnitNode({
  unit,
  index,
  onSelect,
  onLocked,
}: {
  unit: AcademyUnit
  index: number
  onSelect: (unit: AcademyUnit) => void
  onLocked: (unit: AcademyUnit) => void
}) {
  const isLocked    = unit.status === 'locked'
  const isCompleted = unit.status === 'completed'
  const isActive    = unit.status === 'active'

  return (
    <button
      onClick={() => {
        if (isLocked) return onLocked(unit)
        return onSelect(unit)
      }}
      className="relative group focus:outline-none"
      aria-label={unit.title}
    >
      {/* ── Outer glow (active only) */}
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-[24px] bg-emerald-500/30 blur-xl -z-10"
        />
      )}

      {/* ── Main button surface */}
      <div
        className={cn(
          // Base: size + shape + transition snappy
          'w-[72px] h-[72px] rounded-[22px] flex items-center justify-center relative transition-all duration-100',
          // Active: vibrant gradient + deep 3D shadow
          isActive && [
            'bg-gradient-to-b from-emerald-400 to-emerald-600',
            'border-t border-white/25',
            'shadow-[0_7px_0_#065f46,0_0_35px_rgba(16,185,129,0.45)]',
            'group-hover:shadow-[0_5px_0_#065f46,0_0_35px_rgba(16,185,129,0.45)] group-hover:translate-y-[2px]',
            'group-active:shadow-[0_1px_0_#065f46] group-active:translate-y-[6px]',
          ],
          // Completed: subtle glass 3D
          isCompleted && [
            'bg-gradient-to-b from-white/12 to-white/4',
            'border border-emerald-500/25',
            'shadow-[0_5px_0_rgba(52,211,153,0.15)]',
            'group-hover:shadow-[0_3px_0_rgba(52,211,153,0.15)] group-hover:translate-y-[2px]',
            'group-active:shadow-[0_1px_0_rgba(52,211,153,0.15)] group-active:translate-y-[4px]',
          ],
          // Locked: dark matte — minimal press
          isLocked && [
            'bg-gradient-to-b from-white/5 to-black/30',
            'border border-white/8',
            'shadow-[0_3px_0_rgba(0,0,0,0.6)]',
            'opacity-55',
            'group-active:shadow-[0_1px_0_rgba(0,0,0,0.6)] group-active:translate-y-[2px]',
          ],
        )}
      >
        {isActive    && <Flame className="w-8 h-8 text-white fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />}
        {isCompleted && <Check className="w-8 h-8 text-emerald-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" strokeWidth={3} />}
        {isLocked    && <Lock  className="w-7 h-7 text-white/30" />}

        {/* Top-edge highlight (gives 3D "pill" effect) */}
        {!isLocked && (
          <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
        )}
      </div>

      {/* ── "C'est ici!" bubble */}
      {isActive && (
        <motion.div
          initial={{ y: 0, opacity: 0.8 }}
          animate={{ y: [-2, 4, -2], opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-11 -right-24 bg-white text-black px-3 py-1.5 rounded-2xl rounded-bl-none text-sm font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap z-10"
        >
          <Image src="/sylva.png" alt="Sylva" width={22} height={22} className="object-contain" />
          C'est ici !
        </motion.div>
      )}
    </button>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AcademyPage() {
  const router = useRouter()
  const [selectedUnit,   setSelectedUnit]   = useState<AcademyUnit | null>(null)
  const [lockedUnit,     setLockedUnit]     = useState<AcademyUnit | null>(null)
  const [loadingTarget,  setLoadingTarget]  = useState<string | null>(null)

  const units = currentChapter.units

  const handleStartCourse = useCallback((unit: AcademyUnit) => {
    setSelectedUnit(null)
    setLoadingTarget(`/academy/chapitre-1/${unit.id}`)
  }, [])

  const handleLoadingComplete = useCallback(() => {
    if (loadingTarget) router.push(loadingTarget)
  }, [loadingTarget, router])

  return (
    <FullScreenSlideModal
      headerMode="none"
      className="bg-[#05050A] text-white overflow-x-hidden font-sans relative"
      contentClassName="pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      {/* Background dot-grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative z-10">
        {/* ── HEADER ───────────────────────────────────────────────── */}
        <header className="fixed top-0 w-full z-40 backdrop-blur-md bg-white/5 border-b border-white/5 px-4 flex justify-between items-center pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5">

          {/* Left: chapter navigator */}
          <Link href="/academy/chapters" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white/10 active:scale-95 group">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-black text-white leading-none">Chapitre {currentChapter.id}</span>
            <ChevronDown className="w-3 h-3 text-white/40 group-hover:text-white/70 transition-colors" />
          </Link>

          {/* Center: streak + seeds */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="text-[11px] font-bold text-white">12 j</span>
            </div>
            <Link href="/seeds" prefetch={false} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 transition-transform hover:scale-105 active:scale-95">
              <Sprout className="h-3.5 w-3.5 text-lime-400" />
              <span className="text-[11px] font-bold text-white tabular-nums">2 450</span>
            </Link>
          </div>

          {/* Right: premium / subscription */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 cursor-pointer shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:bg-indigo-500/30 transition-colors active:scale-95">
            <Crown className="w-4 h-4 fill-indigo-400/20" />
          </div>
        </header>


        {/* ── MAIN ─────────────────────────────────────────────────── */}
        <main className="pt-[calc(6rem+env(safe-area-inset-top))] px-6">
          {/* Chapter banner */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 p-4 z-10">
              <span className="text-sm font-bold text-white/80 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">2/4 👑</span>
            </div>
            <div className="w-24 h-24 mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <Image src="/abeille-transparente.png" alt="Melli" fill className="object-contain" />
            </div>
            <h2 className="text-emerald-400 text-xs font-black tracking-[0.2em] mb-2 uppercase relative z-10">CHAPITRE {currentChapter.id}</h2>
            <h1 className="text-3xl font-black text-white mb-2 relative z-10">{currentChapter.title}</h1>
            <p className="text-sm text-white/60 relative z-10 max-w-[250px]">{currentChapter.subtitle}</p>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[50px] rounded-full" />
          </div>

          {/* ── ZIGZAG TREE ─────────────────────────────────────────── */}
          <div className="flex flex-col items-center mt-12 pb-[max(8rem,calc(4rem+env(safe-area-inset-bottom)))]">
            {units.flatMap((unit, index) => {
              const nextUnit = units[index + 1]
              const isGoingLeft  = index % 4 === 1
              const isGoingRight = index % 4 === 3
              const alignmentClass = isGoingLeft ? 'mr-20' : isGoingRight ? 'ml-20' : ''

              let mascotSpacer: JSX.Element | null = null
              if (nextUnit) {
                const nextAlignment = (index + 1) % 4
                if (nextAlignment === 1) {
                  mascotSpacer = <MascotSpacer key={`m-${index}`} mascotte={nextUnit.mascotte} side="right" isLocked={nextUnit.status === 'locked'} />
                } else if (nextAlignment === 3) {
                  mascotSpacer = <MascotSpacer key={`m-${index}`} mascotte={nextUnit.mascotte} side="left" isLocked={nextUnit.status === 'locked'} />
                }
              }

              const nodeEl = (
                <div key={unit.id} className={cn('relative mt-6', alignmentClass)}>
                  <UnitNode unit={unit} index={index} onSelect={setSelectedUnit} onLocked={setLockedUnit} />
                </div>
              )

              return mascotSpacer ? [nodeEl, mascotSpacer] : [nodeEl]
            })}
          </div>

          {/* ── NEXT CHAPTER TEASER ─────────────────────────────── */}
          {(() => {
            const chapterDone = units.every(u => u.status === 'completed')
            return (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                className={cn(
                  'w-full rounded-3xl overflow-hidden border relative',
                  chapterDone
                    ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/40'
                    : 'bg-white/3 border-white/8'
                )}
              >
                {/* Glow de fond */}
                {chapterDone && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 pointer-events-none" />
                )}

                <div className="relative z-10 p-6 flex flex-col gap-3">
                  {/* Badge */}
                  <span className={cn(
                    'self-start text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border',
                    chapterDone
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-white/5 border-white/10 text-white/40'
                  )}>
                    À suivre
                  </span>

                  {/* Titre */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className={cn(
                        'text-xs font-bold uppercase tracking-widest mb-1',
                        chapterDone ? 'text-indigo-400' : 'text-white/30'
                      )}>
                        {nextChapter ? `Chapitre ${nextChapter.id}` : 'Félicitations !'}
                      </p>
                      <h3 className={cn(
                        'text-xl font-black leading-tight',
                        chapterDone ? 'text-white' : 'text-white/40'
                      )}>
                        {nextChapter ? nextChapter.title : 'Tu as tout terminé'}
                      </h3>
                    </div>
                    <div className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl',
                      chapterDone
                        ? 'bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                        : 'bg-white/5 border border-white/10'
                    )}>
                      {chapterDone && nextChapter ? '🔓' : chapterDone ? '🏆' : '🔒'}
                    </div>
                  </div>

                  {/* Description */}
                  <p className={cn(
                    'text-sm leading-relaxed',
                    chapterDone ? 'text-white/70' : 'text-white/25'
                  )}>
                    {chapterDone
                      ? (nextChapter ? `Bravo ! Tu peux maintenant explorer : ${nextChapter.subtitle}` : 'Tu as exploré tous les chapitres de l\'académie !')
                      : `Termine tous les niveaux du Chapitre ${currentChapter.id} pour débloquer la suite.`}
                  </p>

                  {/* CTA */}
                  {chapterDone && nextChapter && (
                    <motion.button
                      whileTap={{ y: 3, boxShadow: '0 1px 0 #3730a3' }}
                      style={{ boxShadow: '0 5px 0 #3730a3' }}
                      className="mt-2 w-full bg-indigo-600 text-white font-black text-sm rounded-2xl py-3.5 transition-colors hover:bg-indigo-500"
                    >
                      COMMENCER LE CHAPITRE {nextChapter.id}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })()}
        </main>

        {/* ── MODALES ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedUnit && (
            <FullScreenSlideModal
              key="prep-modal"
              headerMode="dynamic"
              title={selectedUnit.title}
              onClose={() => setSelectedUnit(null)}
              className="bg-[#05050A]"
            >
              <div className="relative h-64 bg-emerald-900/30 rounded-b-[40px] overflow-hidden shrink-0 mt-[-env(safe-area-inset-top)]">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/20 to-transparent z-10 pointer-events-none" />
                {/* Glow orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-emerald-500/25 blur-[70px] rounded-full" />
                {/* Mascotte — centrée, en avant du gradient */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                  transition={{
                    scale: { duration: 0.4, ease: 'backOut' },
                    opacity: { duration: 0.3 },
                    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                  }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-40 h-40 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]"
                >
                  <Image
                    src={`/${selectedUnit.mascotte}.png`}
                    alt={selectedUnit.mascotte}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>

              <div className="flex-1 px-6 pt-8 pb-32 flex flex-col items-center text-center">
                <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-4">
                  Chapitre {currentChapter.id} — Unité {selectedUnit.id}
                </span>
                <h2 className="text-3xl font-black text-white mb-4 leading-tight">{selectedUnit.title}</h2>
                {selectedUnit.description && (
                  <p className="text-white/70 text-base leading-relaxed mb-8">{selectedUnit.description}</p>
                )}
                <div className="flex gap-4 mb-auto">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white/90 text-sm font-medium flex items-center gap-2 shadow-lg">
                    <span>⏱️</span> 2 min
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white/90 text-sm font-medium flex items-center gap-2 shadow-lg">
                    <span>🧠</span> 4 exercices
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 left-0 w-full p-6 pb-[max(2rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#05050A] via-[#05050A]/95 to-transparent z-20">
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 bg-emerald-900/40 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    🎁 Récompense à la clé : +{selectedUnit.reward}
                  </span>
                </div>
                <button
                  onClick={() => handleStartCourse(selectedUnit)}
                  className="w-full bg-emerald-500 text-black text-lg font-black rounded-2xl py-5 shadow-[0_6px_0_#065f46] hover:shadow-[0_4px_0_#065f46] hover:translate-y-0.5 active:shadow-[0_1px_0_#065f46] active:translate-y-[5px] transition-all duration-100"
                >
                  DÉMARRER L'EXPLORATION
                </button>
              </div>
            </FullScreenSlideModal>
          )}

          {lockedUnit && (
            <LockedUnitModal key="locked-modal" unit={lockedUnit} onClose={() => setLockedUnit(null)} />
          )}

          {loadingTarget && (
            <CourseLoadingScreen key="loading-screen" onComplete={handleLoadingComplete} />
          )}
        </AnimatePresence>
      </div>
    </FullScreenSlideModal>
  )
}
