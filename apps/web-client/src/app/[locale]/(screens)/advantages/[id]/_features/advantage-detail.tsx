'use client'

import { ArrowLeft, Calendar, Check, ChevronRight, Info, Loader2, Sparkles } from 'lucide-react'
import { useState, useTransition } from 'react'
import type {
  Advantage,
  ExperienceSlot,
} from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import {
  redeemAdvantageAction,
  reserveExperienceAction,
} from '@/app/[locale]/(screens)/products/_features/mock-commerce-actions'
import { CurrencyAmount } from '@/components/currency'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import { Link, useRouter } from '@/i18n/navigation'
import { ExperienceSlotPicker } from './experience-slot-picker'

type Props = {
  advantage: Advantage
  showFloatingBack?: boolean
  isConnected: boolean
  initialImpactCredits: number
  initialUnlocked: boolean
  initialUsed: boolean
  initialReservationId?: string | null
  initialReservedSlotId?: string | null
}

export function AdvantageDetail({
  advantage,
  showFloatingBack,
  isConnected,
  initialImpactCredits,
  initialUnlocked,
  initialUsed,
  initialReservationId,
  initialReservedSlotId,
}: Props) {
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState(false)
  const [unlocked, setUnlocked] = useState(initialUnlocked)
  const [balance, setBalance] = useState(initialImpactCredits)
  const [isPending, startTransition] = useTransition()

  // Experience-specific state
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false)
  const [reservationId, setReservationId] = useState<string | null>(initialReservationId ?? null)
  const [reservedSlotId, setReservedSlotId] = useState<string | null>(initialReservedSlotId ?? null)

  const isSoon = advantage.status === 'coming_soon'
  const isExperience = advantage.type === 'experience'
  const isReserved = reservationId !== null
  const canRedeem = advantage.type === 'discount' && !isSoon
  const hasEnoughImpactCredits = balance >= advantage.priceCredits
  const missing = Math.max(0, advantage.priceCredits - balance)
  const selectedSlot = advantage.slots?.find((s) => s.id === selectedSlotId) ?? null
  const reservedSlot = advantage.slots?.find((s) => s.id === reservedSlotId) ?? null

  function confirmRedemption() {
    startTransition(async () => {
      const result = await redeemAdvantageAction(advantage.id)
      if (result.ok) {
        setUnlocked(true)
        setBalance(result.balance ?? balance)
        setIsConfirming(false)
        router.refresh()
      }
    })
  }

  function confirmReservation() {
    if (!selectedSlotId) return
    startTransition(async () => {
      const result = await reserveExperienceAction(advantage.id, selectedSlotId)
      if (result.ok) {
        setReservationId(result.reservationId)
        setReservedSlotId(selectedSlotId)
        setBalance(result.balance)
        setIsConfirmSheetOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0B0F15]">
      <div
        data-modal-scroll-root
        className="relative flex-1 overflow-y-auto overscroll-contain pb-28"
      >
        {showFloatingBack && (
          <button
            onClick={() =>
              window.history.length > 1 ? router.back() : router.push('/advantages')
            }
            className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 backdrop-blur-sm"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        )}

        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={advantage.imageUrl}
            alt={advantage.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/20 to-transparent" />
          <span className="absolute bottom-4 left-4 rounded-full bg-lime-300/15 px-3 py-1 text-[10px] font-black uppercase text-lime-300">
            {advantage.imageBadge ? `${advantage.imageBadge} · Réduction partenaire` : 'Expérience'}
          </span>
        </div>

        <div className="px-4 pt-5">
          <h1 className="text-[25px] font-black leading-tight text-white">{advantage.title}</h1>
          {advantage.details && (
            <p className="mt-2 text-[13px] font-medium text-white/50">{advantage.details}</p>
          )}
          <div className="mt-3">
            <CurrencyAmount
              kind="impactCredits"
              value={advantage.priceCredits}
              className="text-[18px] font-black"
            />
          </div>
          {isConnected && (
            <p className="mt-2 text-[12px] font-medium text-white/45">
              {isReserved ? (
                <span className="inline-flex items-center gap-1.5 text-lime-300/70">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Réservé · solde restant : {balance.toLocaleString('fr-FR')} CI
                </span>
              ) : (
                <>Solde disponible : {balance.toLocaleString('fr-FR')} Crédits Impact</>
              )}
            </p>
          )}
        </div>

        {isSoon && (
          <div className="mx-4 mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" aria-hidden="true" />
            <p className="text-sm font-semibold text-white/60">
              Bientôt disponible. Aucun Crédit Impact ne sera débité avant confirmation d'un
              créneau.
            </p>
          </div>
        )}

        {unlocked && advantage.type === 'discount' && (
          <div className="mx-4 mt-5 rounded-2xl border border-lime-300/20 bg-lime-300/[0.07] px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-300/70">
              {initialUsed ? 'Avantage utilisé' : 'Avantage débloqué'}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {initialUsed
                ? 'Cette réduction a déjà été appliquée à ta commande.'
                : 'Ta réduction sera appliquée automatiquement au panier éligible.'}
            </p>
          </div>
        )}

        <Link
          href={`/producers/${advantage.producerSlug}`}
          className="group mt-6 flex items-center gap-3 border-y border-white/5 px-4 py-3"
        >
          <img
            src={advantage.partnerImageUrl}
            alt=""
            className="h-8 w-8 rounded-full border border-white/10 bg-white object-contain p-1"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase text-white/40">Partenaire</p>
            <p className="text-sm font-semibold text-white/80">{advantage.partner}</p>
            <p className="text-[12px] font-medium text-white/45">{advantage.location}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
        </Link>

        <div className="flex flex-col gap-7 px-4 pt-7">
          {isExperience && !isReserved && advantage.slots && advantage.slots.length > 0 && (
            <ExperienceSlotPicker
              slots={advantage.slots}
              selectedSlotId={selectedSlotId}
              onSelect={setSelectedSlotId}
            />
          )}

          {isExperience && isReserved && (
            <ReservationSuccess
              reservationId={reservationId}
              slot={reservedSlot}
              advantage={advantage}
            />
          )}

          <section>
            <h2 className="text-base font-black text-white">Ce que tu obtiens</h2>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-white/60">
              {advantage.whatYouGet}
            </p>
          </section>
          <section>
            <h2 className="text-base font-black text-white">Comment ça marche</h2>
            <ol className="mt-3 flex flex-col gap-3 pl-0">
              {advantage.howItWorks.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-300/15 text-[11px] font-black text-lime-300">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-[14px] font-medium text-white/60">{step}</span>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-base font-black text-white">Conditions</h2>
            <ul className="mt-2 flex flex-col gap-1 pl-0">
              {advantage.conditions.map((condition) => (
                <li key={condition} className="text-[13px] font-medium text-white/45">
                  · {condition}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#0B0F15]/80 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg">
        {isSoon ? (
          <div className="flex w-full justify-center rounded-2xl bg-white/5 py-4 text-[15px] font-black text-white/30">
            Bientôt disponible
          </div>
        ) : isExperience && isReserved ? (
          <a
            href={buildCalendarUrl(reservedSlot, advantage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-[15px] font-black text-white"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Ajouter au calendrier
          </a>
        ) : isExperience && !isConnected ? (
          <Link
            href={`/login?returnTo=${encodeURIComponent(`/advantages/${advantage.id}`)}`}
            className="flex w-full justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
          >
            Se connecter pour réserver
          </Link>
        ) : isExperience && !selectedSlotId ? (
          <div className="flex w-full flex-col items-center gap-0.5 rounded-2xl bg-white/5 py-4">
            <span className="text-[15px] font-black text-white/30">Sélectionner un créneau</span>
            <span className="text-[11px] font-medium text-white/20">pour continuer</span>
          </div>
        ) : isExperience && !hasEnoughImpactCredits ? (
          <div className="text-center text-[14px] font-bold text-white/50">
            Solde insuffisant · {missing.toLocaleString('fr-FR')} CI manquants
          </div>
        ) : isExperience ? (
          <button
            type="button"
            onClick={() => setIsConfirmSheetOpen(true)}
            className="flex w-full justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
          >
            Réserver · {advantage.priceCredits.toLocaleString('fr-FR')} CI
          </button>
        ) : unlocked && advantage.productSlug && !initialUsed ? (
          <Link
            href={`/products/${advantage.productSlug}`}
            className="flex w-full justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
          >
            Utiliser dans la boutique
          </Link>
        ) : initialUsed ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 py-4 text-[15px] font-black text-lime-300">
            <Check className="h-4 w-4" aria-hidden="true" />
            Avantage utilisé
          </div>
        ) : !isConnected ? (
          <Link
            href={`/login?returnTo=${encodeURIComponent(`/advantages/${advantage.id}`)}`}
            className="flex w-full justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
          >
            Se connecter pour débloquer
          </Link>
        ) : !hasEnoughImpactCredits ? (
          <div className="text-center text-[14px] font-bold text-white/50">
            Solde insuffisant · {missing.toLocaleString('fr-FR')} CI manquants
          </div>
        ) : isConfirming ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-center text-[13px] font-black text-white">Confirmer l'utilisation</p>
            <p className="mt-1 text-center text-[12px] text-white/50">
              -{advantage.priceCredits.toLocaleString('fr-FR')} CI · solde restant :{' '}
              {(balance - advantage.priceCredits).toLocaleString('fr-FR')} CI
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-bold text-white/65"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirmRedemption}
                className="flex-1 rounded-xl bg-lime-300 py-3 text-sm font-black text-[#0B0F15] disabled:opacity-60"
              >
                Confirmer
              </button>
            </div>
          </div>
        ) : canRedeem ? (
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className="flex w-full justify-center rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
          >
            Débloquer · {advantage.priceCredits.toLocaleString('fr-FR')} Crédits Impact
          </button>
        ) : null}
      </footer>

      <MobileSheet
        isOpen={isConfirmSheetOpen}
        onClose={() => setIsConfirmSheetOpen(false)}
        title="Confirmer la réservation"
      >
        {selectedSlot && (
          <ReservationConfirmContent
            slot={selectedSlot}
            advantage={advantage}
            balance={balance}
            isPending={isPending}
            onConfirm={confirmReservation}
            onCancel={() => setIsConfirmSheetOpen(false)}
          />
        )}
      </MobileSheet>
    </div>
  )
}

function ReservationSuccess({
  reservationId,
  slot,
  advantage,
}: {
  reservationId: string | null
  slot: ExperienceSlot | null
  advantage: Advantage
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.07] px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-300/20">
            <Check className="h-4 w-4 text-lime-300" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-lime-300">Réservation confirmée !</p>
            {slot && (
              <p className="mt-1 text-[13px] font-medium text-white/70">
                {slot.dateLabel} · {slot.timeLabel}
              </p>
            )}
            <p className="mt-0.5 text-[12px] font-medium text-white/45">
              {advantage.address ?? advantage.location}
            </p>
            {reservationId && (
              <p className="mt-2 text-[11px] font-medium text-white/30">Réf. {reservationId}</p>
            )}
            <p className="mt-2 text-[11px] font-medium text-white/35">
              Un email de confirmation t'a été envoyé.
            </p>
          </div>
        </div>
      </div>

      {slot && (
        <a
          href={buildCalendarUrl(slot, advantage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition-opacity active:opacity-70"
        >
          <Calendar className="h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
          <span className="flex-1 text-[14px] font-semibold text-white/70">
            Ajouter au calendrier
          </span>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
        </a>
      )}
    </div>
  )
}

function ReservationConfirmContent({
  slot,
  advantage,
  balance,
  isPending,
  onConfirm,
  onCancel,
}: {
  slot: ExperienceSlot
  advantage: Advantage
  balance: number
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const balanceAfter = balance - advantage.priceCredits

  return (
    <div className="flex flex-col gap-5 pb-2 pt-1">
      <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-4 py-3">
        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
        <div>
          <p className="text-[14px] font-black text-white">{slot.dateLabel}</p>
          <p className="text-[12px] font-medium text-white/55">{slot.timeLabel}</p>
          <p className="mt-0.5 text-[12px] font-medium text-white/40">
            {advantage.address ?? advantage.location}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-white/[0.04] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-white/55">Solde actuel</span>
          <span className="text-[13px] font-black text-white/70">
            {balance.toLocaleString('fr-FR')} CI
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-white/55">Coût</span>
          <span className="text-[13px] font-black text-amber-300">
            − {advantage.priceCredits.toLocaleString('fr-FR')} CI
          </span>
        </div>
        <div className="my-1 border-t border-white/[0.06]" />
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-white/55">Solde après</span>
          <span className="text-[13px] font-black text-lime-300">
            {balanceAfter.toLocaleString('fr-FR')} CI
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25" aria-hidden="true" />
        <p className="text-[11px] font-medium leading-relaxed text-white/35">
          Les Crédits Impact ne seront débités qu'à la confirmation.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 rounded-xl border border-white/10 py-3.5 text-[14px] font-bold text-white/65 disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 rounded-xl bg-lime-300 py-3.5 text-[14px] font-black text-[#0B0F15] disabled:opacity-60"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Réservation...
            </span>
          ) : (
            `Confirmer · ${advantage.priceCredits.toLocaleString('fr-FR')} CI`
          )}
        </button>
      </div>
    </div>
  )
}

function buildCalendarUrl(slot: ExperienceSlot | null, advantage: Advantage): string {
  const title = encodeURIComponent(advantage.title)
  const loc = encodeURIComponent(advantage.address ?? advantage.location)
  const details = encodeURIComponent(`Réservation Make the Change · ${advantage.partner}`)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${loc}&details=${details}`
}
