import { CurrencyIcon } from "@/components/currency";
import { Link } from "@/i18n/navigation";
import { formatCompact } from "@/lib/formatters";
import { resolveFactionThemeKey } from "@/lib/faction-theme";
import type { Faction } from '@/lib/domain/types'

type AdventureTabHeaderProps = {
  faction: Faction | null;
  seeds: number;
  impactPoints: number;
};

export function AdventureTabHeader({
  faction,
  impactPoints,
}: AdventureTabHeaderProps) {
  const themeKey = resolveFactionThemeKey(faction);
  const mascotImage = themeKey === 'pollinisateurs' ? '/images/mascots/melli.png' : themeKey === 'forets' ? '/images/mascots/sylva.png' : themeKey === 'mers' ? '/images/mascots/ondine.png' : '/images/mascots/melli.png';

  return (
    <div className="flex w-full items-center justify-between gap-3 relative z-50">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 overflow-hidden">
          <img src={mascotImage} alt="Avatar" className="w-full h-full object-contain p-1 drop-shadow-md" />
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/profile"
          prefetch={false}
          aria-label={`${impactPoints} Credits Impact`}
          className="flex h-9 items-center gap-1.5 rounded-full border border-white/5 bg-black/40 backdrop-blur-md px-3 transition-colors active:bg-white/10 shadow-sm"
        >
          <CurrencyIcon kind="impactCredits" className="h-3.5 w-3.5" />
          <span className="text-[12px] font-black tabular-nums text-white">
            {formatCompact(impactPoints)}
          </span>
        </Link>
      </div>
    </div>
  );
}
