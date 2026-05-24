'use client'

import { useState } from 'react'
import type { ProductWithRelations } from '../product-detail-data'
import type { ProductFormat } from '../product-quick-view'
import { useRouter } from '@/i18n/navigation'
import { Check, CreditCard, Loader2, MapPin, Package, X } from 'lucide-react'

type ProductFiatCheckoutViewProps = {
  product: ProductWithRelations
  selectedFormat: ProductFormat
  onClose: () => void
}

type PaymentState = 'idle' | 'processing' | 'success'
type PaymentMethod = 'apple_pay' | 'card' | null

const SHIPPING_COST = 4.90

export function ProductFiatCheckoutView({ product, selectedFormat, onClose }: ProductFiatCheckoutViewProps) {
  const router = useRouter()
  const unitPrice = selectedFormat.euros
  const shippingCost = SHIPPING_COST

  const [quantity, setQuantity] = useState(1)

  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(null)

  const subtotal = unitPrice * quantity
  const total = subtotal + shippingCost

  const formattedTotal = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total)
  const totalParts = formattedTotal.split(',')
  const totalEuros = totalParts[0] ?? '0'
  const totalCents = totalParts[1] ?? '00'

  const handlePayment = (method: 'apple_pay' | 'card') => {
    setActiveMethod(method)
    setPaymentState('processing')
    // Simule le temps de réponse Stripe / Apple Pay
    setTimeout(() => {
      setPaymentState('success')
    }, 1500)
  }

  // ─── ÉCRAN DE SUCCÈS ─────────────────────────────────────────────────────────
  if (paymentState === 'success') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0B0F15] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">

        {/* Icône de succès avec pulse */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-lime-400/20 rounded-full animate-ping" />
          <div className="relative w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(132,204,22,0.4)]">
            <Check className="w-10 h-10 text-[#0B0F15] stroke-[3]" />
          </div>
        </div>

        {/* Titre + confirmation logistique */}
        <h2 className="text-3xl font-black text-white mb-2 text-center">Commande prototype validée</h2>
        <p className="text-white/50 text-center text-sm leading-relaxed mb-8">
          Commande n° <span className="font-mono text-white/70">#FR-84920</span><br />
          Aucun paiement réel n'a été débité dans ce parcours de démonstration.
        </p>

        {/* LE CŒUR DE LA GAMIFICATION : La carte de Cashback */}
        <div className="w-full bg-[#1A1F26] border border-amber-300/30 rounded-3xl p-6 text-center relative overflow-hidden mb-8 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300/0 via-amber-300 to-amber-300/0" />
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Achat partenaire</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-black text-amber-300 tabular-nums leading-none">{formattedTotal} €</span>
          </div>
          <p className="text-white/40 text-sm mt-3">Cet achat direct ne génère pas de Crédits Impact.</p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {/* Bouton Primaire — réassurance */}
          <button
            onClick={() => router.push('/profile/contributions')}
            className="w-full font-black text-[17px] h-14 rounded-2xl active:scale-95 transition-transform shadow-[0_0_30px_rgba(52,211,153,0.18)] bg-emerald-400 text-[#0B0F15] hover:bg-emerald-300"
          >
            Suivre la livraison
          </button>
          {/* Bouton Secondaire — conversion suivante */}
          <button
            onClick={() => router.push('/projects')}
            className="w-full h-12 text-sm font-bold text-white/50 hover:text-white transition-colors"
          >
            Découvrir les projets à soutenir
          </button>
        </div>

      </div>
    )
  }

  // ─── ÉCRAN DE CHECKOUT ────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] bg-[#0B0F15] flex flex-col overflow-y-auto animate-in fade-in slide-in-from-bottom-[5%] duration-300">

      {/* HEADER STICKY */}
      <div className="flex justify-between items-center p-6 pb-2 sticky top-0 bg-[#0B0F15]/90 backdrop-blur-xl z-20 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="w-6" />
        <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Achat partenaire</span>
        <button onClick={onClose} disabled={paymentState === 'processing'} className="active:scale-95 transition-transform disabled:opacity-30">
          <X className="w-6 h-6 text-white/50 hover:text-white transition-colors" />
        </button>
      </div>

      {/* TOTAL DYNAMIQUE */}
      <div className="text-center mt-2 mb-6 px-6">
        <h1 className="text-6xl font-black text-white tracking-tighter flex items-end justify-center leading-none">
          {totalEuros},
          <span className="text-4xl text-white/50 mb-1">{totalCents} €</span>
        </h1>
        <p className="text-white/40 text-sm mt-3 font-medium">TVA incluse</p>
      </div>

      <div className="flex-1 pb-52">

        {/* PANIER + STEPPER QUANTITÉ */}
        <div className="mx-6 mb-4 p-4 bg-[#1A1F26] border border-white/5 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden shrink-0">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name_default} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-full h-full p-3 text-white/30" />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">
                {product.name_default} <span className="text-white/30 text-xs ml-1 font-normal">({selectedFormat.label})</span>
              </h3>
              <p className="text-white/50 text-xs mt-0.5">{unitPrice.toFixed(2).replace('.', ',')} € / unité</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#0B0F15] rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={paymentState === 'processing'}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/70 active:scale-95 transition-all disabled:opacity-30"
            >-</button>
            <span className="text-sm font-bold text-white tabular-nums w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={paymentState === 'processing'}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/70 active:scale-95 transition-all disabled:opacity-30"
            >+</button>
          </div>
        </div>

        {/* TICKET DE CAISSE */}
        <div className="mx-6 p-5 bg-[#1A1F26] border border-white/5 rounded-3xl space-y-3 shadow-2xl">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Sous-total ({quantity}x)</span>
            <span className="text-white font-medium">{subtotal.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Livraison Colissimo</span>
            <span className="text-white font-medium">{shippingCost.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="h-px w-full bg-white/10 my-3" />
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-white/50 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-300" /> Achat produit
            </span>
            <span className="rounded-lg bg-amber-300/10 px-2.5 py-1 text-sm font-bold text-amber-300">
              Ne génère pas de Crédits Impact
            </span>
          </div>
        </div>

        {/* ADRESSE DE LIVRAISON */}
        <div className="mx-6 mt-4 p-4 rounded-2xl border border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-white/50" />
            <div className="text-sm">
              <p className="text-white font-medium">Livraison à domicile</p>
              <p className="text-white/50 truncate max-w-[180px]">12 Rue des Abeilles, Paris</p>
            </div>
          </div>
          <button className="text-xs font-bold text-white/50 hover:text-white transition-colors">Modifier</button>
        </div>

      </div>

      {/* BOUTONS DE PAIEMENT STICKY */}
      <div className="sticky bottom-0 left-0 right-0 p-6 pt-12 flex flex-col gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent z-20 pointer-events-none mt-auto">

        {/* Rassurance Stripe */}
        <div className="flex justify-center items-center gap-1.5 mb-1 pointer-events-auto">
          <Package className="w-3 h-3 text-white/30" />
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Prototype de paiement — aucun débit réel</span>
        </div>

        {/* Apple Pay */}
        <button
          onClick={() => handlePayment('apple_pay')}
          disabled={paymentState === 'processing'}
          className="w-full bg-white pointer-events-auto text-black font-bold text-[17px] h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(255,255,255,0.15)] disabled:opacity-80 disabled:scale-100"
        >
          {paymentState === 'processing' && activeMethod === 'apple_pay' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-black/50" />
              <span>Validation prototype en cours...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.8 90.5-90.8 102.2-127.3-46.7-20-61.4-56.1-61.4-83.3zM218.4 87.3C233 69.8 242 45.4 239.3 22c-20.4 1.4-46.6 14.6-61.6 32-13.4 15.5-23.7 40.5-20.6 63.4 22.8 1.6 46.7-11.8 61.3-29.6z" />
              </svg>
              Simuler avec Apple Pay
            </>
          )}
        </button>

        {/* Carte Bancaire */}
        <button
          onClick={() => handlePayment('card')}
          disabled={paymentState === 'processing'}
          className="w-full bg-[#1A1F26] pointer-events-auto border border-white/10 text-white font-bold text-[15px] h-14 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-white/5 disabled:opacity-80 disabled:scale-100"
        >
          {paymentState === 'processing' && activeMethod === 'card' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white/50" />
              <span className="text-white/70">Validation prototype en cours...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 text-white/50" />
              Simuler par Carte Bancaire
            </>
          )}
        </button>

      </div>
    </div>
  )
}
