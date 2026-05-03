interface ThreatTagsProps {
  threats: string[]
}

export function ThreatTags({ threats }: ThreatTagsProps) {
  return (
    <div className="mx-5">
      <h3 className="mb-3 font-bold text-white">Les Défis de son Monde</h3>
      <div className="flex flex-wrap gap-2">
        {threats.map((threat, index) => (
          <div
            key={index}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm"
          >
            {threat}
          </div>
        ))}
      </div>
    </div>
  )
}
