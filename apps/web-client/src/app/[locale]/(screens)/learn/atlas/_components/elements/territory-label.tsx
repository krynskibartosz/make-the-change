import { motion } from 'framer-motion'
import type { AtlasTerritoryConfig } from '@/lib/learning/schema'

const TERRITORY_LABEL_VARIANTS = {
  normal: { opacity: 1, scale: 1 },
  selected: { opacity: 0, scale: 0.86 },
  dimmed: { opacity: 0.16, scale: 1 },
} as const

export function TerritoryLabel({
  territory,
  selected,
  dimmed,
  onSelect,
}: {
  territory: AtlasTerritoryConfig
  selected: boolean
  dimmed: boolean
  onSelect: () => void
}) {
  const variant = dimmed ? 'dimmed' : selected ? 'selected' : 'normal'

  return (
    <motion.button
      type="button"
      aria-label={`Explorer ${territory.domain.title}`}
      onClick={onSelect}
      initial={false}
      variants={TERRITORY_LABEL_VARIANTS}
      animate={variant}
      transition={{ duration: 0.24 }}
      className="absolute z-20 min-h-12 -translate-x-1/2 -translate-y-1/2 rounded-[0.68rem] px-5 py-2.5 text-[1.18rem] font-black leading-tight text-white shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_34px_rgba(0,0,0,0.24)] transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:pointer-events-none md:text-[1.28rem]"
      disabled={selected}
      style={{
        left: `${territory.x}%`,
        top: `${territory.y}%`,
        backgroundColor: territory.color,
        color: territory.textColor,
      }}
    >
      {territory.label}
    </motion.button>
  )
}
