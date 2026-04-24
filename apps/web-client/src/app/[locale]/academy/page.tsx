'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Flame, Leaf, Lock, Check, ChevronLeft, Sprout, Crown, BookOpen, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter, Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'

// DONNÉES DE TEST (MOCK DATA)
const factionColor = "emerald" // Peut être emerald (Forêt), cyan (Eau) ou amber (Terre)

const syllabus = {
  chapter: { 
    title: "L'Alphabet Originel", 
    subtitle: "Maîtrisez les éléments fondamentaux de la nature." 
  },
  units: [
    { id: "1.1", title: "Les Forges de la Vie", status: "completed", reward: "10 💧", mascotte: "ondine" },
    { id: "1.2", title: "Le Peuple Émeraude", status: "completed", reward: "10 🍃", mascotte: "sylva" },
    { id: "1.3", title: "Le Bestiaire Sauvage", status: "active", reward: "15 🐾", description: "Découvre les animaux fascinants qui peuplent nos écosystèmes.", mascotte: "abeille-transparente" },
    { id: "2.1", title: "Le Festin des Prédateurs", status: "locked", reward: "20 🐺", mascotte: "ondine" }
  ]
}

export default function AcademyPage() {
  const router = useRouter()
  const [selectedUnit, setSelectedUnit] = useState<typeof syllabus.units[0] | null>(null)

  return (
    <FullScreenSlideModal
      headerMode="none"
      className="bg-[#05050A] text-white overflow-x-hidden font-sans relative"
      contentClassName="pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      {/* Background Pattern (Parallax Effect) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Contenu de la page avec un index z plus élevé pour passer au-dessus du pattern */}
      <div className="relative z-10">
        {/* ÉTAPE 1: HEADER FIXE (GLASSMORPHISM) */}
        <header className="fixed top-0 w-full z-40 backdrop-blur-md bg-white/5 border-b border-white/5 p-4 flex justify-between items-center pt-[max(1rem,env(safe-area-inset-top))]">
        <Link href="/academy/chapters" className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white/10 active:scale-95 group">
          <div className="relative flex items-center justify-center w-6 h-6">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[9px] font-medium text-white/40 uppercase tracking-widest">Section</span>
            <span className="text-xs font-black text-white">Chapitre 1</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
        </Link>

        
        <div className="flex items-center gap-2">
          {/* Abonnement Icon */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Crown className="w-5 h-5 fill-indigo-400/20" />
          </div>

          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-sm font-bold text-white">12 j</span>
          </div>
        </div>
        
        <Link 
          href="/seeds" 
          prefetch={false} 
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-transform hover:scale-105 active:scale-95"
        >
          <Sprout className="h-3.5 w-3.5 text-lime-400" />
          <span className="text-xs font-bold text-white tabular-nums">2 450</span>
        </Link>
      </header>

      <main className="pt-[calc(6rem+env(safe-area-inset-top))] px-6">
        {/* ÉTAPE 2: BANNIÈRE DE CHAPITRE */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 p-4 z-10">
            <span className="text-sm font-bold text-white/80 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">2/4 👑</span>
          </div>
          
          {/* Mascotte du Chapitre (Melli par exemple pour l'introduction) */}
          <div className="w-24 h-24 mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Image src="/abeille-transparente.png" alt="Melli" fill className="object-contain" />
          </div>

          <h2 className="text-emerald-400 text-xs font-black tracking-[0.2em] mb-2 uppercase relative z-10">CHAPITRE 1</h2>
          <h1 className="text-3xl font-black text-white mb-2 relative z-10">{syllabus.chapter.title}</h1>
          <p className="text-sm text-white/60 relative z-10 max-w-[250px]">{syllabus.chapter.subtitle}</p>
          
          {/* Effet lumineux derrière la bannière */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[50px] rounded-full" />
        </div>

        {/* ÉTAPE 3: ARBRE D'APPRENTISSAGE EN ZIGZAG (SANS LIGNE SVG) */}
        <div className="flex flex-col gap-10 items-center mt-12 mb-24">
          {syllabus.units.map((unit, index) => {
            // Zigzag: centre, droite, centre, gauche
            const goesRight = index % 4 === 1 // décalé vers la droite
            const goesLeft  = index % 4 === 3 // décalé vers la gauche
            const alignmentClass = goesRight ? 'mr-16' : goesLeft ? 'ml-16' : ''

            const isLocked    = unit.status === 'locked'
            const isCompleted = unit.status === 'completed'
            const isActive    = unit.status === 'active'

            // Mascotte du côté opposé au décalage
            const showMascotLeft  = goesRight // node va à droite → mascotte à gauche
            const showMascotRight = goesLeft  // node va à gauche → mascotte à droite

            return (
              <div key={unit.id} className={cn('relative', alignmentClass)}>

                {/* Mascotte côté gauche (quand le nœud part à droite) */}
                {showMascotLeft && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: isLocked ? 0.25 : 0.85, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute right-full top-1/2 -translate-y-1/2 -translate-x-3 w-14 h-14 pointer-events-none"
                  >
                    <Image
                      src={`/${unit.mascotte}.png`}
                      alt={unit.mascotte}
                      fill
                      className="object-contain drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    />
                  </motion.div>
                )}

                {/* Mascotte côté droit (quand le nœud part à gauche) */}
                {showMascotRight && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isLocked ? 0.25 : 0.85, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 translate-x-3 w-14 h-14 pointer-events-none"
                  >
                    <Image
                      src={`/${unit.mascotte}.png`}
                      alt={unit.mascotte}
                      fill
                      className="object-contain drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] scale-x-[-1]"
                    />
                  </motion.div>
                )}

                <button
                  onClick={() => {
                    if (isActive || isCompleted) {
                      setSelectedUnit(unit)
                    }
                  }}
                  disabled={isLocked}
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-95',
                    isLocked    && 'bg-white/5 opacity-60 cursor-not-allowed',
                    isCompleted && 'bg-white/10 border border-white/20',
                    isActive    && 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)]'
                  )}
                >
                  {isLocked    && <Lock className="w-8 h-8 text-white/40" />}
                  {isCompleted && <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />}
                  {isActive    && <Flame className="w-8 h-8 text-white fill-white" />}
                </button>

                {isActive && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                    className="absolute -top-10 -right-24 bg-white text-black px-3 py-1.5 rounded-2xl rounded-bl-none text-sm font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Image src="/sylva.png" alt="Sylva" width={24} height={24} className="object-contain" /> C'est ici !
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* ÉTAPE 5: ÉCRAN FULL-SCREEN (SAS DE PRÉPARATION) VIA FULLSCREENSLIDEMODAL */}
      <AnimatePresence>
        {selectedUnit && (
          <FullScreenSlideModal
            headerMode="dynamic"
            title={selectedUnit.title}
            onClose={() => setSelectedUnit(null)}
            className="bg-[#05050A]"
          >
            <div className="relative h-64 bg-emerald-900/30 rounded-b-[40px] overflow-hidden shrink-0 mt-[-env(safe-area-inset-top)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] to-transparent z-10" />
              
              {/* Effet lumineux centré dans le header hero */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/30 blur-[60px] rounded-full" />
            </div>

            <div className="flex-1 px-6 pt-8 pb-32 flex flex-col items-center text-center">
              <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-4">
                Chapitre 1 — Unité {selectedUnit.id}
              </span>
              <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                {selectedUnit.title}
              </h2>
              
              {selectedUnit.description && (
                <p className="text-white/70 text-base leading-relaxed mb-8">
                  {selectedUnit.description}
                </p>
              )}

              <div className="flex gap-4 mb-auto">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white/90 text-sm font-medium flex items-center gap-2 shadow-lg">
                  <span>⏱️</span> 2 min
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white/90 text-sm font-medium flex items-center gap-2 shadow-lg">
                  <span>🧠</span> 4 exercices
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 left-0 w-full p-6 pb-[max(2rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#05050A] via-[#05050A]/95 to-transparent z-20">
              <div className="mb-4 text-center">
                <span className="inline-flex items-center gap-2 bg-emerald-900/40 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  🎁 Récompense à la clé : +{selectedUnit.reward}
                </span>
              </div>
              <button 
                onClick={() => {
                  router.push(`/academy/chapitre-1/${selectedUnit.id}`)
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-lg font-black rounded-2xl py-5 shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95"
              >
                DÉMARRER L'EXPLORATION
              </button>
            </div>
          </FullScreenSlideModal>
        )}
      </AnimatePresence>
      </div> {/* Fin du wrapper z-10 */}
    </FullScreenSlideModal>
  )
}
