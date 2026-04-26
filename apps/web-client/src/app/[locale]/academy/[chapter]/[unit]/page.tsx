'use client'

import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Heart,
  HeartCrack,
  Lock,
  RefreshCcw,
  Sprout,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import {
  MOCK_ACADEMY_VIEWER_ID,
  academyRepository,
  getActiveUnit,
  getChapterBySlug,
  getDefaultAcademyProgress,
  getNextLessonForUnit,
  getUnitPrerequisite,
  getUnitBySlug,
  getEventUnitBySlug,
  isRewardAlreadyEarned,
  type AcademyDragDropExercise,
  type AcademyExercise,
  type AcademyLesson,
  type AcademyQuizExercise,
  type AcademyStoryExercise,
  type AcademySwipeExercise,
  type AcademyUnit,
} from '@/lib/mock/mock-academy'
import { cn } from '@/lib/utils'

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

function ExerciseHeader({
  progress,
  total,
  onQuit,
  lives,
}: {
  progress: number
  total: number
  onQuit: () => void
  lives: number
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-50 flex items-center gap-3 border-b border-white/5 bg-[#05050A]/60 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
      <button
        type="button"
        onClick={onQuit}
        aria-label="Quitter l'entraînement"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/20 text-white/60 backdrop-blur-md transition-colors touch-manipulation hover:bg-black/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="flex h-3 flex-1 gap-1.5">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = progress > index
          const isActive = progress === index

          return (
            <div key={index} className="relative h-full flex-1 overflow-hidden rounded-full bg-white/10">
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-emerald-500/30"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <motion.div
                className="absolute inset-0 origin-left bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>
          )
        })}
      </div>
      <motion.div
        key={lives}
        animate={lives > 0 ? { x: [0, -5, 5, -5, 5, 0] } : { scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className={cn(
          'flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3 transition-colors duration-300',
          lives >= 3 && 'border-red-500/25 bg-red-500/10',
          lives >= 1 && lives < 3 && 'border-amber-500/25 bg-amber-500/10',
          lives === 0 && 'border-white/10 bg-white/5 opacity-50',
        )}
      >
        <Heart className="h-4 w-4 shrink-0 fill-current" />
        <span
          className={cn(
            'text-sm font-black leading-none tabular-nums',
            lives >= 3 && 'text-red-400',
            lives >= 1 && lives < 3 && 'text-amber-400',
            lives === 0 && 'text-white/30',
          )}
        >
          {lives}
        </span>
      </motion.div>
    </div>
  )
}

