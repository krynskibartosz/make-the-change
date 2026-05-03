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
  UsersRound,
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

        {/* Zone 1 : En-tête (Bonjour organique) */}
        <div className="px-6 pb-6">
          <h1 className="text-[28px] font-extrabold tracking-tight text-white leading-tight">
            Salut {firstName} ! <span className="align-middle">👋</span>
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[#A1A1A6]">
            L'{featuredSpecies?.name || 'espèce emblématique'} a besoin de {presentation.mascotName} et toi aujourd'hui.
          </p>
        </div>

        {/* Zone 2 : Carte conversion (visuel fusionné + CTA lime) */}
        <div className="px-6 mb-10">
          <Link
            href={recommendedProject?.href || '/projects'}
            className="group block relative overflow-hidden rounded-[32px] bg-[#15151A] h-[380px] active:scale-[0.99] transition-transform"
          >
            {/* Photo projet en background plein cadre */}
            {recommendedProject?.imageUrl ? (
              <img
                src={recommendedProject.imageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2a] to-[#0B0F15]" />
            )}

            {/* Dégradé noir profond bottom -> top pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-50% to-transparent pointer-events-none" />

            {/* Espèce détourée superposée (émotion) */}
            {featuredSpecies?.imageUrl && (
              <img
                src={featuredSpecies.imageUrl}
                alt={featuredSpecies.name}
                className={cn(
                  "absolute left-[-4%] bottom-[28%] w-[62%] max-w-[320px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] pointer-events-none",
                  !featuredSpecies.isUnlocked && "grayscale opacity-60",
                )}
              />
            )}

            {!featuredSpecies?.isUnlocked && featuredSpecies && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3 text-white/70" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">À débloquer</span>
              </div>
            )}

            {/* Contenu bas (sur partie sombre) */}
            <div className="absolute bottom-0 inset-x-0 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 mb-2">
                📍 {recommendedProject?.location || 'Terrain partenaire'}{featuredSpecies?.conservationStatus ? ' • Espèce protégée' : ''}
              </p>
              <h2 className="text-[20px] font-bold text-white leading-tight mb-4">
                {recommendedProject?.name || 'Projet de restauration'}
              </h2>
              <div
                className="flex w-full h-14 items-center justify-center rounded-[16px] bg-lime-400 text-black text-[16px] font-bold shadow-[0_10px_30px_rgba(163,230,53,0.25)] group-active:scale-[0.98] transition-transform"
              >
                Soutenir & Débloquer
              </div>
            </div>
          </Link>
        </div>

        {/* Zone 3 : Contribution gratuite (Finch-card) */}
        <div className="px-6 mb-10">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 mb-3 ml-1">
            Ta contribution gratuite
          </h2>
          {primaryQuest ? (
            primaryQuest.progress < primaryQuest.max ? (
              <Link
                href={primaryQuest.href}
                className="flex items-center justify-between gap-3 bg-[#1C1C1E] rounded-[24px] p-4 active:scale-[0.98] transition-transform"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2C2C2E]">
                    <PrimaryIcon className="h-5 w-5 text-white" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-white truncate">{primaryQuest.title}</p>
                    <p className="text-xs text-[#A1A1A6] line-clamp-1 mt-0.5">{primaryQuest.description}</p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 h-9 rounded-full bg-white/5 px-3 text-[13px] font-bold text-lime-400 tabular-nums">
                  +{primaryQuest.reward} <Sprout className="w-3.5 h-3.5" />
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between gap-3 bg-[#1C1C1E] rounded-[24px] p-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2C2C2E]">
                    <CheckCircle2 className="h-5 w-5 text-lime-400" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-white/50 line-through truncate">{primaryQuest.title}</p>
                    <p className="text-xs text-[#A1A1A6] mt-0.5">Fait ! À demain.</p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center h-9 rounded-full bg-white/5 px-3 text-[13px] font-bold text-lime-400">
                  ✓
                </div>
              </div>
            )
          ) : (
            <div className="bg-[#1C1C1E] rounded-[24px] p-4 text-sm text-[#A1A1A6]">
              Aucune quête pour aujourd'hui.
            </div>
          )}
        </div>

        {/* Zone 4 : Menu système (touche Apple) */}
        <div className="px-6">
          <div className="rounded-[24px] bg-[#1C1C1E] overflow-hidden">
            <Link href="/challenges" className="flex items-center justify-between py-4 pl-5 pr-5 active:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <BookOpen className="w-5 h-5 shrink-0 text-[#8E8E93]" strokeWidth={1.75} />
                <span className="text-[15px] font-semibold text-white truncate">Academy & Défis</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 text-[#8E8E93]" />
            </Link>

            <div className="ml-[52px] h-px bg-[#333333]" />

            <Link href="/profile/biodex" className="flex items-center justify-between py-4 pl-5 pr-5 active:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <PawPrint className="w-5 h-5 shrink-0 text-[#8E8E93]" strokeWidth={1.75} />
                <span className="text-[15px] font-semibold text-white truncate">Ton BioDex</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[13px] font-medium text-[#8E8E93] tabular-nums">
                  {featuredSpecies?.isUnlocked ? 'Suivi' : 'À débloquer'}
                </span>
                <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
              </div>
            </Link>

            <div className="ml-[52px] h-px bg-[#333333]" />

            <Link href="/impact" className="flex items-center justify-between py-4 pl-5 pr-5 active:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#8E8E93]" strokeWidth={1.75} />
                <span className="text-[15px] font-semibold text-white truncate">Objectif de Faction</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[13px] font-medium text-[#8E8E93] tabular-nums">{Math.round(collectiveProgress)}%</span>
                <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
              </div>
            </Link>

            <div className="ml-[52px] h-px bg-[#333333]" />

            <Link href="/products" className="flex items-center justify-between py-4 pl-5 pr-5 active:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <Package className="w-5 h-5 shrink-0 text-[#8E8E93]" strokeWidth={1.75} />
                <span className="text-[15px] font-semibold text-white truncate">Avantages disponibles</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 text-[#8E8E93]" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
