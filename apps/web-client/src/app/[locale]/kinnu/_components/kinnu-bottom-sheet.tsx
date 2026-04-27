'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Anchor,
  Bug,
  Fish,
  Flower2,
  HandHeart,
  Mountain,
  PawPrint,
  Skull,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@make-the-change/core/ui'
import { type KinnuNode, type KinnuNodeType } from '@/lib/kinnu/graph'
import { type KinnuNodeStatus, KINNU_SCORE_PER_NODE } from '@/lib/kinnu/bridge'
import { cn } from '@/lib/utils'

const TYPE_ICON: Record<KinnuNodeType, LucideIcon> = {
  base: Mountain,
  flora: Flower2,
  fauna: PawPrint,
  habitat: Anchor,
  project: HandHeart,
  threat: Skull,
}
const NAME_ICON: Record<string, LucideIcon> = {
  'Abeille noire': Bug,
  'Bourdon terrestre': Bug,
  'Osmie rousse': Bug,
  Mégachile: Bug,
  'Syrphe ceinturé': Bug,
  Acropora: Fish,
  'Poisson clown': Fish,
  'Demoiselle bleue': Fish,
  Coccinelle: Bug,
}

const RELATION_LABEL: Record<string, string> = {
  nourrit: 'nourrit',
  symbiose: 'symbiose',
  habitat: 'habitat',
  proie: 'est proie de',
  protege: 'protège',
  menace: 'menace',
}

type KinnuBottomSheetProps = {
  node: KinnuNode | null
  status: KinnuNodeStatus | null
  onMaster: (nodeId: string) => void
  onClose: () => void
}

export function KinnuBottomSheet({ node, status, onMaster, onClose }: KinnuBottomSheetProps) {
  const Icon = node ? (NAME_ICON[node.name] ?? TYPE_ICON[node.type]) : Mountain
  const isMastered = status === 'mastered'

  return (
    <AnimatePresence>
      {node && status && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.aside
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-xl overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#08080F]/95 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-md',
                    isMastered
                      ? 'border-amber-200/30 bg-amber-300/15 text-amber-100'
                      : node.type === 'threat'
                        ? 'border-red-200/25 bg-red-400/10 text-red-100'
                        : 'border-emerald-200/30 bg-emerald-300/15 text-emerald-100',
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/35">
                    {node.type === 'threat'
                      ? 'Menace'
                      : node.type === 'project'
                        ? 'Projet'
                        : node.type === 'habitat'
                          ? 'Habitat'
                          : node.type === 'flora'
                            ? 'Flore'
                            : node.type === 'base'
                              ? 'Base'
                              : 'Faune'}
                  </p>
                  <h2 className="mt-1 text-xl font-black leading-tight text-white">{node.name}</h2>
                  {isMastered && (
                    <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-amber-300">
                      ✦ Concept maîtrisé
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-white/65">{node.summary}</p>

              {/* Prérequis */}
              {node.requires.length > 0 && !isMastered && (
                <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/35">
                    Débloqué grâce à
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {node.requires.map((req) => (
                      <span
                        key={req}
                        className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2.5 py-1 text-[0.6rem] font-black text-emerald-100"
                      >
                        ✦ {req.split('-')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Récompense */}
              {!isMastered && (
                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-lime-200/15 bg-lime-300/[0.06] px-4 py-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-lime-300" />
                  <p className="text-sm font-black text-lime-200">
                    +{KINNU_SCORE_PER_NODE} points Knowledge Bank
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-5">
                {isMastered ? (
                  <Button
                    type="button"
                    variant="glass"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 font-black text-white"
                    onClick={onClose}
                    shimmer={false}
                  >
                    Fermer
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="h-14 w-full rounded-2xl bg-emerald-400 font-black text-[#05050A] hover:bg-emerald-300"
                    onClick={() => onMaster(node.id)}
                  >
                    ✦ Maîtriser ce concept
                  </Button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
