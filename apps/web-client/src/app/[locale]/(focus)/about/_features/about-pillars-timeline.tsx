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
    <li className="relative pl-12">
      <span
        className={`absolute left-0 top-1 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0D1117] ${accentClassName} ${glowClassName}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="text-2xl font-bold tracking-tight text-white">{entry.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-gray-300">{entry.description}</p>
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
        <span className="mb-10 block text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          {overline}
        </span>

        <ol className="relative space-y-14 border-l border-white/10 pl-6">
          <PillarRow
            entry={engagement}
            icon={<Sprout className="h-5 w-5" />}
            accentClassName="text-emerald-400"
            glowClassName="shadow-[0_0_18px_rgba(52,211,153,0.45)]"
          />
          <PillarRow
            entry={swarm}
            icon={<Users className="h-5 w-5" />}
            accentClassName="text-amber-300"
            glowClassName="shadow-[0_0_18px_rgba(252,211,77,0.45)]"
          />
          <PillarRow
            entry={impact}
            icon={<Globe className="h-5 w-5" />}
            accentClassName="text-sky-400"
            glowClassName="shadow-[0_0_18px_rgba(56,189,248,0.45)]"
          />
        </ol>
      </div>
    </section>
  )
}
