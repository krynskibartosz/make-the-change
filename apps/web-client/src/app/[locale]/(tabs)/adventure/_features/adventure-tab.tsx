import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Globe2,
  Lock,
  MapPinned,
  Package,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
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

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value);

function SectionTitle({
  icon: Icon,
  title,
  action,
  href,
}: {
  icon: LucideIcon;
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-white/38" />
        <h2 className="truncate text-[12px] font-black uppercase tracking-[0.16em] text-white/48">
          {title}
        </h2>
      </div>
      {action && href ? (
        <Link
          href={href}
          className="shrink-0 text-[11px] font-bold text-white/46 transition-colors active:text-white"
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}

function ProgressBar({
  value,
  max,
  theme,
}: {
  value: number;
  max: number;
  theme: FactionTheme;
}) {
  const ratio = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/8">
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700",
          theme.accentBg,
        )}
        style={{ width: `${ratio}%` }}
      />
    </div>
  );
}

function EmptyProjectCard() {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-white/58">
      Aucun projet recommande pour le moment. Le hub restera pret pour les
      donnees projets des que la source sera disponible.
    </div>
  );
}

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
  const greeting = displayName ? `Bonjour ${firstName}` : "Bonjour";
  const primaryIcon = primaryQuest ? QUEST_ICONS[primaryQuest.type] : Compass;
  const PrimaryIcon = primaryIcon;
  const remainingMonthly = Math.max(monthlyMax - monthlyProgress, 0);

  return (
    <section className="relative isolate w-full overflow-hidden pb-32 md:pb-10">
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-gradient-to-b",
          theme.heroGradient,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute right-[-4rem] top-20 z-[-1] h-48 w-48 rounded-full blur-3xl",
          theme.accentGlow,
        )}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pb-8 pt-4">
        <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="relative z-10 max-w-[68%]">
            <p
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.18em]",
                theme.accentText,
              )}
            >
              {presentation.label}
            </p>
            <h1 className="mt-2 text-[1.72rem] font-black leading-[0.98] tracking-tight text-white">
              {greeting}
            </h1>
            <p className="mt-3 text-sm font-black leading-5 text-white">
              {presentation.headline}
            </p>
            <p className="mt-2 text-sm font-medium leading-5 text-white/68">
              {presentation.message}
            </p>
          </div>

          <div className="absolute bottom-0 right-[-0.8rem] h-40 w-40">
            <img
              src={presentation.mascotImage}
              alt={presentation.mascotName}
              className="h-full w-full object-contain object-bottom drop-shadow-2xl"
            />
          </div>

          <div className="relative z-10 mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/8 bg-black/18 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                Cycle
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {monthlyProgress}/{monthlyMax} jours
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/18 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                Impact
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {formatNumber(impactPoints)} pts
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn("rounded-[1.4rem] border p-4", theme.badgeClassName)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/42">
                Objectif en cours
              </p>
              <h2 className="mt-1 text-base font-black leading-tight text-white">
                {monthlyObjective}
              </h2>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-black text-white/72">
              {remainingMonthly} restants
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar
              value={monthlyProgress}
              max={monthlyMax}
              theme={theme}
            />
          </div>
        </div>

        <div>
          <SectionTitle
            icon={Target}
            title={`Action prioritaire - ${dayLabel}`}
          />
          {primaryQuest ? (
            <Link
              href={primaryQuest.href}
              className="group block rounded-[1.55rem] border border-white/10 bg-white/[0.07] p-4 shadow-[0_14px_44px_rgba(0,0,0,0.22)] transition-transform active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                    theme.accentBgSoft,
                    theme.accentText,
                  )}
                >
                  <PrimaryIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                    A faire maintenant
                  </p>
                  <h3 className="mt-1 text-lg font-black leading-tight text-white">
                    {primaryQuest.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/62">
                    {primaryQuest.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[12px] font-black text-lime-300">
                  +{primaryQuest.reward} <Sprout className="h-3.5 w-3.5" />
                </span>
                <span
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-full px-4 text-sm font-black text-[#07110b]",
                    theme.accentBg,
                  )}
                >
                  {primaryQuest.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-active:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/projects"
              className="block rounded-[1.55rem] border border-white/10 bg-white/[0.06] p-4"
            >
              <h3 className="text-lg font-black leading-tight text-white">
                Choisir un projet a soutenir
              </h3>
              <p className="mt-2 text-sm leading-5 text-white/62">
                Aucun defi actif pour l&apos;instant. Tu peux quand meme faire
                avancer un projet reel.
              </p>
            </Link>
          )}
        </div>

        <div>
          <SectionTitle
            icon={BookOpen}
            title="Academy et defis"
            action="Tout voir"
            href="/challenges"
          />
          <div className="grid gap-2">
            {quests.slice(0, 3).map((quest) => {
              const Icon = QUEST_ICONS[quest.type];
              const complete = quest.progress >= quest.max;

              return (
                <Link
                  key={quest.id}
                  href={quest.href}
                  className="flex min-h-[4.4rem] items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.045] px-3.5 py-3 transition-colors active:bg-white/[0.075]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white/76">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-white">
                        {quest.title}
                      </p>
                      {complete ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-lime-300" />
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-1 text-[12px] text-white/45">
                      {quest.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/26" />
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <SectionTitle
            icon={MapPinned}
            title="Projet recommande"
            action="Explorer"
            href="/projects"
          />
          {recommendedProject ? (
            <Link
              href={recommendedProject.href}
              className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.055] shadow-[0_14px_44px_rgba(0,0,0,0.2)] transition-transform active:scale-[0.99]"
            >
              <div className="relative aspect-[1.9/1] bg-white/6">
                {recommendedProject.imageUrl ? (
                  <img
                    src={recommendedProject.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/22 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded-full border border-white/12 bg-black/32 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/72 backdrop-blur">
                      {recommendedProject.typeLabel}
                    </span>
                    <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight text-white">
                      {recommendedProject.name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-white/45">
                  <Globe2 className="h-3.5 w-3.5" />
                  <span>{recommendedProject.location}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/62">
                  {recommendedProject.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-lime-300"
                        style={{
                          width: `${recommendedProject.fundingProgress}%`,
                        }}
                      />
                    </div>
                    {recommendedProject.speciesName ? (
                      <p className="mt-2 truncate text-[11px] font-semibold text-white/42">
                        Lie a {recommendedProject.speciesName}
                      </p>
                    ) : null}
                  </div>
                  <span className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 text-[12px] font-black text-[#0B0F15]">
                    Soutenir <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <EmptyProjectCard />
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <SectionTitle icon={PawPrint} title="BioDex" />
            {featuredSpecies ? (
              <Link
                href={featuredSpecies.href}
                className="flex min-h-[8.5rem] gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-3.5 transition-colors active:bg-white/[0.075]"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white/6">
                  {featuredSpecies.imageUrl ? (
                    <img
                      src={featuredSpecies.imageUrl}
                      alt=""
                      className={cn(
                        "h-full w-full object-cover",
                        !featuredSpecies.isUnlocked &&
                          "scale-110 blur-[3px] grayscale",
                      )}
                    />
                  ) : null}
                  {!featuredSpecies.isUnlocked ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/34">
                      <Lock className="h-5 w-5 text-white/72" />
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/38">
                    {featuredSpecies.isUnlocked
                      ? "Espece suivie"
                      : "A debloquer"}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight text-white">
                    {featuredSpecies.name}
                  </h3>
                  {featuredSpecies.scientificName ? (
                    <p className="mt-1 line-clamp-1 text-[12px] italic text-white/42">
                      {featuredSpecies.scientificName}
                    </p>
                  ) : null}
                  {featuredSpecies.conservationStatus ? (
                    <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/6 px-2 py-1 text-[10px] font-black text-white/56">
                      Statut {featuredSpecies.conservationStatus}
                    </span>
                  ) : null}
                </div>
              </Link>
            ) : null}
          </div>

          <div>
            <SectionTitle icon={UsersRound} title="Collectif" />
            <Link
              href="/impact"
              className="block rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4 transition-colors active:bg-white/[0.075]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6">
                  <ShieldCheck className="h-5 w-5 text-lime-300" />
                </span>
                <span className="text-2xl font-black tabular-nums text-white">
                  {Math.round(collectiveProgress)}%
                </span>
              </div>
              <h3 className="mt-4 text-base font-black leading-tight text-white">
                Objectif de saison
              </h3>
              <p className="mt-2 text-sm leading-5 text-white/58">
                Ta faction avance avec les autres membres. Garde l&apos;impact
                visible.
              </p>
            </Link>
          </div>
        </div>

        <Link
          href="/products"
          className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 transition-colors active:bg-white/[0.075]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
              <Package className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">
                Avantages disponibles
              </p>
              <p className="mt-1 truncate text-[12px] text-white/45">
                Utilise tes Points d&apos;Impact sans en faire le centre de
                l&apos;aventure.
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/28" />
        </Link>
      </div>
    </section>
  );
}
