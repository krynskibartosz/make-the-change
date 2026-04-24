'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { X, Check, ArrowRight, RefreshCcw, ChevronLeft, ChevronRight, Heart, HeartCrack, Droplet } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { cn } from '@/lib/utils'
import { DndContext, useDraggable, useDroppable, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor, closestCenter } from '@dnd-kit/core'
import Image from 'next/image'
import confetti from 'canvas-confetti'

// --- MOCK DATA (L'Unité 1.1: Les Forges de la Vie) ---
const unitData = {
  id: "1.1",
  chapitre_id: "chapitre-1",
  titre: "Les Forges de la Vie",
  concept_cle: "Énergie, Minéraux, Hydratation",
  mascotte: "ondine", // 'ondine', 'sylva', ou 'abeille-transparente'
  recompense: { type: "gouttes", montant: 10, icone: "💧" },
  exercices: [
    {
      id: "ex_1",
      type: "STORY",
      ecrans: [
        { texte: "Soleil, eau, sol : les trois piliers de la vie.", bg: "bg-emerald-900", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop" },
        { texte: "Ensemble, ils forgent l'énergie de toute la nature.", bg: "bg-emerald-800", img: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1000&auto=format&fit=crop" }
      ]
    },
    {
      id: "ex_2",
      type: "SWIPE",
      question: "Est-ce un ingrédient indispensable à la création de la vie ?",
      carte_droite: { nom: "L'eau douce", est_correct: true, feedback: "Génial ! Sans eau, les cellules de la vie ne peuvent pas s'hydrater." },
      carte_gauche: { nom: "Le goudron", est_correct: false, feedback: "Oups ! Le goudron asphyxie nos sols et empêche l'eau de circuler." }
    },
    {
      id: "ex_3",
      type: "DRAG_DROP",
      consigne: "Ordonne ces éléments du plus lointain au plus profond :",
      ordre_correct: [
        { id: "item1", texte: "Le Soleil (Espace)" },
        { id: "item2", texte: "L'Eau (Surface)" },
        { id: "item3", texte: "Les Minéraux (Sous-sol)" }
      ]
    },
    {
      id: "ex_4",
      type: "QUIZ",
      question: "Quel élément fournit l'énergie de base à presque toute la Terre ?",
      options: [
        { texte: "Le vent fougueux", est_correct: false },
        { texte: "La roche magmatique", est_correct: false },
        { texte: "Le Soleil", est_correct: true }
      ],
      anecdote_victoire: "Bingo ! Les plantes capturent sa lumière pour nourrir toute la chaîne alimentaire."
    }
  ]
}

// --- COMPONENTS ---

function ExerciseHeader({ progress, total, onQuit, lives }: { progress: number, total: number, onQuit: () => void, lives: number }) {
  return (
    <div className="absolute top-0 inset-x-0 z-50 p-4 pt-[max(1rem,env(safe-area-inset-top))] flex items-center gap-4 bg-[#05050A]/60 backdrop-blur-md border-b border-white/5">
      <button onClick={onQuit} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white/60 hover:bg-black/40 hover:text-white transition-colors backdrop-blur-md shrink-0">
        <X className="w-6 h-6" />
      </button>
      <div className="flex-1 flex gap-1.5 h-3">
        {Array.from({ length: total }).map((_, i) => {
          const isCompleted = progress > i
          const isActive = progress === i

          return (
            <div key={i} className="flex-1 h-full rounded-full bg-white/10 overflow-hidden relative">
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-emerald-500/30"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <motion.div
                className="absolute inset-0 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          )
        })}
      </div>

      {/* Vies — compteur compact avec animation de perte */}
      <motion.div
        key={lives}
        animate={lives > 0 ? { x: [0, -5, 5, -5, 5, 0] } : { scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border shrink-0 transition-colors duration-300',
          lives >= 3
            ? 'bg-red-500/10 border-red-500/25'
            : lives >= 1
              ? 'bg-amber-500/10 border-amber-500/25'
              : 'bg-white/5 border-white/10 opacity-50'
        )}
      >
        <Heart className="w-4 h-4 fill-current shrink-0" />
        <span className={cn(
          'text-sm font-black tabular-nums leading-none',
          lives >= 3 ? 'text-red-400' : lives >= 1 ? 'text-amber-400' : 'text-white/30'
        )}>
          {lives}
        </span>
      </motion.div>
    </div>
  )
}

function StoryExercise({ exercise, onComplete }: { exercise: any, onComplete: () => void }) {
  const [currentScreen, setCurrentScreen] = useState(0)

  const handleNext = () => {
    if (currentScreen < exercise.ecrans.length - 1) {
      setCurrentScreen(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentScreen > 0) setCurrentScreen(prev => prev - 1)
  }

  return (
    <div className="w-full h-full relative bg-black flex flex-col">
      {/* ProgressBar style Instagram */}
      <div className="absolute top-20 inset-x-4 z-10 flex gap-1 h-1">
        {exercise.ecrans.map((_: any, i: number) => (
          <div key={i} className="flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: i < currentScreen ? '100%' : i === currentScreen ? '100%' : '0%' }}
              transition={i === currentScreen ? { duration: 5, ease: 'linear' } : { duration: 0 }}
              onAnimationComplete={() => {
                if (i === currentScreen) handleNext()
              }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={cn("absolute inset-0 bg-cover bg-center", exercise.ecrans[currentScreen].bg)}
          style={{ backgroundImage: exercise.ecrans[currentScreen].img ? `url(${exercise.ecrans[currentScreen].img})` : undefined }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* Overlay gérant à la fois les Taps et les Swipes horizontaux */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.x < -50) handleNext()
          else if (info.offset.x > 50) handlePrev()
        }}
        className="absolute inset-0 z-20 flex cursor-grab active:cursor-grabbing"
      >
        <div className="flex-1 h-full cursor-pointer" onClick={handlePrev} />
        <div className="flex-1 h-full cursor-pointer" onClick={handleNext} />
      </motion.div>

      <div className="mt-auto relative z-10 p-8 pb-32 pointer-events-none">
        <motion.h2
          key={`text-${currentScreen}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-black text-white leading-tight"
        >
          {exercise.ecrans[currentScreen].texte}
        </motion.h2>
      </div>
    </div>
  )
}

function SwipeExercise({ exercise, onResult, attempt }: { exercise: any, onResult: (correct: boolean, feedback: string) => void, attempt?: number }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const bgCorrect = useTransform(x, [0, 150], ['rgba(16, 185, 129, 0)', 'rgba(16, 185, 129, 0.4)'])
  const bgWrong = useTransform(x, [0, -150], ['rgba(239, 68, 68, 0)', 'rgba(239, 68, 68, 0.4)'])

  useEffect(() => {
    x.set(0)
  }, [attempt, x])

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x > 100) {
      onResult(exercise.carte_droite.est_correct, exercise.carte_droite.feedback)
    } else if (info.offset.x < -100) {
      onResult(exercise.carte_gauche.est_correct, exercise.carte_gauche.feedback)
    }
  }

  return (
    <div className="w-full h-full relative bg-[#05050A] flex flex-col items-center justify-center p-6 pt-28 overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: bgCorrect }} />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: bgWrong }} />

      <h2 className="text-xl font-bold text-white text-center mb-10 relative z-10">{exercise.question}</h2>

      <div className="relative w-full max-w-sm aspect-[3/4]">
        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-3xl scale-95 translate-y-4" />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{
            x, rotate, opacity,
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop')`
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 bg-cover bg-center border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl cursor-grab active:cursor-grabbing"
        >
          <div className="w-24 h-24 bg-blue-500/10 backdrop-blur-md rounded-full mb-8 flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Droplet className="w-12 h-12 text-blue-400 fill-blue-400" />
          </div>
          <h3 className="text-2xl font-black text-white text-center">L'Eau Douce</h3>
          <p className="text-white/70 text-center text-sm mt-2 mb-auto">Source de toute vie</p>
          <div className="mt-auto flex justify-between w-full text-xs font-bold text-white uppercase tracking-widest bg-black/40 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10">
            <span className="text-red-400 flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" />{exercise.carte_gauche.nom}</span>
            <span className="text-emerald-400 flex items-center gap-1">{exercise.carte_droite.nom}<ChevronRight className="w-3.5 h-3.5" /></span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function DraggableItem({ id, text }: { id: string, text: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white font-medium text-center shadow-lg active:scale-105 active:shadow-2xl transition-shadow cursor-grab active:cursor-grabbing touch-none",
        isDragging && "opacity-50 z-50 scale-105"
      )}
    >
      {text}
    </div>
  )
}

function DroppableSlot({ id, index, item }: { id: string, index: number, item: any }) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={setNodeRef}
        className={cn(
          "w-full h-16 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors",
          isOver ? "border-emerald-500 bg-emerald-500/10" : "border-white/20 bg-white/5",
          item && "border-solid border-emerald-500/50 bg-emerald-500/20"
        )}
      >
        {item ? <div className="text-white font-medium">{item.texte}</div> : <span className="text-white/30 text-sm">Emplacement {index + 1}</span>}
      </div>
      {index < 2 && <ArrowRight className="w-6 h-6 text-white/30 my-2 rotate-90" />}
    </div>
  )
}

function DragDropExercise({ exercise, onResult, attempt }: { exercise: any, onResult: (correct: boolean, feedback: string) => void, attempt?: number }) {
  const items = exercise.ordre_correct
  const [shuffledItems] = useState(() => [...items].sort(() => Math.random() - 0.5))
  const [slots, setSlots] = useState<Record<string, any>>({ slot_0: null, slot_1: null, slot_2: null })
  const [availableItems, setAvailableItems] = useState(shuffledItems)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  )

  useEffect(() => {
    setSlots({ slot_0: null, slot_1: null, slot_2: null })
    setAvailableItems(shuffledItems)
  }, [attempt, shuffledItems])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && over.id.toString().startsWith('slot_')) {
      const slotId = over.id as string
      const item = availableItems.find(i => i.id === active.id)
      if (item && !slots[slotId]) {
        setSlots(prev => ({ ...prev, [slotId]: item }))
        setAvailableItems(prev => prev.filter(i => i.id !== item.id))
      }
    }
  }

  const handleVerify = () => {
    const isCorrect =
      slots.slot_0?.id === items[0].id &&
      slots.slot_1?.id === items[1].id &&
      slots.slot_2?.id === items[2].id

    onResult(isCorrect, isCorrect ? "Parfait ! La chronologie est exacte." : "Mince ! L'ordre n'est pas le bon. Le soleil est le plus lointain.")
  }

  const handleReset = () => {
    setSlots({ slot_0: null, slot_1: null, slot_2: null })
    setAvailableItems(shuffledItems)
  }

  const isComplete = Object.values(slots).every(Boolean)

  return (
    <div className="w-full h-full relative bg-[#05050A] flex flex-col p-6 pt-28 overflow-y-auto pb-40">
      <h2 className="text-xl font-bold text-white text-center mb-8 shrink-0">{exercise.consigne}</h2>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center max-w-sm mx-auto w-full">
          {/* Slots */}
          <div className="w-full flex flex-col items-center mb-8">
            <DroppableSlot id="slot_0" index={0} item={slots.slot_0} />
            <DroppableSlot id="slot_1" index={1} item={slots.slot_1} />
            <DroppableSlot id="slot_2" index={2} item={slots.slot_2} />
          </div>

          {/* Available Items */}
          <div className="w-full flex flex-col gap-3">
            {availableItems.map(item => (
              <DraggableItem key={item.id} id={item.id} text={item.texte} />
            ))}
          </div>
        </div>
      </DndContext>

      {isComplete && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky bottom-0 mt-8 flex gap-4">
          <button onClick={handleReset} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-[0_5px_0_rgba(0,0,0,0.4)] hover:shadow-[0_3px_0_rgba(0,0,0,0.4)] hover:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.4)] active:translate-y-1 transition-all duration-100">
            <RefreshCcw className="w-6 h-6" />
          </button>
          <button onClick={handleVerify} className="flex-1 bg-emerald-500 text-black font-black text-lg rounded-2xl py-4 shadow-[0_6px_0_#065f46] hover:shadow-[0_4px_0_#065f46] hover:translate-y-0.5 active:shadow-[0_1px_0_#065f46] active:translate-y-[5px] transition-all duration-100">
            VÉRIFIER
          </button>
        </motion.div>
      )}
    </div>
  )
}

