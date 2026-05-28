'use client'

import type { ExperienceSlot } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { cn } from '@/lib/utils'

type ExperienceSlotPickerProps = {
  slots: ExperienceSlot[]
  selectedSlotId: string | null
  onSelect: (slotId: string) => void
}

export function ExperienceSlotPicker({ slots, selectedSlotId, onSelect }: ExperienceSlotPickerProps) {
  return (
    <section>
      <h2 className="text-base font-black text-white">
        Choisir un créneau
        <span className="ml-2 text-[13px] font-medium text-white/35">
          {slots.filter((s) => s.status !== 'full').length} disponible
          {slots.filter((s) => s.status !== 'full').length > 1 ? 's' : ''}
        </span>
      </h2>
      <div className="mt-3 flex flex-col gap-2" role="radiogroup" aria-label="Créneaux disponibles">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            isSelected={selectedSlotId === slot.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

function SlotCard({
  slot,
  isSelected,
  onSelect,
}: {
  slot: ExperienceSlot
  isSelected: boolean
  onSelect: (slotId: string) => void
}) {
  const isFull = slot.status === 'full'

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition-colors',
        isFull && 'pointer-events-none opacity-40',
        isSelected
          ? 'border-lime-300/40 bg-lime-300/[0.06]'
          : 'border-white/[0.08] bg-white/[0.03]',
      )}
    >
      <input
        type="radio"
        name="experience-slot"
        value={slot.id}
        checked={isSelected}
        disabled={isFull}
        onChange={() => onSelect(slot.id)}
        className="sr-only"
        aria-label={`${slot.dateLabel} ${slot.timeLabel}`}
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-black text-white">{slot.dateLabel}</span>
        <span className="text-[12px] font-medium text-white/55">{slot.timeLabel}</span>
      </div>
      <CapacityBadge slot={slot} />
    </label>
  )
}

function CapacityBadge({ slot }: { slot: ExperienceSlot }) {
  if (slot.status === 'full') {
    return <span className="text-[12px] font-medium text-white/30">Complet</span>
  }
  if (slot.status === 'almost_full') {
    return (
      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[11px] font-black text-amber-300">
        Dernière place !
      </span>
    )
  }
  if (slot.remainingSpots <= slot.totalSpots * 0.5) {
    return (
      <span className="text-[12px] font-medium text-white/45">
        {slot.remainingSpots} places
      </span>
    )
  }
  return null
}
