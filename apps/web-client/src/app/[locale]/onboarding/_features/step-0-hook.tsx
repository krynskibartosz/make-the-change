'use client'

import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function Step0Hook() {
  return (
    <>
      {/* L'Image de Fond (Totalement verrouillée en arrière-plan) */}
      <img
        src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        alt="Forêt"
      />

      {/* Le "Scrim" (Dégradé sombre : plus intense en bas pour lire le texte) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F15]/30 via-[#0B0F15]/70 to-[#0B0F15] opacity-95"></div>

      {/* 2. LE CONTENU (Flex-col avec espace dynamique) */}
      <div className="relative z-10 h-full w-full flex flex-col justify-end px-6 pb-8 pt-12">
        {/* Espace vide "ressort" (pousse tout le contenu vers le bas) */}
        <div className="flex-1"></div>

        {/* Le Bloc Textuel */}
        <div className="flex flex-col items-center text-center">
          {/* Badge Make the change */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span className="text-[10px] font-bold text-lime-400 tracking-widest uppercase">Make The Change</span>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white leading-[1.1] mb-4 tracking-tighter text-balance"
          >
            Soutenez la biodiversité.<br />Récoltez ses fruits.
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-gray-300 font-medium leading-relaxed mb-8 max-w-sm text-pretty px-2"
          >
            Soutenez les projets de nos artisans locaux, protégez la biodiversité et recevez leurs produits d'exception en remerciement.
          </motion.p>
        </div>

        {/* Le Bloc "Trust Indicators" (Les stats) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-6 w-full max-w-md mx-auto"
        >
          {/* Stat 1 */}
          <div className="bg-[#1A1F26]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-amber-400">⬢</span>
              <span className="text-xl font-black text-white">290k+</span>
            </div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Abeilles Protégées</span>
          </div>
          {/* Stat 2 */}
          <div className="bg-[#1A1F26]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={16} className="text-lime-400" />
              <span className="text-xl font-black text-lime-400">100%</span>
            </div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Circuit Court</span>
          </div>
        </motion.div>

        {/* Le Bouton d'Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        >
          <Link
            href="/onboarding/step-1"
            className="w-full max-w-md mx-auto h-16 shrink-0 rounded-2xl bg-lime-400 text-[#0B0F15] font-black text-lg flex items-center justify-center gap-2 group active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(132,204,22,0.2)]"
          >
            Découvrir le mouvement
            <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </>
  )
}
