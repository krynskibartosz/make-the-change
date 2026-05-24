'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Constantes de frais (prototype — seront configurables côté serveur) ──────
// MTC est seller-of-record. La commission inclut gestion, suivi et infrastructure.
const PLATFORM_FEE_RATE = 0.15     // 15 % frais plateforme (MTC)
const PAYMENT_FEE_RATE  = 0.015   // ~1,5 % frais bancaires Stripe (approximatif)
const PAYMENT_FEE_FIXED = 0.25    // + 0,25 € fixe Stripe (approximatif)

export type BreakdownMode = 'support' | 'donation'

interface PaymentBreakdownProps {
  amount: number
  mode: BreakdownMode
  className?: string
}

function formatEur(value: number): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Calcule la répartition du montant selon le mode :
 * - support : commission plateforme + frais bancaires → reste pour le partenaire
 * - donation : frais bancaires uniquement → reste pour le projet (pas de commission MTC sur les dons)
 */
function computeBreakdown(amount: number, mode: BreakdownMode) {
  const bankFee = Math.round((amount * PAYMENT_FEE_RATE + PAYMENT_FEE_FIXED) * 100) / 100
  if (mode === 'donation') {
    const toProject = Math.round((amount - bankFee) * 100) / 100
    return {
      toPartner: toProject,
      platformFee: 0,
      bankFee,
      partnerLabel: 'Transmis au projet',
    }
  }
  const platformFee = Math.round(amount * PLATFORM_FEE_RATE * 100) / 100
  const toPartner = Math.round((amount - platformFee - bankFee) * 100) / 100
  return {
    toPartner,
    platformFee,
    bankFee,
    partnerLabel: 'Transmis au partenaire',
  }
}

export function PaymentBreakdown({ amount, mode, className }: PaymentBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toPartner, platformFee, bankFee, partnerLabel } = computeBreakdown(amount, mode)

  return (
    <div className={cn('rounded-2xl border border-white/[0.08] bg-white/[0.025]', className)}>
      {/* Header cliquable */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-black text-white">
            {formatEur(toPartner)} €
          </span>
          <span className="text-[11px] text-white/40">{partnerLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-white/30">Voir le détail</span>
          {isOpen
            ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-white/25" />
            : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/25" />
          }
        </div>
      </button>

      {/* Détail déplié */}
      {isOpen && (
        <div className="border-t border-white/[0.06] px-4 pb-4 pt-3">
          <div className="space-y-2">
            {/* Ligne partenaire */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/55">{partnerLabel}</span>
              <span className="text-[13px] font-bold tabular-nums text-white">
                {formatEur(toPartner)} €
              </span>
            </div>

            {/* Frais plateforme — uniquement pour le soutien producteur */}
            {mode === 'support' && (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[12px] text-white/55">Commission plateforme</span>
                  <p className="mt-0.5 text-[10px] leading-snug text-white/30">
                    Gestion, suivi terrain et infrastructure MTC.
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-bold tabular-nums text-white/55">
                  {formatEur(platformFee)} €
                </span>
              </div>
            )}

            {/* Frais bancaires */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[12px] text-white/55">Frais bancaires</span>
                <p className="mt-0.5 text-[10px] leading-snug text-white/30">
                  Traitement sécurisé du paiement (Stripe).
                </p>
              </div>
              <span className="shrink-0 text-[13px] font-bold tabular-nums text-white/55">
                ~{formatEur(bankFee)} €
              </span>
            </div>

            {/* Séparateur + Total */}
            <div className="border-t border-white/[0.08] pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-black text-white/70">Total débité</span>
                <span className="text-[13px] font-black tabular-nums text-white">
                  {formatEur(amount)} €
                </span>
              </div>
            </div>
          </div>

          {/* Note seller-of-record */}
          <p className="mt-3 text-[10px] leading-relaxed text-white/28">
            Make the Change est le marchand de référence (seller-of-record) pour ce paiement.
            {mode === 'support'
              ? ' Les fonds sont reversés au partenaire déduction faite de la commission.'
              : ' Les fonds sont intégralement reversés au projet déduction faite des frais bancaires.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
