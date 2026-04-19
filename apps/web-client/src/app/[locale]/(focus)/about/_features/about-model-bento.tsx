import type { AboutModelBlock, AboutModelProps } from './about.types'

function GamificationCard({ title, description }: AboutModelBlock) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.05] bg-gradient-to-b from-white/[0.04] to-transparent p-8">
      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
      {/* Watermark */}
      <div className="absolute right-6 top-4 text-6xl font-black italic text-white/[0.03]">
        01
      </div>
      {/* Content */}
      <h3 className="relative z-10 mb-3 text-lg font-bold text-white">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-relaxed text-gray-400">{description}</p>
    </article>
  )
}

function CircularCard({ title, description }: AboutModelBlock) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.05] bg-gradient-to-b from-white/[0.04] to-transparent p-8">
      {/* Glow */}
      <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />
      {/* Watermark */}
      <div className="absolute right-6 top-4 text-6xl font-black italic text-white/[0.03]">
        02
      </div>
      {/* Content */}
      <h3 className="relative z-10 mb-3 text-lg font-bold text-white">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-relaxed text-gray-400">{description}</p>
    </article>
  )
}

function TransparencyCard({ title, description }: AboutModelBlock) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/[0.05] bg-gradient-to-b from-white/[0.04] to-transparent p-8">
      {/* Glow */}
      <div className="absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      {/* Watermark */}
      <div className="absolute right-6 top-4 text-6xl font-black italic text-white/[0.03]">
        03
      </div>
      {/* Content */}
      <h3 className="relative z-10 mb-3 text-lg font-bold text-white">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-relaxed text-gray-400">{description}</p>
    </article>
  )
}

export function AboutModelBento({ overline, gamification, circular, transparency }: AboutModelProps) {
  return (
    <section className="py-16 sm:py-20">
      <h2 className="mb-10 px-6 text-center text-sm font-bold uppercase tracking-widest text-amber-500">
        {overline}
      </h2>
      <div className="flex flex-col gap-6 px-6">
        <GamificationCard {...gamification} />
        <CircularCard {...circular} />
        <TransparencyCard {...transparency} />
      </div>
    </section>
  )
}
