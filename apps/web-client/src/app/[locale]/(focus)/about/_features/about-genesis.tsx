import type { AboutGenesisProps } from './about.types'

export function AboutGenesis({ title, paragraph1, paragraph2 }: AboutGenesisProps) {
  return (
    <section className="mx-auto max-w-xl px-8 py-24 flex flex-col items-start">
      {/* Micro-badge */}
      <span className="mb-5 rounded-full border border-emerald-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
        ORIGINES
      </span>

      {/* Title */}
      <h2 className="mb-8 text-left text-3xl font-bold text-white leading-tight">{title}</h2>

      {/* Text architecture with left border */}
      <div className="flex flex-col gap-4 border-l border-white/10 pl-6">
        <p className="text-base font-light leading-relaxed text-gray-400">
          {paragraph1}
        </p>
        <p className="text-base font-light leading-relaxed text-gray-400">
          Après plusieurs années de recherche, de prototypes inachevés et de voyages pour comprendre les réalités du terrain (de la Belgique jusqu'à Madagascar), une évidence s'est imposée. Pour sauver la biodiversité, il fallait utiliser les codes de notre génération : le{' '}
          <span className="font-medium text-white">jeu</span>, la{' '}
          <span className="font-medium text-white">technologie</span> et la{' '}
          <span className="font-medium text-white">transparence</span>.
        </p>
      </div>
    </section>
  )
}
