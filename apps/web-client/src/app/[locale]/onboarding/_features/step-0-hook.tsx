'use client'

import { motion } from 'framer-motion'
import { Leaf, ChevronRight, Hexagon, CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function Step0Hook() {
  return (
    <div className="relative flex-1 flex flex-col justify-end p-8 pb-12">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/80 to-transparent"></div>
      <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay"></div>

      <div className="relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full mb-2 backdrop-blur-md">
          <Leaf size={14} className="text-emerald-400" />
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Make The Change
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl font-black leading-tight text-balance"
        >
          Soutenez la biodiversité.<br />Récoltez ses fruits.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed"
        >
          Soutenez les projets de nos artisans locaux, protégez la
          biodiversité et recevez leurs produits d'exception en
          remerciement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="bg-white/5 rounded-2xl p-4 mt-8 flex justify-around items-center border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
              <Hexagon size={14} fill="currentColor" />
              <p className="text-xl font-black">290k+</p>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Abeilles protégées
            </p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
              <CheckCircle2 size={16} />
              <p className="text-xl font-black">100%</p>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              Circuit Court
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
        >
          <Link
            href="/onboarding/step-1"
            className="w-full mt-6 py-4 rounded-2xl bg-emerald-500 text-[#0B0F15] font-black text-[15px] flex items-center justify-center gap-2 hover:bg-emerald-400 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Découvrir le mouvement <ChevronRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
