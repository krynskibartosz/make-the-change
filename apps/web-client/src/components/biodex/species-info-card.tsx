interface SpeciesInfoCardProps {
  scientificName: string
  conservationStatus: string
}

const iucnConfig: Record<string, { label: string; color: string }> = {
  CR: { label: 'En danger critique', color: 'bg-red-500' },
  EN: { label: 'En danger', color: 'bg-orange-500' },
  VU: { label: 'Vulnérable', color: 'bg-yellow-500' },
  NT: { label: 'Quasi menacé', color: 'bg-blue-500' },
  LC: { label: 'Préoccupation mineure', color: 'bg-emerald-500' },
  DD: { label: 'Données insuffisantes', color: 'bg-gray-500' },
}

export function SpeciesInfoCard({ scientificName, conservationStatus }: SpeciesInfoCardProps) {
  const status = iucnConfig[conservationStatus] || { label: conservationStatus, color: 'bg-gray-500' }

  return (
    <div className="mx-5 rounded-3xl border border-white/5 bg-[#1C1C22] p-5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase text-white/50">Nom scientifique</h3>
          <p className="mt-1 text-sm italic text-white/70">{scientificName}</p>
        </div>
        <div className="ml-4 text-right">
          <h3 className="text-xs font-bold uppercase text-white/50">Statut IUCN</h3>
          <div className="mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1">
            <span className={`h-2 w-2 rounded-full ${status.color}`} />
            <span className="text-sm font-bold text-white">{conservationStatus}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
