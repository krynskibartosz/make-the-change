'use client'

import { Sprout, Mail } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

export function Step5Paywall() {
  const router = useRouter()
  // In a real app, this would come from state or URL params
  const selectedFaction = 'forets' // Default for now

  const handleSignup = () => {
    // In a real app, this would trigger actual authentication
    // For now, redirect to paywall premium
    router.push('/onboarding/step-6')
  }

  return (
    <div className="px-6 flex flex-col items-center justify-center max-w-md mx-auto w-full h-full pb-12 animate-in zoom-in-95 duration-500">
      <div className="relative mb-8 mt-12">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center z-10 relative shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-500/30">
          <img
            src={selectedFaction === 'faune'
              ? '/abeille-transparente.png'
              : selectedFaction === 'humain'
                ? '/aura.png'
                : '/sylva.png'}
            alt="Mascotte"
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="absolute -top-2 -right-2 bg-[#0B0F15] rounded-full p-1 z-20">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-[#0B0F15] text-xs font-black px-2 py-1 rounded-full border border-[#0B0F15]">
            +500 <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-black text-center mb-3">
        Votre profil est prêt !
      </h2>
      <p className="text-white/60 text-center mb-10 text-sm px-4">
        Créez votre compte gratuit pour sauvegarder vos{" "}
        <strong className="text-emerald-400">500 Graines</strong> et
        rejoindre votre faction.
      </p>

      <div className="w-full space-y-3">
        <button onClick={handleSignup} className="w-full bg-white text-black py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>
          Continuer avec Apple
        </button>
        <button onClick={handleSignup} className="w-full bg-[#4285F4] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#4285F4]/90 active:scale-95 transition-all">
          <div className="w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center text-[#4285F4] font-black text-[10px]">
            G
          </div>
          Continuer avec Google
        </button>
        <div className="flex items-center gap-4 my-4 opacity-30">
          <div className="h-px bg-white flex-1"></div>
          <span className="text-xs font-medium uppercase tracking-wider">
            OU
          </span>
          <div className="h-px bg-white flex-1"></div>
        </div>
        <button onClick={handleSignup} className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all">
          <Mail size={18} />
          Créer un compte avec Email
        </button>
      </div>

      <p className="text-[10px] text-white/30 text-center mt-6 px-8">
        En continuant, vous acceptez nos Conditions d'utilisation et
        notre Politique de confidentialité.
      </p>
    </div>
  )
}
