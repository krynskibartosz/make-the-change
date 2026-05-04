import { CurrencyAmount, getCurrencyDesign } from '@/components/currency'

type MarketHeaderProps = {
  balance?: number
}

export function MarketHeader({ balance = 2450 }: MarketHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0B0F15]/80 px-5 py-4 backdrop-blur-xl">
      <h1 className="text-2xl font-black tracking-tight text-white">Récompenses</h1>
      <button
        type="button"
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-transform active:scale-95 ${getCurrencyDesign('impactCredits').surfaceClassName}`}
        aria-label="Solde Crédits Impact"
      >
        <CurrencyAmount kind="impactCredits" value={balance} className="text-sm font-bold tracking-wide" />
      </button>
    </header>
  )
}