function QuizExercise({ exercise, onResult, attempt }: { exercise: any, onResult: (correct: boolean, feedback: string) => void, attempt?: number }) {
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    setSelected(null)
  }, [attempt])

  const handleSelect = (index: number) => {
    setSelected(index)
    const opt = exercise.options[index]
    setTimeout(() => {
      onResult(opt.est_correct, opt.est_correct ? exercise.anecdote_victoire : "Oups, ce n'est pas la bonne réponse.")
    }, 600)
  }

  return (
    <div className="w-full h-full relative bg-[#05050A] flex flex-col p-6 pt-32 overflow-y-auto pb-24">
      <h2 className="text-2xl font-black text-white text-center mb-12 shrink-0">{exercise.question}</h2>

      <div className="flex flex-col gap-4 mt-auto">
        {exercise.options.map((opt: any, index: number) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={selected !== null}
            className={cn(
              "w-full p-5 rounded-2xl text-left font-bold text-base transition-all duration-100",
              selected === index
                ? "bg-emerald-500 text-black shadow-[0_2px_0_#065f46] translate-y-1"
                : selected !== null
                  ? "bg-white/5 border border-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 border border-white/10 text-white shadow-[0_5px_0_rgba(0,0,0,0.5)] hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] hover:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.5)] active:translate-y-1"
            )}
          >
            {opt.texte}
          </button>
        ))}
      </div>
    </div>
  )
}

