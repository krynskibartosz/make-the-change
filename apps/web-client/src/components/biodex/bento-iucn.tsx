import { Sprout } from 'lucide-react'

interface IUCNWidgetProps {
  conservationStatus: string
}

const iucnConfig: Record<string, { label: string; color: string; bonus: string }> = {
  CR: { label: 'En danger critique', color: 'bg-red-500', bonus: '+50%' },
  EN: { label: 'En danger', color: 'bg-orange-500', bonus: '+40%' },
  VU: { label: 'Vulnérable', color: 'bg-yellow-500', bonus: '+30%' },
  NT: { label: 'Quasi menacé', color: 'bg-blue-500', bonus: '+25%' },
  LC: { label: 'Préoccupation mineure', color: 'bg-emerald-500', bonus: '+15%' },
  DD: { label: 'Données insuffisantes', color: 'bg-gray-500', bonus: '+10%' },
}

export function IUCNWidget({ conservationStatus }: IUCNWidgetProps) {
  const status = iucnConfig[conservationStatus] || { label: conservationStatus, color: 'bg-gray-500', bonus: '+0%' }

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-4 w-4 rounded-full ${status.color}`} />
          <span className="text-sm font-bold text-white">{conservationStatus}</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-white/70">{status.label}</p>
      <div className="mt-3 flex items-center gap-1.5 rounded-full bg-lime-500/10 px-2 py-1">
        <Sprout className="h-3 w-3 text-lime-400" />
        <span className="text-xs font-bold text-lime-400">Bonus Récolte : {status.bonus} Graines🌱</span>
      </div>
    </div>
  )
}
