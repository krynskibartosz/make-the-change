'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, MapPin, Plus, Sparkles, X, Loader2 } from 'lucide-react'
import { sanitizeImageUrl } from '@/lib/image-url'

interface ProductCheckoutViewProps {
  product: any
  selectedFormat: {
    id: string
    points: number
    euros: number
  }
  onClose: () => void
}

export function ProductCheckoutView({ product, selectedFormat, onClose }: ProductCheckoutViewProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [hasAddress, setHasAddress] = useState(false) // Faux état pour la démo
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [userBalance, setUserBalance] = useState(2450)

  const imageUrl =
    sanitizeImageUrl(product.image_url) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? sanitizeImageUrl(product.images[0])
      : undefined)

  const totalCost = selectedFormat.points * quantity
  const newBalance = userBalance - totalCost

  // -------------------------------------------------------------
  // VUE 1 : L'OFFRE (The Deal)
  // -------------------------------------------------------------
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0F15] animate-in fade-in slide-in-from-bottom-[5%] duration-300">
        <div className="flex items-center justify-between p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-2">
          <h2 className="text-xl font-bold text-white">Votre récompense</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-white/10 active:scale-95"
          >
            <X className="h-6 w-6 text-white/50" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-40">
          <div className="mx-6 mt-4 p-4 bg-[#1A1F26] border border-white/5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden shrink-0">
                {imageUrl && (
                  <img src={imageUrl} alt={product.name_default} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg leading-tight">{product.name_default}</h3>
                <p className="text-white/50 text-sm mt-0.5">Format : {selectedFormat.id}</p>
              </div>
            </div>
            
            {/* SÉLECTEUR DE QUANTITÉ */}
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-sm font-medium text-white/70">Quantité</span>
              <div className="flex items-center gap-4 bg-[#0B0F15] rounded-xl p-1 border border-white/5">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/50 active:scale-95 transition-all"
                >
                  -
                </button>
                <span className="text-sm font-bold text-white tabular-nums w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={newBalance - selectedFormat.points < 0}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
                    newBalance - selectedFormat.points < 0 ? 'opacity-30 cursor-not-allowed text-white/30' : 'hover:bg-white/5 text-white/50'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* LE TICKET DE CAISSE (Rassurance) */}
          <div className="mx-6 mt-6 p-5 bg-[#1A1F26] border border-white/5 rounded-3xl space-y-3">
            
            {/* Lignes de détail */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Sous-total ({quantity}x)</span>
              <span className="flex items-center gap-1 text-white font-medium tabular-nums">
                {totalCost.toLocaleString('fr-FR')} <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Livraison (France)</span>
              <span className="text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded-md">Offerte</span>
            </div>
            
            <div className="h-px w-full bg-white/10 my-2"></div>
            
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Total à échanger</span>
              <span className="flex items-center gap-1.5 text-xl font-black text-white tabular-nums">
                - {totalCost.toLocaleString('fr-FR')} <Sparkles className="w-5 h-5 text-lime-400" />
              </span>
            </div>
            
            {/* Rassurance Solde */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
              <span className="text-white/40 text-xs">Nouveau solde estimé</span>
              <span className="flex items-center gap-1 text-lime-400 font-bold text-sm tabular-nums">
                {newBalance.toLocaleString('fr-FR')} <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {hasAddress ? (
            <div className="mx-6 mt-6 flex items-center justify-between rounded-2xl border border-white/10 p-4 transition-colors hover:bg-white/5">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-lime-400" />
                <div className="text-sm">
                  <p className="font-medium text-white">Livraison à domicile</p>
                  <p className="text-white/50">12 Rue des Abeilles, Paris</p>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="text-xs font-bold text-white/50 hover:text-white">Modifier</button>
            </div>
          ) : (
            <button 
              onClick={() => setStep(2)}
              className="mx-6 mt-6 flex w-[calc(100%-3rem)] items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 p-4 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Plus className="h-4 w-4" /> Ajouter une adresse de livraison
            </button>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0B0F15]/95 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-[#0B0F15]/95 to-transparent" />
          
          <button 
            disabled={isProcessing || newBalance < 0}
            onClick={() => {
              if (newBalance < 0) return
              if (!hasAddress) {
                setStep(2)
                return
              }
              setIsProcessing(true)
              setTimeout(() => {
                setUserBalance(newBalance)
                setIsProcessing(false)
                setStep(3)
              }, 1500)
            }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-400 py-4 text-lg font-black text-[#0B0F15] shadow-[0_0_30px_rgba(132,204,22,0.15)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (!hasAddress ? "Ajouter une adresse de livraison" : "Confirmer l'échange")}
          </button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VUE 2 : LA LOGISTIQUE (Shipping)
  // -------------------------------------------------------------
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0F15] animate-in slide-in-from-right duration-300">
        <div className="flex items-center p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4">
          <button 
            onClick={() => setStep(1)}
            className="mr-4 transition-transform active:scale-95"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Où livrer ?</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Prénom" autoComplete="given-name" spellCheck={false} className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white placeholder-white/30 transition-colors focus:border-lime-400 focus:bg-lime-400/5 focus:outline-none shadow-[0_0_0_100px_#0B0F15_inset] [-webkit-text-fill-color:white]" />
            <input type="text" placeholder="Nom" autoComplete="family-name" spellCheck={false} className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white placeholder-white/30 transition-colors focus:border-lime-400 focus:bg-lime-400/5 focus:outline-none shadow-[0_0_0_100px_#0B0F15_inset] [-webkit-text-fill-color:white]" />
          </div>

          <input type="text" placeholder="Adresse postale" autoComplete="street-address" spellCheck={false} className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white placeholder-white/30 transition-colors focus:border-lime-400 focus:bg-lime-400/5 focus:outline-none shadow-[0_0_0_100px_#0B0F15_inset] [-webkit-text-fill-color:white]" />

          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <input type="text" inputMode="numeric" placeholder="Code postal" autoComplete="postal-code" spellCheck={false} className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white placeholder-white/30 transition-colors focus:border-lime-400 focus:bg-lime-400/5 focus:outline-none shadow-[0_0_0_100px_#0B0F15_inset] [-webkit-text-fill-color:white]" />
            <input type="text" placeholder="Ville" autoComplete="address-level2" spellCheck={false} className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white placeholder-white/30 transition-colors focus:border-lime-400 focus:bg-lime-400/5 focus:outline-none shadow-[0_0_0_100px_#0B0F15_inset] [-webkit-text-fill-color:white]" />
          </div>

          <input type="text" defaultValue="France" autoComplete="country-name" spellCheck={false} className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white transition-colors focus:border-lime-400 focus:bg-lime-400/5 focus:outline-none shadow-[0_0_0_100px_#0B0F15_inset] [-webkit-text-fill-color:white]" />
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/90 to-transparent p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <button 
            onClick={() => {
              setHasAddress(true)
              setStep(1)
            }}
            className="w-full rounded-2xl bg-white py-4 text-lg font-black text-[#0B0F15] transition-transform active:scale-95"
          >
            Utiliser cette adresse
          </button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VUE 3 : LE CLIMAX (Success)
  // -------------------------------------------------------------
  if (step === 3) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0B0F15] animate-in fade-in zoom-in-95 duration-500">
        {/* Halo lumineux central */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/20 blur-[80px]"></div>

        {/* Visuel Héroïque - Artefact Magique */}
        <div className="relative z-10 animate-[bounce_3s_ease-in-out_infinite]">
          {/* Halo de l'artefact */}
          <div className="absolute inset-0 bg-lime-400/20 blur-2xl rounded-full"></div>
          {/* L'image */}
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden drop-shadow-[0_20px_50px_rgba(132,204,22,0.4)] border border-lime-400/30">
            {imageUrl && (
              <img src={imageUrl} alt={product.name_default} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        {/* Typographie de Triomphe */}
        <div className="z-10 mt-10 space-y-3 px-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-lime-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-lime-400">Échange réussi</span>
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-white">
            Votre récompense<br/>est en route !
          </h2>

          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
            Votre <strong className="font-medium text-white">{product.name_default}</strong> est en cours de préparation. Il sera livré à votre adresse d'ici <strong className="font-medium text-white">2 à 3 jours ouvrés</strong>.
          </p>

          <p className="mt-6 font-mono text-xs text-white/30">Réf: #MTC-8492</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {/* Bouton Primaire (La Boucle) */}
          <button
            onClick={() => router.push('/projects')}
            className="w-full bg-lime-400 text-[#0B0F15] font-black text-[17px] h-14 rounded-2xl active:scale-[0.98] transition-transform hover:bg-lime-500 shadow-[0_0_30px_rgba(132,204,22,0.2)]"
          >
            Soutenir un projet
          </button>
          
          {/* Bouton Secondaire (Utilitaires) */}
          <button
            onClick={() => router.push('/dashboard/investments')}
            className="w-full h-12 text-sm font-bold text-white/50 hover:text-white transition-colors"
          >
            Suivre ma récompense
          </button>
        </div>
      </div>
    )
  }

  return null
}
