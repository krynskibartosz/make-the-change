import { Compass, Sparkles, Sprout } from "lucide-react";
import { Link } from "@/i18n/navigation";

type AdventureTabHeaderProps = {
  seeds: number;
  impactPoints: number;
};

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);

export function AdventureTabHeader({
  seeds,
  impactPoints,
}: AdventureTabHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Compass className="h-4.5 w-4.5 text-lime-300" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-black leading-none tracking-tight text-white">
            Aventure
          </p>
          <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-white/38">
            Aujourd&apos;hui
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/profile/seeds"
          prefetch={false}
          aria-label={`${seeds} graines`}
          className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 transition-colors active:bg-white/10"
        >
          <Sprout className="h-3.5 w-3.5 text-lime-300" />
          <span className="text-[11px] font-black tabular-nums text-white">
            {formatCompactNumber(seeds)}
          </span>
        </Link>
        <Link
          href="/products"
          prefetch={false}
          aria-label={`${impactPoints} points d'impact`}
          className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 transition-colors active:bg-white/10"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="text-[11px] font-black tabular-nums text-white">
            {formatCompactNumber(impactPoints)}
          </span>
        </Link>
      </div>
    </div>
  );
}
