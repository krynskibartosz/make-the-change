interface IUCNWidgetProps {
  conservationStatus: string
}

const iucnConfig: Record<string, { label: string; color: string }> = {
  CR: { label: 'En danger critique', color: 'bg-red-500' },
  EN: { label: 'En danger', color: 'bg-orange-500' },
  VU: { label: 'Vulnérable', color: 'bg-yellow-500' },
  NT: { label: 'Quasi menacé', color: 'bg-blue-500' },
  LC: { label: 'Préoccupation mineure', color: 'bg-emerald-500' },
  DD: { label: 'Données scientifiques limitées', color: 'bg-gray-500' },
}

export function IUCNWidget({ conservationStatus }: IUCNWidgetProps) {
  const status = iucnConfig[conservationStatus] || { label: conservationStatus, color: 'bg-gray-500' }

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className={`h-4 w-4 rounded-full ${status.color}`} />
        <span className="text-sm font-bold text-white">{conservationStatus}</span>
      </div>
      <p className="mt-2 text-xs text-white/70">{status.label}</p>
    </div>
  )
}