function FeedbackScreen({ correct, feedback, mascotte, onNext }: { correct: boolean, feedback: string, mascotte: string, onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="absolute inset-x-0 bottom-0 z-[100] rounded-t-3xl border-t border-white/10 shadow-2xl p-6 pb-[max(2rem,env(safe-area-inset-bottom))]"
      style={{
        background: correct
          ? 'linear-gradient(to top, rgba(16,185,129,0.15), rgba(5,5,10,0.98))'
          : 'linear-gradient(to top, rgba(239,68,68,0.1), rgba(5,5,10,0.98))'
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Mascotte compacte */}
        <div className={cn('relative w-14 h-14 shrink-0', !correct && 'grayscale opacity-60')}>
          <Image src={`/${mascotte}.png`} alt="Mascotte" fill className="object-contain" />
        </div>
        <div>
          <p className={cn('text-lg font-black', correct ? 'text-emerald-400' : 'text-red-400')}>
            {correct ? 'Excellent !' : 'Pas tout à fait...'}
          </p>
          <p className="text-white/70 text-sm leading-snug">{feedback}</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className={cn(
          'w-full font-black text-lg rounded-2xl py-5 transition-all duration-100 mt-2',
          correct
            ? 'bg-emerald-500 text-black shadow-[0_6px_0_#065f46] hover:shadow-[0_4px_0_#065f46] hover:translate-y-0.5 active:shadow-[0_1px_0_#065f46] active:translate-y-[5px]'
            : 'bg-white/10 text-white border border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.5)] hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] hover:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.5)] active:translate-y-[4px]'
        )}
      >
        CONTINUER
      </button>
    </motion.div>
  )
}

function VictoryScreen({ unit, onFinish }: { unit: any, onFinish: () => void }) {
  useEffect(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#10B981', '#34D399', '#059669'] })
  }, [])

  return (
    <div className="flex-1 bg-[#05050A] flex flex-col items-center justify-center p-8 text-center pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="relative w-48 h-48 bg-white/5 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] mb-12 overflow-hidden"
      >
        <Image src="/ondine.png" alt="Ondine la mascotte" width={120} height={120} className="object-contain" />
      </motion.div>

      <h2 className="text-4xl font-black text-white mb-2">Unité Complétée !</h2>
      <p className="text-emerald-400 text-xl font-bold mb-12">+{unit.recompense.montant} {unit.recompense.type}</p>

      <button
        onClick={onFinish}
        className="w-full bg-emerald-500 text-black text-xl font-black rounded-3xl py-6 shadow-[0_7px_0_#065f46] hover:shadow-[0_5px_0_#065f46] hover:translate-y-0.5 active:shadow-[0_1px_0_#065f46] active:translate-y-[6px] transition-all duration-100 mt-auto mb-8"
      >
        RETOUR À L'ACADéMIE
      </button>
    </div>
  )
}

