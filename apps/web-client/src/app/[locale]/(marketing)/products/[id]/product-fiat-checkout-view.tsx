'use client'

import { useState } from 'react'
import { CreditCard, Gift, Lock, MapPin, Package, Sparkles, Truck, X } from 'lucide-react'

interface ProductFiatCheckoutViewProps {
  product: any
  selectedFormat: {
    id: string
    points: number
    euros: number
  }
  onClose: () => void
}

export function ProductFiatCheckoutView({ product, selectedFormat, onClose }: ProductFiatCheckoutViewProps) {
  const unitPrice = selectedFormat.euros
  const shippingCost = 4.90
  const pointsPerUnit = Math.round((unitPrice + shippingCost) * 10) // Ajusté pour l'exemple
  
  const [quantity, setQuantity] = useState(1)

  const subtotal = unitPrice * quantity
  const total = subtotal + shippingCost
  const totalPointsEarned = pointsPerUnit * quantity

  // Formatage du prix pour avoir les centimes en plus petit
  const formattedTotal = new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(total)
  
  const [totalEuros, totalCents] = formattedTotal.split(',')

  return (
    <div className="fixed inset-0 z-[200] bg-[#0B0F15] flex flex-col overflow-y-auto animate-in fade-in slide-in-from-bottom-[5%] duration-300">
      <div className="flex justify-between items-center p-6 pb-2 sticky top-0 bg-[#0B0F15]/90 backdrop-blur-xl z-20 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="w-6"></div> {/* Spacer */}
        <span className="text-white/50 text-xs font-bold uppercase tracking-widest shadow-sm">Achat solidaire</span>
        <button onClick={onClose} className="active:scale-95 transition-transform"><X className="w-6 h-6 text-white/50 hover:text-white transition-colors" /></button>
      </div>

      <div className="text-center mt-2 mb-6 px-6">
        {/* Total mis à jour dynamiquement */}
        <h1 className="text-6xl font-black text-white tracking-tighter flex items-end justify-center leading-none">
          {totalEuros},
          <span className="text-4xl text-white/50 mb-1">{totalCents} €</span>
        </h1>
        <p className="text-white/40 text-sm mt-3 font-medium">TVA incluse</p>
      </div>

      <div className="flex-1 pb-44">
        {/* LE PANIER & SÉLECTEUR DE QUANTITÉ */}
        <div className="mx-6 mb-4 p-4 bg-[#1A1F26] border border-white/5 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden shrink-0">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name_default} className="w-full h-full object-cover"/>
              ) : (
                <Package className="w-full h-full p-3 text-white/30" />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">{product.name_default} <span className="text-white/30 text-xs ml-1 font-normal">({selectedFormat.id})</span></h3>
              <p className="text-white/50 text-xs mt-0.5">{unitPrice.toFixed(2).replace('.', ',')} € / unité</p>
            </div>
          </div>
          
          {/* Stepper Quantité */}
          <div className="flex items-center gap-3 bg-[#0B0F15] rounded-xl p-1 border border-white/5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/70 active:scale-95 transition-all">-</button>
            <span className="text-sm font-bold text-white tabular-nums w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/70 active:scale-95 transition-all">+</button>
          </div>
        </div>

        {/* LE TICKET DE CAISSE & CASHBACK */}
        <div className="mx-6 p-5 bg-[#1A1F26] border border-white/5 rounded-3xl space-y-3 shadow-2xl">
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Sous-total ({quantity}x)</span>
            <span className="text-white font-medium">{subtotal.toFixed(2).replace('.', ',')} €</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Livraison Colissimo</span>
            <span className="text-white font-medium">{shippingCost.toFixed(2).replace('.', ',')} €</span>
          </div>

          <div className="h-px w-full bg-white/10 my-3"></div>

          {/* Le Hack UX : Le Cashback en points (S'anime au changement de quantité) */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-white/50 flex items-center gap-2"><Gift className="w-4 h-4 text-lime-400" /> Récompense incluse</span>
            <span key={totalPointsEarned} className="flex items-center gap-1.5 text-lime-400 font-bold bg-lime-400/10 px-2.5 py-1 rounded-lg text-sm animate-in fade-in zoom-in duration-300">
              + {totalPointsEarned} <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* L'ADRESSE DE LIVRAISON (Crucial) */}
        <div className="mx-6 mt-6 p-4 rounded-2xl border border-white/10 flex items-center justify-between bg-white/[0.02]">
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

      {/* LES BOUTONS DE PAIEMENT (Sticky Bottom) */}
      <div className="sticky bottom-0 left-0 right-0 p-6 pt-12 flex flex-col gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent z-20 pointer-events-none mt-auto">
        
        {/* Rassurance Stripe */}
        <div className="flex justify-center items-center gap-1.5 mb-1 pointer-events-auto">
          <Lock className="w-3 h-3 text-white/30" />
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Paiement sécurisé par Stripe</span>
        </div>

        {/* Express Checkout (Apple Pay / Google Pay) */}
        <button 
          onClick={onClose} 
          className="w-full bg-white pointer-events-auto text-black font-bold text-[17px] h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_10px_40px_rgba(255,255,255,0.15)] group"
        >
          <svg className="w-5 h-5 group-active:scale-95 transition-transform" viewBox="0 0 384 512" fill="currentColor">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.8 90.5-90.8 102.2-127.3-46.7-20-61.4-56.1-61.4-83.3zM218.4 87.3C233 69.8 242 45.4 239.3 22c-20.4 1.4-46.6 14.6-61.6 32-13.4 15.5-23.7 40.5-20.6 63.4 22.8 1.6 46.7-11.8 61.3-29.6z"/>
          </svg>
          Payer avec Apple Pay
        </button>

        {/* Checkout Classique (CB) */}
        <button 
          onClick={onClose}
          className="w-full bg-[#1A1F26] pointer-events-auto border border-white/10 text-white font-bold text-[15px] h-14 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-white/5"
        >
          <CreditCard className="w-5 h-5 text-white/50" />
          Payer par Carte Bancaire
        </button>

      </div>
    </div>
  )
}