function StoryExercise({
  exercise,
  onComplete,
}: {
  exercise: AcademyStoryExercise
  onComplete: () => void
}) {
  const [currentScreen, setCurrentScreen] = useState(0)
  const reduceMotion = useReducedMotion()
  const screen = exercise.screens[currentScreen]

  const handleNext = () => {
    if (currentScreen < exercise.screens.length - 1) {
      setCurrentScreen((previous) => previous + 1)
      return
    }

    onComplete()
  }

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen((previous) => previous - 1)
    }
  }

  if (!screen) {
    return null
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-black">
      <div className="absolute inset-x-4 top-20 z-10 flex h-1 gap-1">
        {exercise.screens.map((_, index) => (
          <div key={index} className="flex-1 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full bg-white"
              initial={false}
              animate={{ width: index <= currentScreen ? '100%' : '0%' }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: reduceMotion ? 1 : 1.08 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, scale: { duration: 8, ease: 'easeInOut', repeat: reduceMotion ? 0 : Infinity, repeatType: 'reverse' } }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: screen.imageUrl
              ? `url(${screen.imageUrl})`
              : 'linear-gradient(135deg, rgba(6,95,70,0.8), rgba(5,5,10,1))',
          }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) handleNext()
          else if (info.offset.x > 50) handlePrev()
        }}
        className="absolute inset-0 z-20 flex cursor-grab active:cursor-grabbing"
      >
        <button type="button" aria-label="Ecran precedent" onClick={handlePrev} className="h-full flex-1 cursor-pointer" />
        <button type="button" aria-label="Ecran suivant" onClick={handleNext} className="h-full flex-1 cursor-pointer" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={reduceMotion ? { opacity: 0.85 } : { opacity: [0.65, 1, 0.65], x: [8, 14, 8] }}
        transition={{ duration: 2, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-24 right-6 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 backdrop-blur-md"
      >
        <span className="text-xs font-black text-white/80">Appuie pour continuer</span>
        <ChevronRight className="h-5 w-5 text-white/70" />
      </motion.div>
      <div className="pointer-events-none relative z-10 mt-auto p-8 pb-32">
        <motion.h2 key={`text-${currentScreen}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-black leading-tight text-white">
          {screen.text}
        </motion.h2>
      </div>
    </div>
  )
}

function SwipeExercise({
  exercise,
  onResult,
  attempt,
}: {
  exercise: AcademySwipeExercise
  onResult: (correct: boolean, feedback: string) => void
  attempt: number
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const bgCorrect = useTransform(x, [0, 150], ['rgba(16, 185, 129, 0)', 'rgba(16, 185, 129, 0.4)'])
  const bgWrong = useTransform(x, [0, -150], ['rgba(239, 68, 68, 0)', 'rgba(239, 68, 68, 0.4)'])

  useEffect(() => {
    x.set(0)
  }, [attempt, x])

  const answer = (direction: 'left' | 'right') => {
    const correct = direction === exercise.correctDirection
    onResult(correct, correct ? exercise.correctFeedback : exercise.incorrectFeedback)
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#05050A] p-6 pt-28">
      <motion.div className="pointer-events-none absolute inset-0" style={{ backgroundColor: bgCorrect }} />
      <motion.div className="pointer-events-none absolute inset-0" style={{ backgroundColor: bgWrong }} />
      <h2 className="relative z-10 mb-3 text-center text-xl font-bold text-white">{exercise.question}</h2>
      <p className="relative z-10 mb-7 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-center text-xs font-bold text-white/55">
        Choisis une réponse ou glisse la carte.
      </p>
      <div className="relative aspect-[3/4] w-full max-w-sm">
        <div className="absolute inset-0 translate-y-4 scale-95 rounded-3xl border border-white/10 bg-white/5" />
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{
            x,
            rotate,
            opacity,
            backgroundImage: exercise.card.imageUrl
              ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${exercise.card.imageUrl}')`
              : 'linear-gradient(to bottom, rgba(6,95,70,0.65), rgba(0,0,0,0.9))',
          }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) answer('right')
            else if (info.offset.x < -100) answer('left')
          }}
          className="absolute inset-0 flex cursor-grab flex-col items-center justify-center rounded-3xl border border-white/20 bg-cover bg-center p-8 shadow-2xl active:cursor-grabbing"
        >
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-md">
            <Droplet className="h-12 w-12 fill-blue-400 text-blue-400" />
          </div>
          <h3 className="text-center text-2xl font-black text-white">{exercise.card.title}</h3>
          <p className="mb-auto mt-2 text-center text-sm text-white/70">{exercise.card.subtitle}</p>
          <div className="mt-auto flex w-full justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => answer('left')}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-500/40 bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              aria-label={`Choisir ${exercise.leftLabel}`}
            >
              <X className="h-6 w-6 text-red-400" />
            </button>
            <button
              type="button"
              onClick={() => answer('right')}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              aria-label={`Choisir ${exercise.rightLabel}`}
            >
              <Check className="h-6 w-6 text-emerald-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function DraggableItem({
  id,
  text,
  isSelected,
  onTap,
}: {
  id: string
  text: string
  isSelected?: boolean
  onTap?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      onClick={(event) => {
        event.stopPropagation()
        onTap?.()
      }}
      {...listeners}
      {...attributes}
      className={cn(
        'cursor-grab touch-none rounded-xl border bg-white/10 p-4 text-center font-medium text-white shadow-lg backdrop-blur-md transition-all active:scale-105 active:cursor-grabbing active:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
        isSelected ? 'border-amber-300 bg-amber-300/15 shadow-[0_0_20px_rgba(251,191,36,0.2)]' : 'border-white/20',
        isDragging && 'z-50 scale-105 opacity-50',
      )}
    >
      {text}
    </button>
  )
}

function Droppable({ id, children }: { id: string; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-colors',
        isOver ? 'bg-white/5' : '',
      )}
    >
      {children}
    </div>
  )
}

