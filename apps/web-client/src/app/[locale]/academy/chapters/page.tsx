'use client'

import { motion } from 'framer-motion'
import { Check, Lock, Play } from 'lucide-react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

// Mock des chapitres basé sur le curriculum
const chapters = [
  {
    id: 1,
    title: "L'Alphabet Originel",
    level: "A1",
    description: "Découvrez les éléments fondamentaux de la nature.",
    status: "active", // 'completed', 'active', 'locked'
    progress: 25,
  },
  {
    id: 2,
    title: "La Grammaire des Espèces",
    level: "A2",
    description: "Comprenez comment les êtres vivants interagissent et s'allient secrètement.",
    status: "locked",
    progress: 0,
  },
  {
    id: 3,
    title: "L'Économie de la Biosphère",
    level: "B1",
    description: "Plongez dans les immenses cycles qui maintiennent notre planète en marche.",
    status: "locked",
    progress: 0,
  },
  {
    id: 4,
    title: "Les Sanctuaires Sauvages",
    level: "B2",
    description: "Explorez les habitats uniques, isolés et fragiles.",
    status: "locked",
    progress: 0,
  },
  {
    id: 5,
    title: "L'Éveil des Gardiens",
    level: "C1/C2",
    description: "Devenez un véritable acteur de la protection de la biodiversité.",
    status: "locked",
    progress: 0,
  }
]

export default function ChaptersPage() {
  const router = useRouter()

  return (
    <FullScreenSlideModal
      title="Programme de l'Académie"
      headerMode="close"
      fallbackHref="/academy"
      className="bg-[#05050A] text-white"
    >
      <div className="max-w-xl mx-auto px-4 pt-6 pb-32">
        <div className="flex flex-col gap-4">
          {chapters.map((chapter, index) => {
            const isCompleted = chapter.status === 'completed'
            const isActive = chapter.status === 'active'
            const isLocked = chapter.status === 'locked'

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                key={chapter.id}
                onClick={() => {
                  if (!isLocked) {
                    router.push('/academy')
                  }
                }}
                className={cn(
                  "relative rounded-3xl p-5 border transition-all duration-300",
                  isActive ? "bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.05)] cursor-pointer hover:border-emerald-500 hover:bg-emerald-900/30" : "",
                  isCompleted ? "bg-white/5 border-white/10 cursor-pointer hover:bg-white/10" : "",
                  isLocked ? "bg-black/40 border-white/5 opacity-60 cursor-not-allowed" : ""
                )}
              >
                {/* Ligne connectrice visuelle (façon Duolingo) */}
                {index < chapters.length - 1 && (
                  <div className="absolute left-11 -bottom-4 w-[2px] h-4 bg-white/10 z-0" />
                )}

                <div className="flex items-start gap-4 relative z-10">
                  {/* Icône de statut */}
                  <div className={cn(
                    "w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors",
                    isActive ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "",
                    isCompleted ? "bg-white/10 text-white" : "",
                    isLocked ? "bg-black text-white/40 border border-white/10" : ""
                  )}>
                    {isActive && <Play className="w-6 h-6 ml-1 fill-current" />}
                    {isCompleted && <Check className="w-6 h-6" strokeWidth={3} />}
                    {isLocked && <Lock className="w-6 h-6" />}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest",
                        isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/60"
                      )}>
                        Section {chapter.id}
                      </span>
                      <span className="text-xs font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-lg">
                        {chapter.level}
                      </span>
                    </div>
                    <h3 className={cn(
                      "text-xl font-black mb-2 leading-tight",
                      isLocked ? "text-white/60" : "text-white"
                    )}>
                      {chapter.title}
                    </h3>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      isLocked ? "text-white/40" : "text-white/70"
                    )}>
                      {chapter.description}
                    </p>

                    {/* Progress Bar (seulement si actif ou complété) */}
                    {(isActive || isCompleted) && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-black/50 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${chapter.progress}%` }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            className="h-full bg-emerald-500 rounded-full relative"
                          >
                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 rounded-full blur-[2px]" />
                          </motion.div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 tabular-nums w-8 text-right">
                          {chapter.progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
