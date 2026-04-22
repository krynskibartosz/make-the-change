'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Loader2, Users } from 'lucide-react'
import { completeMockSetup } from '@/app/[locale]/(auth)/actions'
import { useFormStatus } from 'react-dom'
import { Link } from '@/i18n/navigation'

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

type FactionCarouselProps = {
  returnTo?: string
  onboardingMode?: boolean
  onFactionSelect?: (faction: typeof FACTIONS[number]) => void | Promise<void>
  redirectAfterSelection?: string
}

export function FactionCarousel({ returnTo, onboardingMode = false, onFactionSelect, redirectAfterSelection }: FactionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

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

  const activeFaction = FACTIONS[Math.max(0, Math.min(activeIndex, FACTIONS.length - 1))]!
  const scrollToFaction = (index: number) => {
    const container = containerRef.current
    if (!container) return

    const clampedIndex = Math.max(0, Math.min(index, FACTIONS.length - 1))
    const left = container.clientWidth * clampedIndex

    container.scrollTo({
      left,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
    setActiveIndex(clampedIndex)
  }

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full bg-[#0B0F15] overflow-hidden flex flex-col">

      {/* 1. HEADER (Fixe en haut) */}
      <div className="flex-none pt-safe-top px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          {onboardingMode ? (
            <Link
              href="/onboarding/step-1"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
          ) : (
            <div className="w-10"></div>
          )}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeFaction.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className={`text-[10px] font-black uppercase tracking-[0.25em] ${activeFaction.accentText}`}
            >
              VOTRE AVENTURE
            </motion.p>
          </AnimatePresence>
          <div className="w-10"></div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          Choisis ton compagnon
        </h1>
      </div>

      {/* Background Glow Dynamique */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFaction.id}
          initial={prefersReducedMotion ? false : { opacity: 0.45, scale: 0.96 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute top-0 left-0 right-0 h-3/5 bg-gradient-to-b ${activeFaction.colorTheme} pointer-events-none`}
        />
      </AnimatePresence>

      {/* 2. BODY : LE CARROUSEL (Zone de Swipe) */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full h-full relative z-0"
      >
        {FACTIONS.map((faction, idx) => {
          const isActive = activeIndex === idx
          return (
            <div
              key={faction.id}
              className="w-full h-full shrink-0 snap-center flex flex-col items-center justify-center pt-8 px-6 pb-32"
            >
              {/* Mascotte Flottante */}
              <motion.div
                initial={false}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: isActive ? 1 : 0.4,
                        scale: isActive ? 1 : 0.9,
                        y: isActive ? [0, -8, 0] : 20,
                        rotate: isActive ? [0, -1, 1, 0] : 0,
                      }
                }
                transition={{
                  opacity: { duration: 0.28, ease: 'easeOut' },
                  scale: { type: 'spring', stiffness: 220, damping: 18 },
                  y: isActive
                    ? { duration: 4.2, ease: 'easeInOut', repeat: Infinity }
                    : { type: 'spring', stiffness: 180, damping: 20 },
                  rotate: isActive
                    ? { duration: 4.8, ease: 'easeInOut', repeat: Infinity }
                    : { duration: 0.2 },
                }}
                className="relative w-full max-w-[280px] aspect-square"
              >
                <img 
                  src={faction.image} 
                  alt={faction.mascotName} 
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                />
              </motion.div>

              {/* Textes Faction */}
              <motion.div
                initial={false}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 16,
                      }
                }
                transition={{
                  opacity: { duration: 0.24, ease: 'easeOut' },
                  y: { type: 'spring', stiffness: 220, damping: 22 },
                  delay: isActive ? 0.08 : 0,
                }}
                className="mt-8 text-center"
              >
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {faction.mascotName}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70 max-w-sm mx-auto font-medium">
                  {faction.description}
                </p>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* 3. Footer Control (Fixe en bas) */}
      <div className="absolute bottom-0 left-0 w-full z-20 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 px-6 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/90 to-transparent">
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {FACTIONS.map((faction, idx) => (
            <button
              type="button"
              key={`dot-${faction.id}`}
              onClick={() => scrollToFaction(idx)}
              aria-label={`Choisir ${faction.name}`}
              aria-pressed={activeIndex === idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeIndex === idx ? `w-8 ${faction.accentColor}` : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Action Button & Form */}
        {onFactionSelect ? (
          // Mode personnalisé (micro-onboarding post-paiement)
          <motion.button
            onClick={() => onFactionSelect(activeFaction)}
            className={`w-full py-4 rounded-2xl font-black text-[#0B0F15] text-[17px] transition-all duration-500 active:scale-95 flex items-center justify-center gap-2 ${activeFaction.accentColor}`}
          >
            {activeFaction.buttonText}
          </motion.button>
        ) : onboardingMode ? (
          // Mode onboarding (Tunnel A)
          <Link
            href="/onboarding/step-3"
            className={`w-full py-4 rounded-2xl font-black text-[#0B0F15] text-[17px] transition-all duration-500 active:scale-95 flex items-center justify-center gap-2 ${activeFaction.accentColor}`}
          >
            {activeFaction.buttonText}
          </Link>
        ) : (
          // Mode setup classique
          <form action={completeMockSetup} className="flex flex-col items-center gap-4 w-full">
            <input type="hidden" name="faction" value={activeFaction.value} />
            {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
            {redirectAfterSelection && <input type="hidden" name="redirectAfterSelection" value={redirectAfterSelection} />}
            
            <motion.div
              key={activeFaction.id}
              initial={prefersReducedMotion ? false : { opacity: 0.7, y: 12 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="w-full"
            >
              <SubmitButton 
                activeColor={activeFaction.accentColor} 
                text={activeFaction.buttonText} 
              />
            </motion.div>

            <p className="text-center text-[12px] font-medium text-white/45 leading-relaxed px-5">
              Fais glisser ou touche les points pour explorer les 3 alliances.
              <span className="block mt-1 text-white/30">
                Ce choix est requis pour entrer dans l&apos;application.
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
