import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Lock,
  Package,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getFactionTheme,
  resolveFactionThemeKey,
  type FactionTheme,
} from "@/lib/faction-theme";
import type { Faction } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

export type AdventureQuestCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  reward: number;
  progress: number;
  max: number;
  type: "education" | "social" | "daily_harvest";
  cta: string;
};

export type AdventureProjectCard = {
  name: string;
  description: string;
  href: string;
  location: string;
  imageUrl: string | null;
  fundingProgress: number;
  typeLabel: string;
  speciesName: string | null;
};

export type AdventureSpeciesCard = {
  name: string;
  scientificName: string | null;
  imageUrl: string | null;
  conservationStatus: string | null;
  isUnlocked: boolean;
  href: string;
};

export type AdventureTabProps = {
  displayName: string | null;
  faction: Faction | null;
  dayLabel: string;
  monthlyObjective: string;
  monthlyProgress: number;
  monthlyMax: number;
  primaryQuest: AdventureQuestCard | null;
  quests: AdventureQuestCard[];
  recommendedProject: AdventureProjectCard | null;
  featuredSpecies: AdventureSpeciesCard | null;
  collectiveProgress: number;
  impactPoints: number;
};

type FactionPresentation = {
  label: string;
  mascotName: string;
  mascotImage: string;
  headline: string;
  message: string;
};

const FACTION_PRESENTATION: Record<
  ReturnType<typeof resolveFactionThemeKey>,
  FactionPresentation
> = {
  neutral: {
    label: "Exploration libre",
    mascotName: "Melli",
    mascotImage: "/abeille-transparente.png",
    headline: "Choisis ton prochain pas pour le vivant.",
    message: "Apprends, soutiens un projet concret et fais grandir ton impact.",
  },
  pollinisateurs: {
    label: "Vie Sauvage",
    mascotName: "Melli",
    mascotImage: "/abeille-transparente.png",
    headline: "Melli a repere une action utile pour aujourd'hui.",
    message:
      "Fais avancer les pollinisateurs sans perdre le fil de ton impact.",
  },
  forets: {
    label: "Terres et Forets",
    mascotName: "Sylva",
    mascotImage: "/sylva.png",
    headline: "Sylva t'ouvre un chemin court et concret.",
    message:
      "Un apprentissage, un projet, une espece: garde le vivant visible.",
  },
  mers: {
    label: "Gardiens des mers",
    mascotName: "Ondine",
    mascotImage: "/ondine.png",
    headline: "Ondine garde le cap sur ton impact du jour.",
    message:
      "Explore, comprends et soutiens les ecosystemes qui en ont besoin.",
  },
};

const QUEST_ICONS: Record<AdventureQuestCard["type"], LucideIcon> = {
  education: BookOpen,
  social: UsersRound,
  daily_harvest: Sparkles,
};

