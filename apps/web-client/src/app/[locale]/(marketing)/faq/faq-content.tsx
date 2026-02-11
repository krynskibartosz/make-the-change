'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Minus, 
  Zap, 
  Globe, 
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { Button } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'

const faqs = [
  {
    id: '01',
    category: 'Concept',
    q: 'Comment fonctionnent les points ?',
    a: 'Chaque euro investi dans un projet génère des points d\'impact. Ces points sont votre monnaie pour le marketplace : échangez-les contre des produits éco-responsables, des expériences uniques ou réinvestissez-les.',
    icon: Zap,
    color: 'text-amber-500'
  },
  {
    id: '02',
    category: 'Transparence',
    q: 'Puis-je suivre mon impact ?',
    a: "Absolument. Nous utilisons des données satellites et des capteurs IoT pour vous fournir un tableau de bord en temps réel. Vous voyez concrètement où va votre argent : arbres plantés, CO2 capturé, biodiversité restaurée.",
    icon: Globe,
    color: 'text-blue-500'
  },
  {
    id: '03',
    category: 'Finance',
    q: 'Le paiement se fait comment ?',
    a: 'Actuellement, nous acceptons les cartes bancaires et les virements instantanés. La V1 introduit un système de "wallet" impact qui permet aussi d\'utiliser vos points pour soutenir de nouveaux projets.',
    icon: Sparkles,
    color: 'text-purple-500'
  },
  {
    id: '04',
    category: 'Compte',
    q: 'Profil public & Badges ?',
    a: 'Votre profil est votre vitrine d\'impact. Gagnez des badges rares (ex: "Gardien de la Forêt") en atteignant des paliers. Vous pouvez choisir de rendre votre profil public pour inspirer votre communauté.',
    icon: ShieldCheck,
    color: 'text-emerald-500'
  },
]

export function FaqContent() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white selection:bg-emerald-500/30 font-sans transition-colors duration-300">
      
      {/* Background - Static & Subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-emerald-900/10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-10 mix-blend-overlay" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24 max-w-5xl">
        
        {/* Header Section - Clean & Direct */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Help Center</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">
            Questions fréquentes
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10">
            Tout ce que vous devez savoir sur Make the Change, nos projets et votre impact.
          </p>

          <div className="relative w-full max-w-lg">
            <div className="relative flex items-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 shadow-sm transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-transparent border-none outline-none text-base text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* FAQ Grid - Functional & Fast */}
        <div className="grid grid-cols-1 gap-4">
          {faqs.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              className={cn(
                "group relative cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden",
                activeId === item.id 
                  ? "bg-white dark:bg-white/10 border-emerald-500/30 shadow-lg dark:shadow-emerald-900/10" 
                  : "bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20"
              )}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-sm font-bold text-slate-500 dark:text-slate-400">
                      {item.id}
                    </span>
                    <h3 className={cn(
                      "text-lg md:text-xl font-bold transition-colors",
                      activeId === item.id ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                    )}>
                      {item.q}
                    </h3>
                  </div>
                  
                  <div className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-200",
                    activeId === item.id 
                      ? "bg-emerald-500 border-emerald-500 text-white rotate-45" 
                      : "bg-transparent border-slate-200 dark:border-white/20 text-slate-400 group-hover:border-slate-400"
                  )}>
                    <Plus className="h-4 w-4" />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {activeId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="pt-6 pl-0 md:pl-16">
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.a}
                        </p>
                        
                        <div className="mt-6 flex items-center gap-2">
                           <Button variant="ghost" className="h-9 px-4 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 -ml-4">
                             En savoir plus <span className="ml-1">→</span>
                           </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* Simple Footer */}
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Vous ne trouvez pas votre réponse ?</p>
          <a href="#" className="inline-flex items-center text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Contactez notre support
          </a>
        </div>

      </div>
    </div>
  )
}
