import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { AtlasSubdomainConfig } from '@/lib/learning/schema'

const SUBDOMAIN_LABEL_VARIANTS = {
  visible: { opacity: 1, x: '-50%', y: '-50%', scale: 1 },
  hidden: { opacity: 0, x: '-50%', y: 'calc(-50% + 8px)', scale: 0.96 },
} as const

export function SubdomainLabel({
  subdomain,
  visible,
  isDeepZoom,
  onClick,
}: {
  subdomain: AtlasSubdomainConfig
  visible: boolean
  /** When true, the global label fades out to reveal per-cell labels. */
  isDeepZoom: boolean
  onClick?: () => void
}) {
  // At deep zoom, fade the global label to let per-cell course labels show
  const shouldShow = visible && !isDeepZoom

  return (
    <motion.button
      type="button"
      initial={false}
      variants={SUBDOMAIN_LABEL_VARIANTS}
      animate={shouldShow ? 'visible' : 'hidden'}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn(
        'absolute z-30 max-w-[7.4rem] rounded-[0.48rem] px-2.5 py-1.5 text-center text-[0.62rem] font-black leading-tight text-white shadow-[0_7px_0_rgba(0,0,0,0.18),0_14px_28px_rgba(0,0,0,0.2)] active:scale-95 transition-transform duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:max-w-[9rem] md:text-[0.72rem]',
        shouldShow ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none',
      )}
      disabled={!shouldShow}
      style={{
        left: `${subdomain.x}%`,
        top: `${subdomain.y}%`,
        backgroundColor: subdomain.color,
      }}
      onClick={(e) => {
        if (!shouldShow) return
        e.stopPropagation()
        onClick?.()
      }}
    >
      {subdomain.label}
    </motion.button>
  )
}