function DroppableSlot({
  id,
  index,
  item,
  isWrong,
  isTargeted,
  onSlotTap,
  onPlacedTap,
}: {
  id: string
  index: number
  item: { id: string; text: string } | null
  isWrong?: boolean
  isTargeted?: boolean
  onSlotTap: () => void
  onPlacedTap: () => void
}) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div className="flex w-full flex-col items-center">
      <motion.div
        role={item ? undefined : 'button'}
        tabIndex={item ? undefined : 0}
        ref={setNodeRef}
        aria-label={item ? undefined : isTargeted ? `Emplacement ${index + 1} - toucher pour placer` : `Emplacement ${index + 1}`}
        onClick={item ? undefined : onSlotTap}
        onKeyDown={(event) => {
          if (!item && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            onSlotTap()
          }
        }}
        animate={isWrong ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className={cn(
          'flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-dashed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
          isOver || isTargeted ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20 bg-white/5',
          item && 'border-solid border-emerald-500/50 bg-emerald-500/20',
          isWrong && 'border-red-500/50 bg-red-500/20',
        )}
      >
        {item ? (
          <DraggableItem id={item.id} text={item.text} onTap={onPlacedTap} />
        ) : (
          <span className="text-sm text-white/35">
            {isTargeted ? `Emplacement ${index + 1} - toucher pour placer` : `Emplacement ${index + 1}`}
          </span>
        )}
      </motion.div>
      {index < 2 && <ArrowRight className="my-1 h-5 w-5 rotate-90 text-white/30" />}
    </div>
  )
}

function DragDropExercise({
  exercise,
  onResult,
  attempt,
  showFeedback,
}: {
  exercise: AcademyDragDropExercise
  onResult: (correct: boolean, feedback: string) => void
  attempt: number
  showFeedback?: boolean
}) {
  const [shuffledItems, setShuffledItems] = useState(() => [...exercise.items].sort(() => Math.random() - 0.5))
  const [slots, setSlots] = useState<Record<string, { id: string; text: string } | null>>({
    slot_0: null,
    slot_1: null,
    slot_2: null,
  })
  const [availableItems, setAvailableItems] = useState(shuffledItems)
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set())
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  )

  useEffect(() => {
    const nextItems = [...exercise.items].sort(() => Math.random() - 0.5)
    setShuffledItems(nextItems)
    setSlots({ slot_0: null, slot_1: null, slot_2: null })
    setAvailableItems(nextItems)
    setWrongSlots(new Set())
    setSelectedItemId(null)
  }, [attempt, exercise.items])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const overId = over.id.toString()
    
    // Check if the dragged item is from the available items or from a slot
    const availableItem = availableItems.find((entry) => entry.id === active.id)
    const sourceSlotId = Object.keys(slots).find(key => slots[key]?.id === active.id)

    // Drop in available items zone (return to initial position)
    if (overId === 'available-zone' && sourceSlotId) {
      setSlots((previous) => ({ ...previous, [sourceSlotId]: null }))
      setAvailableItems((previous) => [...previous, slots[sourceSlotId]!])
      return
    }

    // Drop in a slot
    if (overId.startsWith('slot_')) {
      const slotId = overId
      
      // If the slot is empty, just place the item
      if (!slots[slotId]) {
        if (availableItem) {
          // Item from available items -> place in slot
          setSlots((previous) => ({ ...previous, [slotId]: availableItem }))
          setAvailableItems((previous) => previous.filter((entry) => entry.id !== availableItem.id))
        } else if (sourceSlotId) {
          // Item from another slot -> move to this slot
          setSlots((previous) => ({ ...previous, [slotId]: previous[sourceSlotId] ?? null, [sourceSlotId]: null }))
        }
      } else {
        // Slot is occupied, swap items
        if (availableItem) {
          // Item from available items -> swap with slot item
          setSlots((previous) => ({ ...previous, [slotId]: availableItem }))
          setAvailableItems((items) => {
            const replacedItem = slots[slotId]
            return replacedItem
              ? [...items, replacedItem].filter((entry) => entry.id !== availableItem.id)
              : items.filter((entry) => entry.id !== availableItem.id)
          })
        } else if (sourceSlotId) {
          // Item from another slot -> swap slots
          setSlots((previous) => ({
            ...previous,
            [slotId]: previous[sourceSlotId] ?? null,
            [sourceSlotId]: previous[slotId] ?? null,
          }))
        }
      }
    }
    setSelectedItemId(null)
    setWrongSlots(new Set())
  }

  const removeFromSlot = (slotId: string) => {
    const item = slots[slotId]
    if (!item) {
      return
    }

    setSlots((previous) => ({ ...previous, [slotId]: null }))
    setAvailableItems((previous) => [...previous, item])
    setSelectedItemId(null)
    setWrongSlots(new Set())
  }

  const placeSelectedInSlot = (slotId: string) => {
    if (!selectedItemId) {
      return
    }

    const selectedItem = availableItems.find((entry) => entry.id === selectedItemId)
    if (!selectedItem) {
      return
    }

    setSlots((previous) => {
      const replacedItem = previous[slotId]
      if (replacedItem) {
        setAvailableItems((items) => [
          ...items.filter((entry) => entry.id !== selectedItem.id),
          replacedItem,
        ])
      } else {
        setAvailableItems((items) => items.filter((entry) => entry.id !== selectedItem.id))
      }

      return { ...previous, [slotId]: selectedItem }
    })
    setSelectedItemId(null)
    setWrongSlots(new Set())
  }

  const handleVerify = () => {
    const isCorrect = exercise.items.every((item, index) => slots[`slot_${index}`]?.id === item.id)

    if (!isCorrect) {
      const wrongIndices = exercise.items
        .map((item, index) => (slots[`slot_${index}`]?.id !== item.id ? index : -1))
        .filter((index) => index !== -1)
      setWrongSlots(new Set(wrongIndices))
    }

    onResult(isCorrect, isCorrect ? "Parfait ! L'ordre est exact." : "Mince ! L'ordre n'est pas le bon. Observe les indices et réessaie.")
  }

  const handleReset = () => {
    setSlots({ slot_0: null, slot_1: null, slot_2: null })
    setAvailableItems(shuffledItems)
    setWrongSlots(new Set())
    setSelectedItemId(null)
  }

  const isComplete = Object.values(slots).every(Boolean)

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-[#05050A] p-5 pb-40 pt-24">
      <h2 className="mb-2 shrink-0 text-center text-lg font-bold text-white">{exercise.instruction}</h2>
      <p className="mx-auto mb-4 max-w-sm rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium leading-relaxed text-white/55">
        Place les éléments dans l'ordre. Tu peux glisser une carte ou la toucher puis choisir un emplacement.
      </p>
      <div className="mx-auto mb-4 flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={handleReset}
          aria-label="Réinitialiser le classement"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(0,0,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.4)]"
        >
          <RefreshCcw className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleVerify}
          disabled={!isComplete || showFeedback}
          className={cn(
            'flex-1 rounded-2xl py-3 text-base font-black transition-all duration-100',
            !isComplete || showFeedback
              ? 'cursor-not-allowed bg-white/10 text-white/30'
              : 'bg-emerald-500 text-black shadow-[0_5px_0_#065f46] hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 active:translate-y-[4px] active:shadow-[0_1px_0_#065f46]',
          )}
        >
          VALIDER
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="mx-auto flex w-full max-w-sm flex-col items-center">
          <div className="mb-4 flex w-full flex-col items-center">
            <DroppableSlot
              id="slot_0"
              index={0}
              item={slots.slot_0 ?? null}
              isWrong={wrongSlots.has(0)}
              isTargeted={Boolean(selectedItemId)}
              onSlotTap={() => placeSelectedInSlot('slot_0')}
              onPlacedTap={() => removeFromSlot('slot_0')}
            />
            <DroppableSlot
              id="slot_1"
              index={1}
              item={slots.slot_1 ?? null}
              isWrong={wrongSlots.has(1)}
              isTargeted={Boolean(selectedItemId)}
              onSlotTap={() => placeSelectedInSlot('slot_1')}
              onPlacedTap={() => removeFromSlot('slot_1')}
            />
            <DroppableSlot
              id="slot_2"
              index={2}
              item={slots.slot_2 ?? null}
              isWrong={wrongSlots.has(2)}
              isTargeted={Boolean(selectedItemId)}
              onSlotTap={() => placeSelectedInSlot('slot_2')}
              onPlacedTap={() => removeFromSlot('slot_2')}
            />
          </div>
          <Droppable id="available-zone">
            <div className="flex w-full flex-col gap-3">
              {availableItems.map((item) => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  isSelected={selectedItemId === item.id}
                  onTap={() => {
                    setSelectedItemId((current) => (current === item.id ? null : item.id))
                    setWrongSlots(new Set())
                  }}
                />
              ))}
            </div>
          </Droppable>
        </div>
      </DndContext>
    </div>
  )
}

