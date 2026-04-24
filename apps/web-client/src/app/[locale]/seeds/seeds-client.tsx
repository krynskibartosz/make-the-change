'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Sprout, Zap, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SeedsClientProps {
  balance: number
  transactions: Array<{
    id: string
    label: string
    delta: number
    createdAt: string
  }>
}

export default function SeedsClient({ balance, transactions }: SeedsClientProps) {

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Wallet Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium text-white">Mes Graines</h1>
          <div className="flex items-center gap-2 relative">
            <div className="absolute inset-0 bg-amber-500/12 blur-[60px]" />
            <Sprout className="w-6 h-6 text-amber-400 relative z-10" />
            <span className="text-xl font-bold text-white tabular-nums relative z-10">{balance.toLocaleString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 px-5 pb-32 pt-24 sm:px-6">
        
        {/* Quick Earn - Besoin de graines ? */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6">Besoin de graines ?</h2>
          <div className="space-y-3">
            <Link
              href="/aventure?tab=defis"
              className="block relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-amber-500/30 transition-all"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Défi du jour</h3>
                    <p className="text-xs text-white/40">Action immédiate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">+150</span>
                  <Sprout className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </Link>
            <Link
              href="/aventure?tab=defis"
              className="block relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-amber-500/30 transition-all"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-400/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Éco-Fact</h3>
                    <p className="text-xs text-white/40">Apprends & gagne</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">+50</span>
                  <Sprout className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* History - Apple Wallet Style */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Mon carnet de route</h2>
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.03), duration: 0.3 }}
                className="flex items-center justify-between py-3"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white text-sm">{transaction.label}</p>
                    <span className={cn(
                      'font-bold text-sm tabular-nums ml-4',
                      transaction.delta > 0 ? 'text-amber-400' : 'text-white/40'
                    )}>
                      {transaction.delta > 0 ? '+' : ''}{transaction.delta} <Sprout className="inline h-4 w-4 align-text-bottom" />
                    </span>
                  </div>
                  <p className="text-xs text-white/30 mt-1">
                    Il y a {Math.floor((Date.now() - new Date(transaction.createdAt).getTime()) / (1000 * 60 * 60))}h
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
