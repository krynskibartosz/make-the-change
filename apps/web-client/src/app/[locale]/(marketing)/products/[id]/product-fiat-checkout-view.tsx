'use client'

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
  const price = selectedFormat.euros
  const shipping = 4.90
  const total = price + shipping
  const pointsEarned = Math.round(total * 10) // Formule de cashback simple pour l'exemple

  // Formatage du prix pour avoir les centimes en plus petit
  const formattedTotal = new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(total)
  
  const [totalEuros, totalCents] = formattedTotal.split(',')

  return (
    <div className="fixed inset-0 z-[200] bg-[#0B0F15] flex flex-col animate-in fade-in slide-in-from-bottom-[5%] duration-300">
      <div className="flex justify-between items-center p-6 pb-2 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="w-6"></div> {/* Spacer */}
        <span className="text-white/50 text-xs font-bold uppercase tracking-widest shadow-sm">Achat solidaire</span>
        <button onClick={onClose} className="active:scale-95 transition-transform">
          <X className="w-6 h-6 text-white/50 hover:text-white transition-colors" />
        </button>
      </div>

      <div className="text-center mt-2 mb-6 px-6">
        <h1 className="text-6xl font-black text-white tracking-tighter flex items-end justify-center leading-none">
          {totalEuros},
          <span className="text-4xl text-white/50 mb-1">{totalCents} €</span>
        </h1>
        <p className="text-white/40 text-sm mt-3 font-medium">TVA incluse</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-64">
        {/* CARTE DE DÉTAILS (Le "Receipt" de confiance) */}
        <div className="mx-6 p-5 bg-[#1A1F26] border border-white/5 rounded-3xl space-y-4 shadow-2xl">
          
          {/* Produit */}
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
            <div className="w-full flex justify-between items-center">
              <div>
                <p className="text-sm text-white/50">Produit</p>
                <p className="text-white font-medium">{product.name_default} <span className="text-white/30 text-xs ml-1">({selectedFormat.id})</span></p>
              </div>
              <span className="text-white font-medium whitespace-nowrap ml-2">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)}
              </span>
            </div>
          </div>

          {/* Livraison */}
          <div className="flex items-start gap-3 pt-4 border-t border-white/5">
            <Truck className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
            <div className="w-full flex justify-between items-center">
              <div>
                <p className="text-sm text-white/50">Livraison Colissimo</p>
                <p className="text-white font-medium text-sm">2 à 3 jours ouvrés</p>
              </div>
              <span className="text-white font-medium whitespace-nowrap ml-2">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(shipping)}
              </span>
            </div>
          </div>

          {/* Le Hack UX : Le Cashback en points */}
          <div className="flex items-start gap-3 pt-4 border-t border-white/5">
            <Gift className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/50">Récompense incluse</p>
              <p className="text-lime-400 font-bold tracking-wide flex items-center gap-1.5 leading-tight mt-0.5">
                + {pointsEarned} Points d'Impact <Sparkles className="w-3.5 h-3.5" />
              </p>
            </div>
          </div>

          {/* Sécurité */}
          <div className="flex items-start gap-3 pt-4 border-t border-white/5">
            <Lock className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
            <p className="text-white/50 text-[13px] leading-relaxed">Paiement crypté & sécurisé par Stripe</p>
          </div>

        </div>

        {/* LA LOGISTIQUE (L'Adresse) */}
        <div className="mx-6 mt-6 p-4 rounded-2xl border border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-white/50" />
            <div className="text-sm">
              <p className="text-white font-medium">Livraison à domicile</p>
              <p className="text-white/50">12 Rue des Abeilles, Paris</p>
            </div>
          </div>
          <button className="text-xs font-bold text-white/50 hover:text-white transition-colors">Modifier</button>
        </div>
      </div>

      {/* LES BOUTONS DE PAIEMENT (Express Checkout) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/95 to-transparent pt-12 z-10 pointer-events-none">
        
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
        
        <div className="flex items-center gap-4 my-1">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Ou</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* Checkout Classique (CB) */}
        <button 
          onClick={onClose}
          className="w-full bg-[#1A1F26] pointer-events-auto border border-white/10 text-white font-bold text-[15px] h-14 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-white/5"
        >
          <CreditCard className="w-4 h-4 text-white/50" />
          Payer par Carte Bancaire
        </button>

      </div>
    </div>
  )
}
