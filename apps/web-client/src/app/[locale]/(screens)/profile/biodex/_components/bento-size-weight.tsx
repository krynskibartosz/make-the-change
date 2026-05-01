import { Ruler, Scale } from 'lucide-react'

interface SizeWeightWidgetProps {
  size?: string | null
  weight?: string | null
}

export function SizeWeightWidget({ size, weight }: SizeWeightWidgetProps) {
  const displayValue = size && weight ? `${size} / ${weight}` : 'Non spécifié'

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
          <Ruler className="h-5 w-5 text-emerald-400" />
        </div>
        <Scale className="h-4 w-4 text-emerald-400" />
      </div>
      <p className="mt-2 text-sm font-bold text-white">{displayValue}</p>
      <p className="text-xs text-white/50">Taille / Poids</p>
    </div>
  )
}
