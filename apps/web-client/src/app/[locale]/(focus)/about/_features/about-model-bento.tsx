import type { AboutModelBlock, AboutModelProps } from './about.types'

function ModelCard({ title, description }: AboutModelBlock) {
  return (
    <article className="rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-8">
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{description}</p>
    </article>
  )
}

export function AboutModelBento({ overline, gamification, circular, transparency }: AboutModelProps) {
  return (
    <section className="py-16 sm:py-20">
      <h2 className="mb-10 px-6 text-center text-sm font-bold uppercase tracking-widest text-amber-500">
        {overline}
      </h2>
      <div className="flex flex-col gap-4 px-6">
        <ModelCard {...gamification} />
        <ModelCard {...circular} />
        <ModelCard {...transparency} />
      </div>
    </section>
  )
}
