import { Badge, Button } from '@make-the-change/core/ui'
import {
  ArrowRight,
  BarChart3,
  Eye,
  Globe,
  Heart,
  Leaf,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { MarketingCtaBand } from '@/app/[locale]/(marketing)/_features/marketing/marketing-cta-band'
import { MarketingHeroShell } from '@/app/[locale]/(marketing)/_features/marketing/marketing-hero-shell'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { placeholderImages } from '@/lib/placeholder-images'

export default async function AboutPage() {
  const t = await getTranslations('about')

  return (
    <>
      {/* Hero Section - 2026 Style */}
      <MarketingHeroShell
        minHeightClassName="min-h-[90vh]"
        containerClassName="text-center"
        background={
          <>
            <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-marketing-gradient-mid-400/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
          </>
        }
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span className="uppercase tracking-widest text-xs font-bold">{t('hero.badge')}</span>
        </div>

        <h1 className="mx-auto max-w-6xl text-6xl font-black tracking-tighter sm:text-8xl lg:text-9xl mb-8 text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm">
          {t('title')}
        </h1>

        <p className="mx-auto max-w-2xl text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {t('intro')}
        </p>

        {/* Hero Visual - Floating Cards */}
        <div className="mt-16 relative h-64 sm:h-96 w-full max-w-4xl mx-auto perspective-1000">
          {/* Center Card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 sm:w-80 sm:h-96 bg-background rounded-3xl border border-border shadow-2xl z-20 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-1000 delay-300">
            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Globe className="h-16 w-16 text-primary" />
            </div>
            <div className="text-3xl font-black text-foreground">
              {t('hero.cards.global.title')}
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-2">
              {t('hero.cards.global.subtitle')}
            </div>
          </div>

          {/* Left Card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-[120%] -translate-y-[40%] rotate-[-12deg] w-56 h-72 bg-muted/50 backdrop-blur-md rounded-3xl border border-marketing-overlay-light/20 shadow-xl z-10 flex flex-col items-center justify-center p-6 animate-in slide-in-from-right-8 fade-in duration-1000 delay-500 hidden sm:flex">
            <Leaf className="h-12 w-12 text-marketing-positive-500 mb-4" />
            <div className="text-xl font-bold text-foreground">{t('hero.cards.nature')}</div>
          </div>

          {/* Right Card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-[20%] -translate-y-[60%] rotate-[12deg] w-56 h-72 bg-muted/50 backdrop-blur-md rounded-3xl border border-marketing-overlay-light/20 shadow-xl z-10 flex flex-col items-center justify-center p-6 animate-in slide-in-from-left-8 fade-in duration-1000 delay-700 hidden sm:flex">
            <Users className="h-12 w-12 text-marketing-warning-500 mb-4" />
            <div className="text-xl font-bold text-foreground">{t('hero.cards.social')}</div>
          </div>
        </div>
      </MarketingHeroShell>

      {/* Mission Section - "Démocratiser l'impact" */}
      <SectionContainer size="lg" className="relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marketing-warning-500/10 text-marketing-warning-600 text-xs font-bold uppercase tracking-wider">
              <Target className="h-4 w-4" />
              {t('mission.title')}
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              {t('mission.heading.line1')} <br />
              <span className="text-primary">{t('mission.heading.highlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium max-w-xl">
              {t('mission.description')}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              <div className="group relative overflow-hidden p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Eye className="h-16 w-16" />
                </div>
                <p className="text-4xl font-black text-primary mb-1">100%</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
                  {t('mission.metrics.transparency')}
                </p>
              </div>
              <div className="group relative overflow-hidden p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Leaf className="h-16 w-16" />
                </div>
                <p className="text-4xl font-black text-primary mb-1">+50</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
                  {t('mission.metrics.active_projects')}
                </p>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-muted relative z-10 rotate-3 transition-transform duration-700 hover:rotate-0">
              <img
                src={placeholderImages.projects[0]}
                alt={t('mission.image_alt')}
                className="h-full w-full object-cover scale-110 transition-transform duration-700 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Element */}
            <div className="absolute -bottom-10 -left-10 z-20 p-6 rounded-3xl bg-background/90 backdrop-blur-xl shadow-[0_8px_30px_hsl(var(--marketing-overlay-dark) / 0.12)] border border-marketing-overlay-light/20 animate-in slide-in-from-left-4 duration-1000 delay-300">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-marketing-positive-400 to-marketing-positive-600 flex items-center justify-center text-marketing-overlay-light shadow-lg shadow-marketing-positive-500/30">
                  <Heart className="h-7 w-7 fill-current" />
                </div>
                <div>
                  <p className="text-xl font-black leading-none mb-1">
                    {t('mission.community.title')}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {t('mission.community.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative blob behind */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full scale-125" />
          </div>
        </div>
      </SectionContainer>

      {/* Values Section - Bento Grid Style */}
      <SectionContainer size="lg" className="relative py-24">
        <div className="mb-20 max-w-3xl mx-auto md:text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>{t('values.section_badge')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            {t('values.section_heading.line1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-marketing-gradient-mid-400">
              {t('values.section_heading.highlight')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed mx-auto">
            {t('values.section_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto auto-rows-[350px]">
          {/* Card 1 - Impact (Wide Featured - Top Left) */}
          <div className="group md:col-span-2 p-10 rounded-[2.5rem] bg-marketing-surface-elevated text-marketing-overlay-light relative overflow-hidden shadow-2xl shadow-marketing-positive-900/10 hover:-translate-y-1 transition-transform duration-500 flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-marketing-positive-500/30 rounded-full blur-[80px]" />

            <div className="relative z-10 flex-1 min-w-0">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-marketing-overlay-light/10 text-marketing-positive-300 backdrop-blur-md border border-marketing-overlay-light/10 group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">
                {t('values.impact.title')}
              </h3>
              <p className="text-marketing-positive-100/80 font-medium text-lg leading-relaxed">
                {t('values.impact.description')}
              </p>
            </div>

            <div className="relative z-10 flex-shrink-0 w-full md:w-auto min-w-[200px] bg-marketing-overlay-light/5 rounded-2xl border border-marketing-overlay-light/10 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center group-hover:bg-marketing-overlay-light/10 transition-colors">
              <span className="text-5xl font-black text-marketing-positive-400 mb-2">+85%</span>
              <span className="text-sm font-medium text-marketing-positive-200 uppercase tracking-wider">
                {t('values.impact.metric_label')}
              </span>
            </div>
          </div>

          {/* Card 2 - Transparency (Tall Vertical - Right Column) */}
          <div className="group md:col-span-1 md:row-span-2 p-10 rounded-[2.5rem] bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-marketing-info-500/10 text-marketing-info-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">
                {t('values.transparency.title')}
              </h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                {t('values.transparency.description')}
              </p>
            </div>

            <div className="relative h-48 w-full mt-8 rounded-2xl bg-background/50 border border-border/50 overflow-hidden">
              {/* Abstract Blockchain Visualization */}
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <div className="h-16 w-1 rounded-full bg-marketing-info-500/20 animate-pulse delay-0" />
                <div className="h-24 w-1 rounded-full bg-marketing-info-500/40 animate-pulse delay-100" />
                <div className="h-32 w-1 rounded-full bg-marketing-info-500/60 animate-pulse delay-200" />
                <div className="h-20 w-1 rounded-full bg-marketing-info-500/40 animate-pulse delay-300" />
                <div className="h-12 w-1 rounded-full bg-marketing-info-500/20 animate-pulse delay-400" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold text-marketing-info-500 uppercase tracking-widest">
                {t('values.transparency.verified_label')}
              </div>
            </div>
          </div>

          {/* Card 3 - Community (Standard - Bottom Left) */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-background/50 backdrop-blur-sm border border-border/50 hover:border-marketing-warning-500/50 transition-all duration-500 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 h-32 w-32 bg-marketing-warning-500/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />

            <div>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-marketing-warning-500/10 text-marketing-warning-600 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">{t('values.community.title')}</h3>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                {t('values.community.description')}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold"
                  >
                    U{i}
                  </div>
                ))}
              </div>
              <div className="h-10 w-10 rounded-full bg-marketing-warning-100 dark:bg-marketing-warning-500/20 flex items-center justify-center text-marketing-warning-600 dark:text-marketing-warning-400 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Card 4 - Innovation (New - Bottom Center) */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-background/50 backdrop-blur-sm border border-border/50 hover:border-marketing-accent-alt-500/50 transition-all duration-500 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-marketing-accent-alt-500/5 to-transparent opacity-50" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-marketing-accent-alt-500/10 text-marketing-accent-alt-600 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">{t('values.innovation.title')}</h3>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                {t('values.innovation.description')}
              </p>
            </div>

            <div className="relative z-10 mt-6 flex gap-2">
              <Badge
                variant="outline"
                className="bg-marketing-accent-alt-500/10 text-marketing-accent-alt-600 border-marketing-accent-alt-200 dark:border-marketing-accent-alt-900"
              >
                {t('values.innovation.badges.ai')}
              </Badge>
              <Badge
                variant="outline"
                className="bg-marketing-accent-alt-500/10 text-marketing-accent-alt-600 border-marketing-accent-alt-200 dark:border-marketing-accent-alt-900"
              >
                {t('values.innovation.badges.iot')}
              </Badge>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Team Section - "The Visionaries" - Storytelling Style (Mobile Optimized) */}
      <SectionContainer size="lg" className="relative pb-24 lg:pb-32">
        <div className="mb-16 lg:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 lg:mb-6">
            {t('team.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="space-y-20 lg:space-y-32">
          {/* Row: Gregory Steisel */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
            {/* Image Column */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-[2.5rem] lg:rounded-[3rem] blur-2xl opacity-20 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] border border-border/50 lg:hover:border-primary/50 transition-all duration-500 shadow-xl lg:shadow-2xl bg-muted/20 aspect-[3/4] min-h-[400px] lg:min-h-[500px]">
                <img
                  src="/team/greg.png"
                  alt="Gregory Steisel"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 filter grayscale brightness-75 lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-60 transition-opacity duration-500" />

                {/* Mobile-only overlay name */}
                <div className="absolute bottom-6 left-6 lg:hidden">
                  <h3 className="text-3xl font-black text-marketing-overlay-light">
                    Gregory Steisel
                  </h3>
                  <p className="text-marketing-overlay-light/80 font-medium">
                    {t('team.gregory.role')}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 px-2 lg:px-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest">
                <Sparkles className="h-4 w-4" />
                {t('team.gregory.badge')}
              </div>

              <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-none lg:block hidden">
                Gregory <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-marketing-gradient-mid-400">
                  Steisel
                </span>
              </h3>

              <div className="text-xl font-medium text-foreground/80 lg:block hidden">
                {t('team.gregory.role')}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="block mb-4 text-foreground font-semibold italic border-l-4 border-primary pl-4">
                  {t('team.gregory.quote')}
                </span>
                {t('team.gregory.bio')}
              </p>

              <div className="flex gap-4 pt-2 lg:pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-border/50 hover:bg-primary hover:text-marketing-overlay-light hover:border-primary transition-all"
                  asChild
                >
                  <a
                    href="https://www.linkedin.com/in/steisel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn de Gregory Steisel"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-border/50 hover:bg-primary hover:text-marketing-overlay-light hover:border-primary transition-all"
                  asChild
                >
                  <a
                    href="https://www.wexible.be"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Site web de Gregory Steisel"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Row: Bartosz Krynski */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
            {/* Content Column - BARTOSZ: LEFT on desktop */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 px-2 lg:px-0 lg:text-right order-2 lg:order-1">
              <div className="flex lg:justify-end">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-marketing-gradient-mid-500/10 border border-marketing-gradient-mid-500/20 text-marketing-gradient-mid-500 text-sm font-bold uppercase tracking-widest">
                  <BarChart3 className="h-4 w-4" />
                  {t('team.bartosz.badge')}
                </div>
              </div>

              <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-none lg:block hidden">
                Bartosz <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-marketing-gradient-mid-400 to-marketing-positive-500">
                  Krynski
                </span>
              </h3>

              <div className="text-xl font-medium text-foreground/80 lg:block hidden">
                {t('team.bartosz.role')}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="block mb-4 text-foreground font-semibold italic lg:border-r-4 lg:border-l-0 border-l-4 border-marketing-gradient-mid-500 pl-4 lg:pl-0 lg:pr-4">
                  {t('team.bartosz.quote')}
                </span>
                {t('team.bartosz.bio')}
              </p>

              <div className="flex gap-4 pt-2 lg:pt-4 lg:justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-border/50 hover:bg-marketing-gradient-mid-500 hover:text-marketing-overlay-light hover:border-marketing-gradient-mid-500 transition-all"
                  asChild
                >
                  <a
                    href="https://www.linkedin.com/in/bartosz-krynski/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn de Bartosz Krynski"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-border/50 hover:bg-marketing-gradient-mid-500 hover:text-marketing-overlay-light hover:border-marketing-gradient-mid-500 transition-all"
                  asChild
                >
                  <a
                    href="https://github.com/krynskibartosz"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub de Bartosz Krynski"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-border/50 hover:bg-marketing-gradient-mid-500 hover:text-marketing-overlay-light hover:border-marketing-gradient-mid-500 transition-all"
                  asChild
                >
                  <a
                    href="https://bartek-portfolio.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Site web de Bartosz Krynski"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Image Column - BARTOSZ: RIGHT on desktop */}
            <div className="w-full lg:w-1/2 relative group order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-bl from-marketing-gradient-mid-400/30 to-transparent rounded-[2.5rem] lg:rounded-[3rem] blur-2xl opacity-20 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] border border-border/50 lg:hover:border-marketing-gradient-mid-400/50 transition-all duration-500 shadow-xl lg:shadow-2xl bg-muted/20 aspect-[3/4] min-h-[400px] lg:min-h-[500px]">
                <img
                  src="/team/bart-pc.png"
                  alt="Bartosz Krynski"
                  className="absolute inset-0 w-full h-full object-cover -rotate-90 scale-[1.35] transition-all duration-700 filter grayscale brightness-75 lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-60 transition-opacity duration-500" />

                {/* Mobile-only overlay name */}
                <div className="absolute bottom-6 left-6 lg:hidden">
                  <h3 className="text-3xl font-black text-marketing-overlay-light">
                    Bartosz Krynski
                  </h3>
                  <p className="text-marketing-overlay-light/80 font-medium">
                    {t('team.bartosz.role')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* CTA Section - Eco-Futurism Style */}
      <div className="container mx-auto px-4 pb-20 lg:pb-32 pt-20">
        <MarketingCtaBand
          badge={
            <>
              <Globe className="h-5 w-5 text-marketing-positive-400" />
              <span className="text-sm font-bold tracking-widest uppercase text-marketing-positive-100">
                {t('cta.badge')}
              </span>
            </>
          }
          title={
            <>
              <span className="block text-marketing-overlay-light">{t('cta.title.line1')}</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-marketing-positive-400 via-marketing-gradient-mid-300 to-marketing-positive-400 bg-300% animate-gradient">
                {t('cta.title.line2')}
              </span>
            </>
          }
          description={t('cta.description')}
          primaryAction={
            <Link href="/register">
              <Button
                size="lg"
                className="h-16 px-10 text-lg rounded-full font-bold bg-marketing-positive-500 text-marketing-overlay-light hover:bg-marketing-positive-400 hover:scale-105 transition-all shadow-[0_0_50px_-10px_hsl(var(--marketing-positive) / 0.4)] border-none"
              >
                {t('cta.primary')}
              </Button>
            </Link>
          }
          secondaryAction={
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg rounded-full font-bold border-marketing-overlay-light/20 bg-transparent text-marketing-overlay-light hover:bg-marketing-overlay-light/10 hover:border-marketing-overlay-light/40 transition-all backdrop-blur-sm"
              >
                {t('cta.secondary')}
              </Button>
            </Link>
          }
        />
      </div>
    </>
  )
}