function QuizExercise({
  exercise,
  onResult,
  attempt,
  mascot,
}: {
  exercise: AcademyQuizExercise
  onResult: (correct: boolean, feedback: string) => void
  attempt: number
  mascot: string
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const showHint = attempt > 0 && Boolean(exercise.hint)

  useEffect(() => {
    setSelected(null)
  }, [attempt])

  const handleSelect = (index: number) => {
    const option = exercise.options[index]
    if (!option) {
      return
    }

    setSelected(index)
  }

  const handleVerify = () => {
    if (selected === null) {
      return
    }

    const option = exercise.options[selected]
    if (!option) {
      return
    }

    // V2 : feedback par option si défini, sinon fallback legacy global.
    const optionFeedback = option.feedback
    const fallback = option.isCorrect ? exercise.successFeedback : exercise.failureFeedback
    onResult(option.isCorrect, optionFeedback ?? fallback)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-[#05050A] p-6 pb-36 pt-32">
      <div className="mb-8 flex flex-col items-center">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-4 h-24 w-24">
          <Image src={`/${mascot}.png`} alt="" fill className="object-contain" />
        </motion.div>
        <h2 className="text-center text-2xl font-black text-white">{exercise.question}</h2>
        {showHint && exercise.hint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-md rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-sm font-bold text-amber-200"
          >
            💡 {exercise.hint}
          </motion.div>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-4">
        {exercise.options.map((option, index) => (
          <button
            type="button"
            key={option.text}
            onClick={() => handleSelect(index)}
            className={cn(
              'w-full rounded-2xl p-5 text-left text-base font-bold transition-all duration-100 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300',
              selected === index && 'translate-y-1 border-2 border-emerald-400 bg-emerald-500/20 text-white shadow-[0_2px_0_#065f46]',
              selected !== index && 'border border-white/10 bg-white/10 text-white shadow-[0_5px_0_rgba(0,0,0,0.5)] hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.5)]',
            )}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-black">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option.text}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="sticky bottom-0 mt-8 bg-gradient-to-t from-[#05050A] via-[#05050A]/95 to-transparent pt-8">
        <button
          type="button"
          onClick={handleVerify}
          disabled={selected === null}
          className={cn(
            'w-full rounded-2xl py-5 text-lg font-black transition-all duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200',
            selected === null
              ? 'cursor-not-allowed bg-white/10 text-white/30'
              : 'bg-emerald-500 text-black shadow-[0_6px_0_#065f46] hover:translate-y-0.5 hover:shadow-[0_4px_0_#065f46] active:translate-y-[5px] active:shadow-[0_1px_0_#065f46]',
          )}
        >
          VALIDER
        </button>
      </div>
    </div>
  )
}

function FeedbackScreen({
  correct,
  feedback,
  mascot,
  onNext,
}: {
  correct: boolean
  feedback: string
  mascot: string
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="absolute inset-x-0 bottom-0 z-[100] rounded-t-3xl border-t border-white/10 p-6 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-2xl"
      style={{
        background: correct
          ? 'linear-gradient(to top, rgba(16,185,129,0.15), rgba(5,5,10,0.98))'
          : 'linear-gradient(to top, rgba(239,68,68,0.1), rgba(5,5,10,0.98))',
      }}
    >
      <div className="mb-4 flex items-center gap-4">
        <motion.div
          animate={correct ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : { rotate: [0, -5, 5, -5, 0], y: [0, -2, 0] }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={cn('relative h-14 w-14 shrink-0', !correct && 'grayscale opacity-70')}
        >
          <Image src={`/${mascot}.png`} alt="" fill className="object-contain" />
        </motion.div>
        <div>
          <p className={cn('text-lg font-black', correct ? 'text-emerald-400' : 'text-red-400')}>
            {correct ? 'Excellent !' : 'Pas tout à fait...'}
          </p>
          <p className="text-sm leading-snug text-white/70">{feedback}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onNext}
        className={cn(
          'mt-2 w-full rounded-2xl py-5 text-lg font-black transition-all duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
          correct
            ? 'bg-emerald-500 text-black shadow-[0_6px_0_#065f46] hover:translate-y-0.5 hover:shadow-[0_4px_0_#065f46] active:translate-y-[5px] active:shadow-[0_1px_0_#065f46]'
            : 'border border-white/20 bg-white/10 text-white shadow-[0_5px_0_rgba(0,0,0,0.5)] hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] active:shadow-[0_1px_0_rgba(0,0,0,0.5)]',
        )}
      >
        CONTINUER
      </button>
    </motion.div>
  )
}

function VictoryScreen({
  unit,
  alreadyCompleted,
  onFinish,
}: {
  unit: AcademyUnit
  alreadyCompleted: boolean
  onFinish: () => void
}) {
  const [countedReward, setCountedReward] = useState(0)
  const finalReward = alreadyCompleted ? 0 : unit.reward.amount

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#10B981', '#34D399', '#059669', '#FBBF24'] })
  }, [])

  useEffect(() => {
    const target = finalReward
    const steps = 20
    const increment = target / steps
    let current = 0
    const timer = window.setInterval(() => {
      current += increment
      if (current >= target) {
        setCountedReward(target)
        window.clearInterval(timer)
      } else {
        setCountedReward(Math.floor(current))
      }
    }, 50)

    return () => window.clearInterval(timer)
  }, [finalReward])

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#05050A] p-8 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-center">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.6, duration: 0.8 }}
        className="mb-10 flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border border-emerald-500/30 bg-gradient-to-b from-emerald-500/20 to-transparent shadow-[0_0_80px_rgba(16,185,129,0.4)]"
      >
        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <Image src={`/${unit.mascot}.png`} alt="" width={140} height={140} className="object-contain drop-shadow-[0_10px_20px_rgba(16,185,129,0.5)]" />
        </motion.div>
      </motion.div>
      <h2 className="mb-3 text-4xl font-black uppercase tracking-tight text-white">
        {alreadyCompleted ? 'Révision terminée' : 'Leçon terminée !'}
      </h2>
      <p className="mb-6 max-w-xs text-sm font-medium leading-relaxed text-white/55">
        {alreadyCompleted
          ? 'Tu as renforcé cette notion. La récompense avait déjà été gagnée.'
          : 'Belle progression. Ta série locale et la prochaine unité sont mises à jour.'}
      </p>
      <div className="relative mb-10 flex items-center gap-3 rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/20 px-6 py-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        {alreadyCompleted ? (
          <span className="text-base font-black text-emerald-300">Récompense déjà gagnée</span>
        ) : (
          <>
            <Sprout className="h-5 w-5 text-emerald-300" />
            <span className="text-2xl font-black text-emerald-400">+{countedReward}</span>
            <span className="text-lg font-bold capitalize text-emerald-400">Graines</span>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onFinish}
        className="mb-8 mt-auto w-full rounded-3xl bg-emerald-500 py-6 text-xl font-black uppercase tracking-wide text-black shadow-[0_7px_0_#065f46] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_5px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 active:translate-y-[6px] active:shadow-[0_1px_0_#065f46]"
      >
        {alreadyCompleted ? "Retour à l'Academy" : 'Continuer le voyage'}
      </button>
    </div>
  )
}

function ComboAnimation({ level, onComplete }: { level: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1200)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
        exit={{ opacity: 0, scale: 1.5, rotate: 15 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-[200] flex items-center justify-center"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2 }} className="text-center">
          <h2 className="text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">
            {level >= 4 ? 'Combo parfait !' : `Série x${level} !`}
          </h2>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function GameOverScreen({ onQuit, onRetry }: { onQuit: () => void; onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#05050A] p-8 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-center">
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5 }} className="mb-8 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
        <HeartCrack className="h-24 w-24" />
      </motion.div>
      <h2 className="mb-3 text-4xl font-black text-white">Plus de vies !</h2>
      <p className="mb-12 max-w-xs text-base leading-relaxed text-white/60">
        Cette tentative est terminée. Tu peux reprendre tout de suite pour consolider la notion.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mb-3 mt-auto w-full rounded-2xl bg-emerald-500 py-5 text-lg font-black text-black shadow-[0_6px_0_#065f46] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_4px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 active:translate-y-[5px] active:shadow-[0_1px_0_#065f46]"
      >
        Réessayer cette unité
      </button>
      <button
        type="button"
        onClick={onQuit}
        className="w-full rounded-2xl bg-white/10 py-5 text-lg font-black text-white shadow-[0_5px_0_rgba(0,0,0,0.5)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-[4px] active:shadow-[0_1px_0_rgba(0,0,0,0.5)]"
      >
        Retour à l'Académie
      </button>
    </div>
  )
}

function renderExercise({
  exercise,
  onStoryComplete,
  onResult,
  attempt,
  showFeedback,
  mascot,
}: {
  exercise: AcademyExercise
  onStoryComplete: () => void
  onResult: (correct: boolean, feedback: string) => void
  attempt: number
  showFeedback?: boolean
  mascot: string
}) {
  if (exercise.type === 'STORY') {
    return <StoryExercise exercise={exercise} onComplete={onStoryComplete} />
  }
  if (exercise.type === 'SWIPE') {
    return <SwipeExercise exercise={exercise} onResult={onResult} attempt={attempt} />
  }
  if (exercise.type === 'DRAG_DROP') {
    return <DragDropExercise exercise={exercise} onResult={onResult} attempt={attempt} showFeedback={showFeedback} />
  }
  return <QuizExercise exercise={exercise} onResult={onResult} attempt={attempt} mascot={mascot} />
}

export default function ExerciseEngine() {
  const router = useRouter()
  const params = useParams<{ chapter?: string | string[]; unit?: string | string[] }>()
  const chapterSlug = getParam(params.chapter)
  const unitSlug = getParam(params.unit)
  const isEvent = chapterSlug === 'events'
  const chapter = isEvent
    ? ({ id: 'events', slug: 'events', title: 'Événements', subtitle: '' } as any)
    : chapterSlug
      ? getChapterBySlug(chapterSlug)
      : null
  const unit =
    isEvent && unitSlug
      ? getEventUnitBySlug(unitSlug)
      : chapterSlug && unitSlug
        ? getUnitBySlug(chapterSlug, unitSlug)
        : null
  const [progress, setProgress] = useState(() => getDefaultAcademyProgress(MOCK_ACADEMY_VIEWER_ID))
  const [isProgressReady, setIsProgressReady] = useState(false)
  const alreadyCompleted = unit
    ? progress.completedUnitIds.includes(unit.id) || progress.completedEventIds.includes(unit.id) || isRewardAlreadyEarned(progress, unit.id)
    : false
  const isLockedUnit = unit && isProgressReady && !isEvent ? !alreadyCompleted && unit.id !== progress.activeUnitId : false
  const prerequisiteUnit = unit && !isEvent ? getUnitPrerequisite(unit.id, progress) ?? getActiveUnit(academyRepository.getCurriculum(), progress) : null
  const prerequisiteChapter = prerequisiteUnit ? getChapterBySlug(prerequisiteUnit.chapterId) : null

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; text: string } | null>(null)
  const [showQuitModal, setShowQuitModal] = useState(false)
  const [lives, setLives] = useState(5)
  const [comboCount, setComboCount] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [showComboAnimation, setShowComboAnimation] = useState<{ show: boolean; level: number } | null>(null)
  const [attempt, setAttempt] = useState(0)
  const activeLesson: AcademyLesson | null = unit ? getNextLessonForUnit(unit, progress) : null
  const [sessionExercises, setSessionExercises] = useState<AcademyExercise[]>(() => activeLesson?.exercises ?? unit?.exercises ?? [])
  const [missedConceptIds, setMissedConceptIds] = useState<string[]>([])

  const currentExercise = sessionExercises[currentStepIndex] ?? null
  const isFinished = Boolean(unit && currentStepIndex >= sessionExercises.length)
  const isGameOver = lives === 0
  const canEarnUnitReward = Boolean(unit && activeLesson && activeLesson.order === unit.lessons.length && !alreadyCompleted)

  useEffect(() => {
    const nextProgress = academyRepository.getProgress(MOCK_ACADEMY_VIEWER_ID)
    setProgress(nextProgress)
    setLives(Math.max(1, nextProgress.lives.remaining || 5))
    setIsProgressReady(true)
  }, [])

  useEffect(() => {
    setSessionExercises(activeLesson?.exercises ?? unit?.exercises ?? [])
    setCurrentStepIndex(0)
    setFeedback(null)
    setMissedConceptIds([])
  }, [activeLesson?.id, unit?.id])

  const handleResult = (correct: boolean, text: string) => {
    if (!correct) {
      setLives((previous) => Math.max(0, previous - 1))
      setMistakes((previous) => previous + 1)
      setComboCount(0)
      if (currentExercise?.conceptId) {
        setMissedConceptIds((previous) =>
          previous.includes(currentExercise.conceptId!)
            ? previous
            : [...previous, currentExercise.conceptId!],
        )
        const retryExercise = {
          ...currentExercise,
          id: `${currentExercise.id}-retry-${attempt + 1}`,
        } as AcademyExercise
        setSessionExercises((previous) =>
          previous.some((exercise) => exercise.id === retryExercise.id)
            ? previous
            : [...previous, retryExercise],
        )
      }
    } else {
      setComboCount((previous) => {
        const nextCount = previous + 1
        if (nextCount === 3 || nextCount === sessionExercises.length) {
          setShowComboAnimation({ show: true, level: nextCount })
        }
        return nextCount
      })
    }
    setFeedback({ show: true, correct, text })
  }

  const handleNextStep = () => {
    const wasCorrect = feedback?.correct
    setFeedback(null)
    if (wasCorrect || currentExercise?.type === 'STORY') {
      setAttempt(0)
      setCurrentStepIndex((previous) => previous + 1)
    } else {
      setAttempt((previous) => previous + 1)
    }
  }

  const handleFinish = () => {
    if (unit && activeLesson) {
      const correctAnswers = Math.max(0, sessionExercises.length - mistakes)
      const score = Math.round((correctAnswers / sessionExercises.length) * 100)
      academyRepository.completeLesson(MOCK_ACADEMY_VIEWER_ID, unit.id, activeLesson.id, {
        score,
        mistakes,
        missedConceptIds,
      })
    }
    router.push('/academy')
  }

  const handleQuit = () => {
    router.push('/academy')
  }

  const handleRetry = () => {
    setCurrentStepIndex(0)
    setFeedback(null)
    setShowQuitModal(false)
    setLives(5)
    setComboCount(0)
    setMistakes(0)
    setShowComboAnimation(null)
    setMissedConceptIds([])
    setSessionExercises(activeLesson?.exercises ?? unit?.exercises ?? [])
    setAttempt((previous) => previous + 1)
  }

  if (!chapter || !unit) {
    return (
      <FullScreenSlideModal headerMode="back" fallbackHref="/academy" className="bg-[#05050A] text-white">
        <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="mb-3 text-3xl font-black">Unité introuvable</h1>
          <p className="text-white/60">Ce cours n'existe pas dans le curriculum mock.</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  if (!isProgressReady) {
    return (
      <FullScreenSlideModal headerMode="none" className="bg-[#05050A] text-white">
        <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 h-12 w-12 rounded-full border-4 border-white/10 border-t-emerald-400" />
          <p className="text-sm font-bold text-white/55">Synchronisation de ta progression...</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  if (isLockedUnit) {
    return (
      <FullScreenSlideModal headerMode="back" fallbackHref="/academy" className="bg-[#05050A] text-white">
        <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Lock className="h-9 w-9 text-white/40" />
          </div>
          <h1 className="mb-3 text-3xl font-black">Unité verrouillée</h1>
          <p className="mb-8 max-w-sm text-white/60">
            {prerequisiteUnit
              ? `Termine "${prerequisiteUnit.title}" pour débloquer ${unit.title}.`
              : `Termine les niveaux précédents pour débloquer ${unit.title}.`}
          </p>
          <div className="flex w-full max-w-sm flex-col gap-3">
            {prerequisiteUnit && prerequisiteChapter && (
              <button
                type="button"
                onClick={() => router.push(`/academy/${prerequisiteChapter.slug}/${prerequisiteUnit.slug}`)}
                className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-black shadow-[0_5px_0_#065f46] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 active:translate-y-[4px] active:shadow-[0_1px_0_#065f46]"
              >
                Reprendre l'unité active
              </button>
            )}
            <button
              type="button"
              onClick={() => router.push('/academy')}
              className="w-full rounded-2xl bg-white/10 py-4 font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.5)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-[4px] active:shadow-[0_1px_0_rgba(0,0,0,0.5)]"
            >
              Retour à l'Academy
            </button>
          </div>
        </div>
      </FullScreenSlideModal>
    )
  }

  return (
    <FullScreenSlideModal headerMode="none" className="bg-[#05050A]" contentClassName="relative flex h-full flex-col overflow-hidden">
      {isFinished ? (
        <VictoryScreen unit={unit} alreadyCompleted={!canEarnUnitReward} onFinish={handleFinish} />
      ) : isGameOver ? (
        <GameOverScreen onQuit={handleQuit} onRetry={handleRetry} />
      ) : (
        <>
          <ExerciseHeader progress={currentStepIndex} total={sessionExercises.length} onQuit={() => setShowQuitModal(true)} lives={lives} />
          <div className="relative h-full w-full flex-1">
            <AnimatePresence mode="wait">
              {currentExercise && (
                <motion.div
                  key={currentExercise.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute inset-0"
                >
                  {renderExercise({
                    exercise: currentExercise,
                    onStoryComplete: handleNextStep,
                    onResult: handleResult,
                    attempt,
                    showFeedback: feedback?.show,
                    mascot: unit.mascot,
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {feedback?.show && (
              <FeedbackScreen correct={feedback.correct} feedback={feedback.text} mascot={unit.mascot} onNext={handleNextStep} />
            )}
            {showComboAnimation?.show && (
              <ComboAnimation level={showComboAnimation.level} onComplete={() => setShowComboAnimation(null)} />
            )}
            {showQuitModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111116] p-8 text-center shadow-2xl"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                    <X className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="mb-4 text-2xl font-black text-white">Quitter l'entraînement ?</h3>
                  <p className="mb-8 font-medium text-white/60">Ta progression dans cette tentative sera perdue.</p>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setShowQuitModal(false)}
                      className="w-full rounded-2xl bg-white/10 py-4 font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(0,0,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.4)]"
                    >
                      Non, je continue
                    </button>
                    <button
                      type="button"
                      onClick={handleQuit}
                      className="w-full rounded-2xl bg-red-500/20 py-4 font-bold text-red-500 shadow-[0_5px_0_rgba(139,0,0,0.4)] transition-all duration-100 hover:translate-y-0.5 hover:shadow-[0_3px_0_rgba(139,0,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 active:translate-y-1 active:shadow-[0_1px_0_rgba(139,0,0,0.4)]"
                    >
                      Oui, quitter
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
