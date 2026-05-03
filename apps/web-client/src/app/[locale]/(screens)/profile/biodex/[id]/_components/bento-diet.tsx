import { Bug, Leaf, Beef } from 'lucide-react'

interface DietWidgetProps {
  diet?: string | null
}

const dietIcons: Record<string, React.ReactNode> = {
  Insectivore: <Bug className="h-5 w-5 text-emerald-400" />,
  Herbivore: <Leaf className="h-5 w-5 text-emerald-400" />,
  Carnivore: <Beef className="h-5 w-5 text-emerald-400" />,
  Omnivore: <Leaf className="h-5 w-5 text-emerald-400" />,
}

export function DietWidget({ diet }: DietWidgetProps) {
  const icon = diet ? dietIcons[diet] || <Bug className="h-5 w-5 text-emerald-400" /> : <Bug className="h-5 w-5 text-emerald-400" />
  const displayValue = diet || 'Régime inconnu'

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500/20">
          {icon}
        </div>
      </div>
      <p className="mt-2 text-sm font-bold text-white">{displayValue}</p>
      <p className="text-xs text-white/50">Régime</p>
    </div>
  )
}
