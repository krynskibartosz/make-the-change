import type { AboutGenesisProps } from './about.types'

export function AboutGenesis({ title, paragraph1, paragraph2 }: AboutGenesisProps) {
  return (
    <section className="mx-auto max-w-xl px-8 py-24 flex flex-col items-start">
      {/* Micro-badge with soft pill and glowing dot */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        ORIGINES
      </div>

      {/* Title */}
      <h2 className="mb-8 text-left text-3xl font-bold text-white tracking-tight leading-[1.1] text-balance md:text-4xl">{title}</h2>

      {/* Text architecture with gradient line */}
      <div className="relative flex flex-col gap-6 pl-8">
        {/* Gradient line */}
        <div className="absolute left-0 top-1 bottom-1 h-[calc(100%-8px)] w-[2px] rounded-full bg-gradient-to-b from-emerald-500/50 via-white/10 to-transparent" />

        {/* Paragraph 1 */}
        <p className="text-base font-light leading-[1.8] text-gray-300">
          {paragraph1}
        </p>

        {/* Paragraph 2 with highlighted words */}
        <p className="text-base font-light leading-[1.8] text-gray-300">
          Après plusieurs années de recherche, de prototypes inachevés et de voyages pour comprendre les réalités du terrain (de la Belgique jusqu'à Madagascar), une évidence s'est imposée. Pour sauver la biodiversité, il fallait utiliser les codes de notre génération : le{' '}
          <span className="font-medium text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">jeu</span>, la{' '}
          <span className="font-medium text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">technologie</span> et la{' '}
          <span className="font-medium text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">transparence</span>.
        </p>
      </div>
    </section>
  )
}
