'use client'

import { motion } from 'framer-motion'
import { Flame, Snowflake, Info, Check } from 'lucide-react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { cn } from '@/lib/utils'

export default function StreakPage() {
  // Simuler les jours du mois actuel (simplifié pour le design)
  // On suppose un mois de 30 jours commençant un Lundi, avec un streak de 12 jours jusqu'à aujourd'hui (le 12).
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const isCompleted = day <= 12
    const isToday = day === 12
    return { day, isCompleted, isToday }
  })

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  return (
    <FullScreenSlideModal
      title="Série"
      headerMode="close"
      fallbackHref="/academy"
      className="bg-[#05050A] text-white"
    >
      <div className="max-w-xl mx-auto px-5 pt-6 pb-32 flex flex-col gap-8">
        
        {/* ── HEADER STREAK (Hero) ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-2 mt-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-8xl font-black text-orange-500 tracking-tighter drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              12
            </span>
            <span className="text-xl font-bold text-white/80 -mt-2">
              jours de série
            </span>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-500/30 blur-[40px] rounded-full" />
            <Flame className="w-32 h-32 text-orange-500 fill-orange-500 drop-shadow-[0_10px_20px_rgba(249,115,22,0.4)] relative z-10" />
          </motion.div>
        </div>

        {/* ── BENTO : GELS DE SÉRIE ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center shrink-0">
              <Snowflake className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-0.5">Gels de série</h3>
              <p className="text-sm text-white/50">Tu as 2 gels équipés sur 2</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors">
            <Info className="w-5 h-5 text-white/60" />
          </button>
        </motion.div>

        {/* ── BENTO : CALENDRIER ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-[32px] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white">Avril</h3>
            <span className="text-sm font-bold text-white/50 bg-black/40 px-3 py-1.5 rounded-full">
              Année 2026
            </span>
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-2">
            {/* Jours de la semaine */}
            {weekDays.map((day, i) => (
              <div key={`header-${i}`} className="text-center text-xs font-bold text-white/40 mb-2">
                {day}
              </div>
            ))}

            {/* Grille du mois */}
            {days.map(({ day, isCompleted, isToday }) => (
              <div key={day} className="flex justify-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    isCompleted
                      ? "bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                      : "bg-white/5 text-white/30",
                    isToday && "ring-2 ring-orange-500 ring-offset-2 ring-offset-[#05050A]"
                  )}
                >
                  {isCompleted ? <Flame className="w-5 h-5 fill-black/30" /> : day}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-black/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="mt-0.5">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Complète une leçon chaque jour pour construire ta série. Un gel de série te protège si tu rates un jour !
            </p>
          </div>
        </motion.div>

      </div>
    </FullScreenSlideModal>
  )
}