export function AdventureTab({
  displayName,
  faction,
  dayLabel,
  monthlyObjective,
  monthlyProgress,
  monthlyMax,
  primaryQuest,
  quests,
  recommendedProject,
  featuredSpecies,
  collectiveProgress,
  impactPoints,
}: AdventureTabProps) {
  const themeKey = resolveFactionThemeKey(faction);
  const presentation = FACTION_PRESENTATION[themeKey];
  const theme = getFactionTheme(faction);
  const firstName = displayName?.split(" ")[0] || "Explorateur";
  const primaryIcon = primaryQuest ? QUEST_ICONS[primaryQuest.type] : Compass;
  const PrimaryIcon = primaryIcon;

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 md:pb-10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-gradient-to-b from-white/[0.03] to-[#0B0F15]"
      />
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-[-10%] z-[-1] h-[500px] w-[120%] -translate-x-1/2 rounded-full blur-[100px] opacity-15",
          theme.accentGlow,
        )}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col pb-8 pt-2">
        
        {/* Zone 1 : La Fenêtre d'Impact (Hero & Conversion) */}
        <div className="mb-10 flex flex-col">
          <div className="px-5 pb-5">
            <h1 className="text-[26px] font-black tracking-tight text-white">Salut {firstName} ! 👋</h1>
            <p className="mt-1 text-sm font-medium text-white/60 leading-relaxed">
              L'espèce <strong className="text-white">{featuredSpecies?.name || 'emblématique'}</strong> a besoin de la faction <strong className={cn(theme.accentText)}>{presentation.label}</strong> aujourd'hui.
            </p>
          </div>

          <div className="px-4 relative">
            <div className="relative overflow-hidden rounded-[24px] bg-[#15151A] border border-white/5 h-44">
              <div className="absolute inset-0 grid grid-cols-2">
                <div className="relative bg-[#080b0f]">
                  {featuredSpecies?.imageUrl && (
                    <img src={featuredSpecies.imageUrl} alt="" className={cn("w-full h-full object-cover", !featuredSpecies.isUnlocked && "grayscale opacity-30")} />
                  )}
                  {!featuredSpecies?.isUnlocked && (
                    <div className="absolute top-3 left-3 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                      <Lock className="w-3.5 h-3.5 text-white/70" />
                    </div>
                  )}
                </div>
                <div className="relative">
                  {recommendedProject?.imageUrl && (
                    <img src={recommendedProject.imageUrl} alt="" className="w-full h-full object-cover opacity-90" />
                  )}
                </div>
              </div>

              <div className="absolute inset-y-0 left-1/2 -ml-6 w-12 bg-gradient-to-r from-[#080b0f] via-[#080b0f]/50 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                <p className="text-sm font-black text-white truncate drop-shadow-md">{recommendedProject?.name || 'Projet de restauration'}</p>
              </div>
            </div>

            <div className="relative z-20 -mt-6 flex justify-center px-4">
              <Link
                href={recommendedProject?.href || '/projects'}
                className="flex w-full h-14 items-center justify-center rounded-[20px] bg-lime-400 text-[#0B0F15] text-[17px] font-black shadow-[0_10px_30px_rgba(163,230,53,0.2)] active:scale-95 transition-transform"
              >
                Soutenir & Débloquer
              </Link>
            </div>
          </div>
        </div>

        {/* Zone 2 : Le Focus du Jour */}
        <div className="px-4 mb-10">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40 mb-3 ml-1">
            Ta contribution gratuite
          </h2>
          {primaryQuest ? (
            primaryQuest.progress < primaryQuest.max ? (
              <Link href={primaryQuest.href} className="flex items-center justify-between bg-[#15151A] rounded-[20px] p-4 border border-white/5 active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5", theme.accentText)}>
                    <PrimaryIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 pr-2">
                    <p className="text-[15px] font-bold text-white truncate">{primaryQuest.title}</p>
                    <p className="text-xs text-white/50 line-clamp-1">{primaryQuest.description}</p>
                  </div>
                </div>
                <div className={cn("text-[13px] font-bold whitespace-nowrap bg-transparent flex items-center gap-1", theme.accentText)}>
                  +{primaryQuest.reward} <Sprout className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{primaryQuest.cta}</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between bg-[#15151A] rounded-[20px] p-4 border border-lime-400/20">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400/10">
                    <CheckCircle2 className="h-5 w-5 text-lime-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-white/60 line-through truncate">{primaryQuest.title}</p>
                  </div>
                </div>
                <div className="text-[13px] font-bold text-lime-400">
                  ✅ Fait ! À demain.
                </div>
              </div>
            )
          ) : (
             <div className="bg-[#15151A] rounded-[20px] p-4 border border-white/5 text-sm text-white/50">
               Aucune quête pour aujourd'hui.
             </div>
          )}
        </div>

        {/* Zone 3 : L'Écosystème */}
        <div className="px-4">
          <ul className="rounded-[24px] bg-[#15151A] border border-white/5 divide-y divide-white/5">
            <li>
              <Link href="/challenges" className="flex items-center justify-between p-5 active:bg-white/[0.02] transition-colors rounded-t-[24px]">
                <div className="flex items-center gap-3.5">
                  <BookOpen className="w-5 h-5 text-white/50" />
                  <span className="text-[15px] font-semibold text-white/90">Academy & Défis</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </Link>
            </li>
            <li>
              <Link href="/profile/biodex" className="flex items-center justify-between p-5 active:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3.5">
                  <PawPrint className="w-5 h-5 text-white/50" />
                  <span className="text-[15px] font-semibold text-white/90">Ton BioDex</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/40 tabular-nums">
                    {featuredSpecies?.isUnlocked ? 'Espèce suivie' : 'À débloquer'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </div>
              </Link>
            </li>
            <li>
              <Link href="/impact" className="flex items-center justify-between p-5 active:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-white/50" />
                  <span className="text-[15px] font-semibold text-white/90">Objectif de Faction</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-white/60 tabular-nums">{Math.round(collectiveProgress)}%</span>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </div>
              </Link>
            </li>
            <li>
              <Link href="/products" className="flex items-center justify-between p-5 active:bg-white/[0.02] transition-colors rounded-b-[24px]">
                <div className="flex items-center gap-3.5">
                  <Package className="w-5 h-5 text-white/50" />
                  <span className="text-[15px] font-semibold text-white/90">Avantages disponibles</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}
