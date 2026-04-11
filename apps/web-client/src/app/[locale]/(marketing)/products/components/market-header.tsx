import { Sparkles } from 'lucide-react'

interface MarketHeaderProps {
  balance?: number
}

export function MarketHeader({ balance = 2450 }: MarketHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0B0F15]/80 px-5 py-4 backdrop-blur-xl">
      <h1 className="text-2xl font-black tracking-tight text-white">Marché</h1>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 transition-transform active:scale-95"
        aria-label="Solde Points d'Impact"
      >
        <Sparkles className="h-4 w-4 text-lime-400" />
        <span className="tabular-nums text-sm font-bold tracking-wide text-lime-400">
          {balance.toLocaleString('fr-FR')}
        </span>
      </button>
    </header>
  )
}