function GameOverScreen({ onQuit }: { onQuit: () => void }) {
  return (
    <div className="flex-1 bg-[#05050A] flex flex-col items-center justify-center p-8 text-center pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-red-500 mb-8 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]"
      >
        <HeartCrack className="w-24 h-24" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-white mb-3"
      >
        Plus de vies !
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-white/60 text-base leading-relaxed mb-6 max-w-xs"
      >
        Tu as épuisé toutes tes vies. Reviens demain pour réessayer — elles se rechargent avec le temps.
      </motion.p>

      {/* Coeurs vides */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2 mb-12"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Heart key={i} className="w-6 h-6 fill-current text-white opacity-20" />
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={onQuit}
        className="w-full bg-white/10 text-white font-black text-lg rounded-2xl py-5 shadow-[0_5px_0_rgba(0,0,0,0.5)] hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] hover:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] transition-all duration-100 mt-auto"
      >
        RETOUR À L'ACADéMIE
      </motion.button>
    </div>
  )
}

// --- ENGINE (STATE MACHINE) ---

export default function ExerciseEngine() {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ show: boolean, correct: boolean, text: string } | null>(null)
  const [showQuitModal, setShowQuitModal] = useState(false)
  const [lives, setLives] = useState(5)

  const [attempt, setAttempt] = useState(0)

  const currentExercise = unitData.exercices[currentStepIndex]
  const isFinished = currentStepIndex >= unitData.exercices.length

  const handleResult = (correct: boolean, text: string) => {
    if (!correct) setLives(prev => Math.max(0, prev - 1))
    setFeedback({ show: true, correct, text })
  }

  const handleNextStep = () => {
    const wasCorrect = feedback?.correct
    setFeedback(null)
    if (wasCorrect || currentExercise?.type === 'STORY') {
      setAttempt(0)
      setCurrentStepIndex(prev => prev + 1)
    } else {
      setAttempt(prev => prev + 1)
    }
  }

  const confirmQuit = () => {
    router.push('/academy')
  }

  const isGameOver = lives === 0

  return (
    <FullScreenSlideModal headerMode="none" className="bg-[#05050A]" contentClassName="flex flex-col overflow-hidden h-full relative">
      {isFinished ? (
        <VictoryScreen unit={unitData} onFinish={() => router.push('/academy')} />
      ) : isGameOver ? (
        <GameOverScreen onQuit={() => router.push('/academy')} />
      ) : (
        <>
          <ExerciseHeader progress={currentStepIndex} total={unitData.exercices.length} onQuit={() => setShowQuitModal(true)} lives={lives} />

      <div className="flex-1 w-full h-full relative">
        <AnimatePresence mode="wait">
          {currentExercise && <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >

            {currentExercise.type === 'STORY' && <StoryExercise exercise={currentExercise} onComplete={handleNextStep} />}
            {currentExercise.type === 'SWIPE' && <SwipeExercise exercise={currentExercise} onResult={handleResult} attempt={attempt} />}
            {currentExercise.type === 'DRAG_DROP' && <DragDropExercise exercise={currentExercise} onResult={handleResult} attempt={attempt} />}
            {currentExercise.type === 'QUIZ' && <QuizExercise exercise={currentExercise} onResult={handleResult} attempt={attempt} />}
          </motion.div>}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {feedback?.show && (
          <FeedbackScreen correct={feedback.correct} feedback={feedback.text} mascotte={unitData.mascotte} onNext={handleNextStep} />
        )}

        {showQuitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111116] border border-white/10 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Quitter l'entraînement ?</h3>
              <p className="text-white/60 mb-8 font-medium">Toute ta progression dans cette unité sera perdue. Es-tu sûr de vouloir abandonner ?</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowQuitModal(false)}
                  className="w-full bg-white/10 text-white font-bold rounded-2xl py-4 shadow-[0_5px_0_rgba(0,0,0,0.4)] hover:shadow-[0_3px_0_rgba(0,0,0,0.4)] hover:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.4)] active:translate-y-1 transition-all duration-100"
                >
                  NON, JE CONTINUE
                </button>
                <button
                  onClick={confirmQuit}
                  className="w-full bg-red-500/20 text-red-500 font-bold rounded-2xl py-4 shadow-[0_5px_0_rgba(139,0,0,0.4)] hover:shadow-[0_3px_0_rgba(139,0,0,0.4)] hover:translate-y-0.5 active:shadow-[0_1px_0_rgba(139,0,0,0.4)] active:translate-y-1 transition-all duration-100"
                >
                  OUI, QUITTER
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </FullScreenSlideModal>
  )
}
