'use client'

import { motion } from 'framer-motion'
import { Check, Lock, Play } from 'lucide-react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { getAllChapters } from '@/lib/mock/mock-academy'

const chapters = getAllChapters()

export default function ChaptersPage() {
  const router = useRouter()

  return (
    <FullScreenSlideModal
      title="Programme de l'Académie"
      headerMode="close"
      fallbackHref="/academy"
      className="bg-[#05050A] text-white"
    >
      {/* Padding top augmenté (pt-28) pour ne pas coller au header/croix */}
      <div className="max-w-xl mx-auto px-5 pt-28 pb-32">
        <div className="flex flex-col gap-5">
          {chapters.map((chapter) => {
            const isCompleted = chapter.status === 'completed'
            const isActive = chapter.status === 'active'
            const isLocked = chapter.status === 'locked'

            const totalUnits = chapter.units.length
            const completedUnitsCount = chapter.units.filter(u => u.status === 'completed').length

            return (
              <motion.div
                key={chapter.id}
                onClick={() => {
                  if (!isLocked) {
                    router.push('/academy')
                  }
                }}
                whileTap={!isLocked ? { scale: 0.96 } : {}}
                className={cn(
                  "relative rounded-[32px] p-5 flex items-center gap-5 transition-colors duration-200",
                  !isLocked && "cursor-pointer",
                  isActive ? "bg-emerald-500/10 border-2 border-emerald-500/30" : 
                  isCompleted ? "bg-white/5 border-2 border-transparent hover:bg-white/10" : 
                  "bg-white/[0.02] border-2 border-transparent opacity-50 grayscale-[50%]"
                )}
              >
                {/* Icône circulaire (façon Headspace/Duolingo) */}
                <div className={cn(
                  "w-16 h-16 shrink-0 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" :
                  isCompleted ? "bg-white/10 text-white" :
                  "bg-black/40 text-white/30 border border-white/5"
                )}>
                  {isActive && <Play className="w-7 h-7 ml-1 fill-current" />}
                  {isCompleted && <Check className="w-7 h-7" strokeWidth={3} />}
                  {isLocked && <Lock className="w-6 h-6" />}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-widest",
                      isActive ? "text-emerald-400" : "text-white/40"
                    )}>
                      Section {chapter.id}
                    </span>
                    
                    {/* Badge d'unités (remplace la progress bar) */}
                    {(isActive || isCompleted) && totalUnits > 0 && (
                      <span className="text-[10px] font-bold text-white/60 bg-black/40 px-2.5 py-1 rounded-full tabular-nums">
                        {completedUnitsCount} / {totalUnits} unités
                      </span>
                    )}
                  </div>
                  
                  <h3 className={cn(
                    "text-xl font-black truncate mb-1",
                    isLocked ? "text-white/60" : "text-white"
                  )}>
                    {chapter.title}
                  </h3>
                  
                  <p className={cn(
                    "text-sm line-clamp-2 leading-relaxed",
                    isLocked ? "text-white/30" : "text-white/60"
                  )}>
                    {chapter.subtitle}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
