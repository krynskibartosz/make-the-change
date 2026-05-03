import { Globe } from 'lucide-react'

interface OriginWidgetProps {
  originCountry?: string | null
}

const countryFlags: Record<string, string> = {
  Madagascar: '🇲🇬',
  France: '🇫🇷',
  Belgium: '🇧🇪',
  Sardinia: '🇮🇹',
}

export function OriginWidget({ originCountry }: OriginWidgetProps) {
  const flag = originCountry ? countryFlags[originCountry] || '🌍' : '🌍'
  const displayValue = originCountry || 'Origine inconnue'

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
          <Globe className="h-5 w-5 text-blue-400" />
        </div>
        <span className="text-2xl">{flag}</span>
      </div>
      <p className="mt-2 text-sm font-bold text-white">{displayValue}</p>
      <p className="text-xs text-white/50">Origine</p>
    </div>
  )
}
