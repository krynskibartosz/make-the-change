import type { AboutModelBlock, AboutModelProps } from './about.types'

function GamificationCard({ title, description }: AboutModelBlock) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent p-8">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-[50px] z-0" />
      {/* Watermark */}
      <div className="pointer-events-none absolute -bottom-6 -right-2 text-[120px] font-black italic leading-none text-white/[0.03] z-0">
        01
      </div>
      {/* Content */}
      <h3 className="relative z-10 mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-[1.8] text-gray-400">{description}</p>
    </article>
  )
}

function CircularCard({ title, description }: AboutModelBlock) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent p-8">
      {/* Glow */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-amber-500/20 blur-[50px] z-0" />
      {/* Watermark */}
      <div className="pointer-events-none absolute -bottom-6 -right-2 text-[120px] font-black italic leading-none text-white/[0.03] z-0">
        02
      </div>
      {/* Content */}
      <h3 className="relative z-10 mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-[1.8] text-gray-400">{description}</p>
    </article>
  )
}

function TransparencyCard({ title, description }: AboutModelBlock) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent p-8">
      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-16 h-56 w-56 rounded-full bg-blue-500/20 blur-[50px] z-0" />
      {/* Watermark */}
      <div className="pointer-events-none absolute -bottom-6 -right-2 text-[120px] font-black italic leading-none text-white/[0.03] z-0">
        03
      </div>
      {/* Content */}
      <h3 className="relative z-10 mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-[1.8] text-gray-400">{description}</p>
    </article>
  )
}

export function AboutModelBento({ overline, gamification, circular, transparency }: AboutModelProps) {
  return (
    <section className="mt-12 py-16 sm:py-20">
      <div className="mb-8 flex flex-col items-start px-8">
        <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">
          Notre Modèle
        </span>
        <h2 className="text-3xl font-bold text-white tracking-tight">Un cercle vertueux.</h2>
      </div>
      <div className="flex flex-col gap-6 px-6">
        <GamificationCard {...gamification} />
        <CircularCard {...circular} />
        <TransparencyCard {...transparency} />
      </div>
    </section>
  )
}
