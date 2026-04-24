'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Flame, Leaf, Lock, Check, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

// DONNÉES DE TEST (MOCK DATA)
const factionColor = "emerald" // Peut être emerald (Forêt), cyan (Eau) ou amber (Terre)

const syllabus = {
  chapter: { 
    title: "L'Alphabet Originel", 
    subtitle: "Maîtrisez les éléments fondamentaux de la nature." 
  },
  units: [
    { id: "1.1", title: "Les Forges de la Vie", status: "completed", reward: "10 💧" },
    { id: "1.2", title: "Le Peuple Émeraude", status: "completed", reward: "10 🍃" },
    { id: "1.3", title: "Le Bestiaire Sauvage", status: "active", reward: "15 🐾", description: "Découvre les animaux fascinants qui peuplent nos écosystèmes." },
    { id: "2.1", title: "Le Festin des Prédateurs", status: "locked", reward: "20 🐺" }
  ]
}

export default function AcademyPage() {
  const router = useRouter()
  const [selectedUnit, setSelectedUnit] = useState<typeof syllabus.units[0] | null>(null)

  return (
    <div className="min-h-[100dvh] bg-[#05050A] text-white overflow-x-hidden font-sans pb-[max(1rem,env(safe-area-inset-bottom))]">
      {/* ÉTAPE 1: HEADER FIXE (GLASSMORPHISM) */}
      <header className="fixed top-0 w-full z-40 backdrop-blur-md bg-white/5 border-b border-white/5 p-4 flex justify-between items-center pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5">
          <Target className="w-5 h-5 text-white/80" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
        </div>
        
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-white">12 j</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Leaf className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span className="text-sm font-bold text-emerald-400">2 450</span>
        </div>
      </header>

      <main className="pt-[calc(6rem+env(safe-area-inset-top))] px-6">
        {/* ÉTAPE 2: BANNIÈRE DE CHAPITRE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-sm font-bold text-white/80 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">2/4 👑</span>
          </div>
          <h2 className="text-emerald-400 text-xs font-black tracking-[0.2em] mb-2 uppercase">CHAPITRE 1</h2>
          <h1 className="text-2xl font-bold text-white mb-2">{syllabus.chapter.title}</h1>
          <p className="text-sm text-white/60">{syllabus.chapter.subtitle}</p>
        </div>

        {/* ÉTAPE 3: ARBRE D'APPRENTISSAGE EN ZIGZAG (SANS LIGNE SVG) */}
        <div className="flex flex-col gap-10 items-center mt-12 mb-24">
          {syllabus.units.map((unit, index) => {
            const alignmentClass = index % 4 === 1 ? 'mr-16' : index % 4 === 3 ? 'ml-16' : ''
            
            // ÉTAPE 4: DESIGN DES NŒUDS (UNITÉS)
            const isLocked = unit.status === 'locked'
            const isCompleted = unit.status === 'completed'
            const isActive = unit.status === 'active'
            
            return (
              <div key={unit.id} className={cn("relative", alignmentClass)}>
                <button 
                  onClick={() => {
                    if (isActive || isCompleted) {
                      setSelectedUnit(unit)
                    }
                  }}
                  disabled={isLocked}
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-95",
                    isLocked && "bg-white/5 opacity-60 cursor-not-allowed",
                    isCompleted && "bg-white/10 border border-white/20",
                    isActive && "bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)]"
                  )}
                >
                  {isLocked && <Lock className="w-8 h-8 text-white/40" />}
                  {isCompleted && <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />}
                  {isActive && <Flame className="w-8 h-8 text-white fill-white" />}
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

      {/* ÉTAPE 5: ÉCRAN FULL-SCREEN (SAS DE PRÉPARATION) */}
      <AnimatePresence>
        {selectedUnit && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#05050A] flex flex-col overscroll-contain"
          >
            <div className="relative h-64 bg-emerald-900/30 rounded-b-[40px] overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] to-transparent z-10" />
              
              <button 
                onClick={() => setSelectedUnit(null)}
                className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-20 w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
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

            <div className="absolute bottom-0 left-0 w-full p-6 pb-[max(2rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#05050A] via-[#05050A]/95 to-transparent">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
