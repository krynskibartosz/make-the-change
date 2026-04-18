import { Globe, Sprout, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AboutPillarEntry, AboutPillarsProps } from './about.types'

type PillarRowProps = {
  entry: AboutPillarEntry
  icon: ReactNode
  accentClassName: string
  glowClassName: string
}

function PillarRow({ entry, icon, accentClassName, glowClassName }: PillarRowProps) {
  return (
    <li className="relative pl-10">
      <span
        className={`absolute left-0 top-0.5 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0D1117] ring-1 ring-white/5 ${accentClassName} ${glowClassName}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="text-xl font-bold tracking-tight text-white">{entry.title}</h3>
      <p className="mt-2 text-sm font-light leading-relaxed text-gray-400">{entry.description}</p>
    </li>
  )
}

export function AboutPillarsTimeline({
  overline,
  engagement,
  swarm,
  impact,
}: AboutPillarsProps) {
  return (
    <section className="relative px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-xl">
        <span className="mb-12 block text-[11px] font-semibold uppercase tracking-[0.4em] text-amber-400/90">
          {overline}
        </span>

        <ol className="relative space-y-10 pl-6">
          {/* Gradient timeline line: centered on icon (li pl-10 = 40px, icon center = 40px - 18px = 22px from ol edge) */}
          <span
            aria-hidden="true"
            className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-400/60 via-amber-300/30 to-sky-400/40"
          />
          <PillarRow
            entry={engagement}
            icon={<Sprout className="h-4 w-4" />}
            accentClassName="text-emerald-400"
            glowClassName="shadow-[0_0_18px_rgba(52,211,153,0.45)]"
          />
          <PillarRow
            entry={swarm}
            icon={<Users className="h-4 w-4" />}
            accentClassName="text-amber-300"
            glowClassName="shadow-[0_0_18px_rgba(252,211,77,0.45)]"
          />
          <PillarRow
            entry={impact}
            icon={<Globe className="h-4 w-4" />}
            accentClassName="text-sky-400"
            glowClassName="shadow-[0_0_18px_rgba(56,189,248,0.45)]"
          />
        </ol>
      </div>
    </section>
  )
}
