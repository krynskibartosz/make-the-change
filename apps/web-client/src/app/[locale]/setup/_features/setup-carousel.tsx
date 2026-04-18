'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { completeMockSetup } from '@/app/[locale]/(auth)/actions'
import { useFormStatus } from 'react-dom'

const FACTIONS = [
  {
    id: 'pollinisateurs',
    value: 'Vie Sauvage',
    name: 'Vie Sauvage',
    mascotName: 'Melli',
    description: 'Protège la faune, les pollinisateurs et les espèces emblématiques.',
    colorTheme: 'from-amber-500/30 via-amber-500/5 to-transparent',
    accentColor: 'bg-amber-500',
    accentText: 'text-amber-500',
    buttonText: "Rejoindre l'Essaim",
    image: '/abeille-transparente.png'
  },
  {
    id: 'forets',
    value: 'Terres & Forêts',
    name: 'Terres & Forêts',
    mascotName: 'Sylva',
    description: 'Régénère les sols, les forêts et les paysages agricoles vivants.',
    colorTheme: 'from-emerald-500/30 via-emerald-500/5 to-transparent',
    accentColor: 'bg-emerald-500',
    accentText: 'text-emerald-500',
    buttonText: 'Protéger les Forêts',
    image: '/sylva.png'
  },
  {
    id: 'artisans',
    value: 'Artisans Locaux',
    name: 'Artisans Locaux',
    mascotName: 'Aura',
    description: 'Soutiens les producteurs, coopératives et le savoir-faire local.',
    colorTheme: 'from-rose-500/30 via-rose-500/5 to-transparent',
    accentColor: 'bg-rose-500',
    accentText: 'text-rose-500',
    buttonText: 'Soutenir les Artisans',
    image: '/aura.png'
  }
]

function SubmitButton({ activeColor, text }: { activeColor: string; text: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-4 rounded-2xl font-black text-[#0B0F15] text-[17px] transition-all duration-500 active:scale-95 flex items-center justify-center gap-2 ${activeColor}`}
    >
      {pending ? <Loader2 className="w-6 h-6 animate-spin text-[#0B0F15]" /> : text}
    </button>
  )
}

export function SetupCarousel({ returnTo }: { returnTo: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const container = containerRef.current
      const scrollPosition = container.scrollLeft
      const itemWidth = container.clientWidth
      
      const newIndex = Math.round(scrollPosition / itemWidth)
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }
    }
    
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [activeIndex])

  const activeFaction = FACTIONS[activeIndex]

  return (
    <div className="relative h-[100dvh] w-full bg-[#0B0F15] overflow-hidden flex flex-col">
      {/* 1. Top Bar (Fixe) */}
      <div className="absolute top-0 left-0 w-full z-10 pt-[max(1.5rem,env(safe-area-inset-top))] px-6 pointer-events-none">
        <p className={`text-[10px] font-black uppercase tracking-[0.25em] transition-colors duration-500 ${activeFaction.accentText}`}>
          VOTRE AVENTURE
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white drop-shadow-md">
          Choisis ton compagnon
        </h1>
      </div>

      {/* Background Glow Dynamique */}
      <div 
        className={`absolute top-0 left-0 right-0 h-3/5 bg-gradient-to-b ${activeFaction.colorTheme} transition-all duration-700 ease-in-out pointer-events-none`} 
      />

      {/* 2. Le Carousel Central */}
      <div 
        ref={containerRef}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full h-full relative z-0"
      >
        {FACTIONS.map((faction, idx) => {
          const isActive = activeIndex === idx
          return (
            <div 
              key={faction.id}
              className="w-full h-full shrink-0 snap-center flex flex-col items-center justify-center pt-20 px-6 pb-40"
            >
              {/* Mascotte Flottante */}
              <div 
                className={`relative w-full max-w-[280px] aspect-square transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isActive ? 'opacity-100 scale-100 translate-y-0' : 'opacity-40 scale-90 translate-y-8'
                } animate-[bounce_4s_ease-in-out_infinite]`}
              >
                <img 
                  src={faction.image} 
                  alt={faction.mascotName} 
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Textes Faction */}
              <div 
                className={`mt-8 text-center transition-all duration-700 delay-100 ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {faction.name}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70 max-w-sm mx-auto font-medium">
                  {faction.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Footer Control (Fixe en bas) */}
      <div className="absolute bottom-0 left-0 w-full z-20 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 px-6 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/90 to-transparent">
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {FACTIONS.map((faction, idx) => (
            <div 
              key={`dot-${faction.id}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeIndex === idx ? `w-8 ${faction.accentColor}` : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Action Button & Form */}
        <form action={completeMockSetup} className="flex flex-col items-center gap-4 w-full">
          <input type="hidden" name="faction" value={activeFaction.value} />
          <input type="hidden" name="returnTo" value={returnTo} />
          
          <SubmitButton 
            activeColor={activeFaction.accentColor} 
            text={activeFaction.buttonText} 
          />
          
          <Link 
            href={returnTo} 
            className="text-[13px] font-bold text-white/40 tracking-wide uppercase hover:text-white transition-colors py-2"
          >
            Revenir plus tard
          </Link>
        </form>
      </div>
    </div>
  )
}
