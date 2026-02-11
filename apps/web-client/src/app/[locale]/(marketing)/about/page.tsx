import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@make-the-change/core/ui'
import { Eye, Users, Target, BarChart3, Heart, Globe, ArrowRight, Sparkles, Leaf } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { SectionContainer } from '@/components/ui/section-container'
import { placeholderImages } from '@/lib/placeholder-images'

export default async function AboutPage() {
  const t = await getTranslations('about')

  return (
    <>
      {/* Hero Section - 2026 Style */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-teal-400/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span className="uppercase tracking-widest text-xs font-bold">Notre Histoire</span>
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
                <div className="text-3xl font-black text-foreground">Global</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-2">Impact</div>
             </div>
             
             {/* Left Card */}
             <div className="absolute left-1/2 top-1/2 -translate-x-[120%] -translate-y-[40%] rotate-[-12deg] w-56 h-72 bg-muted/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl z-10 flex flex-col items-center justify-center p-6 animate-in slide-in-from-right-8 fade-in duration-1000 delay-500 hidden sm:flex">
                <Leaf className="h-12 w-12 text-green-500 mb-4" />
                <div className="text-xl font-bold text-foreground">Nature</div>
             </div>

             {/* Right Card */}
             <div className="absolute left-1/2 top-1/2 -translate-x-[20%] -translate-y-[60%] rotate-[12deg] w-56 h-72 bg-muted/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl z-10 flex flex-col items-center justify-center p-6 animate-in slide-in-from-left-8 fade-in duration-1000 delay-700 hidden sm:flex">
                <Users className="h-12 w-12 text-orange-500 mb-4" />
                <div className="text-xl font-bold text-foreground">Social</div>
             </div>
          </div>
        </div>
      </section>

      {/* Mission Section - "Démocratiser l'impact" */}
      <SectionContainer size="lg" className="relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <Target className="h-4 w-4" />
              {t('mission.title')}
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Démocratiser <br/>
              <span className="text-primary">l'impact environnemental.</span>
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
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Transparent</p>
              </div>
              <div className="group relative overflow-hidden p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Leaf className="h-16 w-16" />
                </div>
                <p className="text-4xl font-black text-primary mb-1">+50</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Projets Actifs</p>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-muted relative z-10 rotate-3 transition-transform duration-700 hover:rotate-0">
              <img
                src={placeholderImages.projects[0]}
                alt="Biodiversity project"
                className="h-full w-full object-cover scale-110 transition-transform duration-700 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Floating Element */}
            <div className="absolute -bottom-10 -left-10 z-20 p-6 rounded-3xl bg-background/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 animate-in slide-in-from-left-4 duration-1000 delay-300">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                  <Heart className="h-7 w-7 fill-current" />
                </div>
                <div>
                  <p className="text-xl font-black leading-none mb-1">Communauté</p>
                  <p className="text-sm text-muted-foreground font-medium">Engagée pour demain</p>
                </div>
              </div>
            </div>
            
            {/* Decorative blob behind */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full scale-125" />
          </div>
        </div>
      </SectionContainer>

      {/* Values Section - Bento Grid Style */}
      <SectionContainer 
        size="lg"
        className="relative py-24"
      >
        <div className="mb-20 max-w-3xl mx-auto md:text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>Nos piliers</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Des valeurs ancrées dans <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">l'action concrète.</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed mx-auto">
            Nous ne nous contentons pas de promesses. Chaque fonctionnalité de la plateforme est conçue pour maximiser l'impact réel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto auto-rows-[350px]">
          {/* Card 1 - Impact (Wide Featured - Top Left) */}
          <div className="group md:col-span-2 p-10 rounded-[2.5rem] bg-[#1a2e26] text-white relative overflow-hidden shadow-2xl shadow-emerald-900/10 hover:-translate-y-1 transition-transform duration-500 flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/30 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex-1 min-w-0">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-emerald-300 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">{t('values.impact.title')}</h3>
              <p className="text-emerald-100/80 font-medium text-lg leading-relaxed">
                {t('values.impact.description')}
              </p>
            </div>
            
            <div className="relative z-10 flex-shrink-0 w-full md:w-auto min-w-[200px] bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center group-hover:bg-white/10 transition-colors">
              <span className="text-5xl font-black text-emerald-400 mb-2">+85%</span>
              <span className="text-sm font-medium text-emerald-200 uppercase tracking-wider">D'efficacité</span>
            </div>
          </div>

          {/* Card 2 - Transparency (Tall Vertical - Right Column) */}
          <div className="group md:col-span-1 md:row-span-2 p-10 rounded-[2.5rem] bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">{t('values.transparency.title')}</h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                {t('values.transparency.description')}
              </p>
            </div>
            
            <div className="relative h-48 w-full mt-8 rounded-2xl bg-background/50 border border-border/50 overflow-hidden">
               {/* Abstract Blockchain Visualization */}
               <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="h-16 w-1 rounded-full bg-blue-500/20 animate-pulse delay-0" />
                  <div className="h-24 w-1 rounded-full bg-blue-500/40 animate-pulse delay-100" />
                  <div className="h-32 w-1 rounded-full bg-blue-500/60 animate-pulse delay-200" />
                  <div className="h-20 w-1 rounded-full bg-blue-500/40 animate-pulse delay-300" />
                  <div className="h-12 w-1 rounded-full bg-blue-500/20 animate-pulse delay-400" />
               </div>
               <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold text-blue-500 uppercase tracking-widest">
                  Blockchain Verified
               </div>
            </div>
          </div>

          {/* Card 3 - Community (Standard - Bottom Left) */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-background/50 backdrop-blur-sm border border-border/50 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute right-0 top-0 h-32 w-32 bg-orange-500/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700" />
             
             <div>
               <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 group-hover:scale-110 transition-transform duration-500">
                 <Users className="h-7 w-7" />
               </div>
               <h3 className="text-2xl font-black mb-3">{t('values.community.title')}</h3>
               <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                 {t('values.community.description')}
               </p>
             </div>
             
             <div className="mt-6 flex items-center justify-between">
               <div className="flex -space-x-2">
                 {[1,2,3].map((i) => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                     U{i}
                   </div>
                 ))}
               </div>
               <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                 <ArrowRight className="h-5 w-5" />
               </div>
             </div>
          </div>

          {/* Card 4 - Innovation (New - Bottom Center) */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-background/50 backdrop-blur-sm border border-border/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50" />
             
             <div className="relative z-10">
               <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform duration-500">
                 <Sparkles className="h-7 w-7" />
               </div>
               <h3 className="text-2xl font-black mb-3">Innovation</h3>
               <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                 Tech for Good : IA, Satellite et Big Data au service de la nature.
               </p>
             </div>
             
             <div className="relative z-10 mt-6 flex gap-2">
               <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900">AI</Badge>
               <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-900">IoT</Badge>
             </div>
          </div>
        </div>
      </SectionContainer>

      {/* Team Section - "The Visionaries" - Storytelling Style (Mobile Optimized) */}
      <SectionContainer size="lg" className="relative pb-24 lg:pb-32">
        <div className="mb-16 lg:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 lg:mb-6">L'équipe visionnaire</h2>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Rencontrez les esprits qui transforment l'ambition écologique en réalité.
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-60 transition-opacity duration-500" />
                
                {/* Mobile-only overlay name */}
                <div className="absolute bottom-6 left-6 lg:hidden">
                  <h3 className="text-3xl font-black text-white">Gregory Steisel</h3>
                  <p className="text-white/80 font-medium">CEO & Co-Fondateur</p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 px-2 lg:px-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest">
                <Sparkles className="h-4 w-4" />
                Leadership
              </div>
              
              <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-none lg:block hidden">
                Gregory <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Steisel</span>
              </h3>
              
              <div className="text-xl font-medium text-foreground/80 lg:block hidden">CEO & Co-Fondateur</div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="block mb-4 text-foreground font-semibold italic border-l-4 border-primary pl-4">"L'écologie ne doit plus être une contrainte, mais une opportunité."</span>
                Entrepreneur passionné, Gregory a consacré la dernière décennie à construire des ponts entre innovation technologique et impact durable. Sa vision : créer un écosystème où chaque action individuelle se traduit par une restauration concrète de la biodiversité mondiale.
              </p>

              <div className="flex gap-4 pt-2 lg:pt-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <Globe className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Row: Bartosz Krynski */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
            {/* Content Column - BARTOSZ: LEFT on desktop */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 px-2 lg:px-0 lg:text-right order-2 lg:order-1">
              <div className="flex lg:justify-end">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-500 text-sm font-bold uppercase tracking-widest">
                  <BarChart3 className="h-4 w-4" />
                  Technology
                </div>
              </div>
              
              <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-none lg:block hidden">
                Bartosz <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Krynski</span>
              </h3>
              
              <div className="text-xl font-medium text-foreground/80 lg:block hidden">CTO & Co-Fondateur</div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="block mb-4 text-foreground font-semibold italic lg:border-r-4 lg:border-l-0 border-l-4 border-teal-500 pl-4 lg:pl-0 lg:pr-4">"La transparence n'est pas une option, c'est la fondation de la confiance."</span>
                Architecte de l'invisible, Bartosz transforme la complexité de la blockchain en une expérience utilisateur fluide et sécurisée. Il veille à ce que chaque ligne de code serve la mission : garantir l'intégrité et l'impact de chaque investissement.
              </p>

              <div className="flex gap-4 pt-2 lg:pt-4 lg:justify-end">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/50 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/50 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </Button>
              </div>
            </div>

            {/* Image Column - BARTOSZ: RIGHT on desktop */}
            <div className="w-full lg:w-1/2 relative group order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-bl from-teal-400/30 to-transparent rounded-[2.5rem] lg:rounded-[3rem] blur-2xl opacity-20 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] border border-border/50 lg:hover:border-teal-400/50 transition-all duration-500 shadow-xl lg:shadow-2xl bg-muted/20 aspect-[3/4] min-h-[400px] lg:min-h-[500px]">
                <img 
                  src="/team/bart-pc.png" 
                  alt="Bartosz Krynski"
                  className="absolute inset-0 w-full h-full object-cover -rotate-90 scale-[1.35] transition-all duration-700 filter grayscale brightness-75 lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-60 transition-opacity duration-500" />
                
                {/* Mobile-only overlay name */}
                <div className="absolute bottom-6 left-6 lg:hidden">
                  <h3 className="text-3xl font-black text-white">Bartosz Krynski</h3>
                  <p className="text-white/80 font-medium">CTO & Co-Fondateur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>


      {/* CTA Section - Eco-Futurism Style */}
      <div className="container mx-auto px-4 pb-20 lg:pb-32 pt-20">
        <div 
          className="relative rounded-[3rem] !bg-[#0A1A14] !text-white p-12 md:p-24 overflow-hidden isolate shadow-2xl shadow-emerald-900/20"
          style={{ backgroundColor: '#0A1A14', color: 'white' }}
        >
          {/* Animated Noise Texture */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-grain" />
          </div>

          {/* Organic Gradient Orbs */}
          <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]" />
          <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-teal-600/20 blur-[120px] mix-blend-screen animate-pulse duration-[6000ms]" />
          
          {/* Topographic Lines (SVG Pattern) */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiL2Q+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Globe className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-bold tracking-widest uppercase text-emerald-100">Rejoignez le mouvement</span>
            </div>

            {/* Main Title */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <span className="block text-white">Ensemble, préservons</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-300% animate-gradient">
                notre héritage.
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-emerald-100/80 font-medium leading-relaxed max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Chaque action compte. Transformez votre engagement en impact réel et mesurable pour la biodiversité.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full font-bold bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)] border-none">
                Commencer maintenant
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full font-bold border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm">
                Voir les projets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
