import { Button } from '@make-the-change/core/ui'
import { Shield, Lock, Mail, Server, Fingerprint, CheckCircle2 } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[70vh] flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-blue-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <Shield className="h-4 w-4" />
            <span className="uppercase tracking-widest text-xs font-bold">Légal & Sécurité</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl mb-8 text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm">
            Votre confiance <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-blue-600 dark:from-blue-400 dark:to-blue-400 animate-gradient bg-300%">est notre priorité.</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Nous avons conçu Make the CHANGE avec la confidentialité au cœur de l'expérience.
            Transparence totale, zéro compromis.
          </p>

          {/* Abstract Visual - Lock Animation */}
          <div className="mt-16 relative h-48 w-48 mx-auto animate-in zoom-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-primary rounded-[2rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative h-full w-full bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl flex items-center justify-center">
               <Lock className="h-20 w-20 text-foreground/80" />
               <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-500 border-4 border-background" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section - Bento Grid Style */}
      <SectionContainer size="lg" className="relative pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          
          {/* Card 1: Data Collection (Wide) */}
          <div className="group md:col-span-2 p-10 rounded-[2.5rem] bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-500">
                <Server className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3">Collecte Minimale</h3>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Nous collectons uniquement les informations strictement nécessaires au bon fonctionnement de l’application : votre compte, vos commandes et votre suivi d’impact. Rien de plus.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: No Selling (Tall/Colored) */}
          <div className="group md:col-span-1 md:row-span-2 p-10 rounded-[2.5rem] bg-slate-900 dark:bg-card text-white dark:text-card-foreground relative overflow-hidden shadow-2xl shadow-blue-900/20 hover:-translate-y-1 transition-transform duration-500 flex flex-col justify-between border border-transparent dark:border-border">
            {/* Noise & Glow */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/30 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 dark:bg-primary/10 text-blue-300 dark:text-primary backdrop-blur-md border border-white/10 dark:border-primary/20 group-hover:rotate-12 transition-transform duration-500">
                <Fingerprint className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black mb-4">Vos données vous appartiennent.</h3>
              <p className="text-blue-100/80 dark:text-muted-foreground font-medium text-lg leading-relaxed mb-8">
                Nous ne vendons pas vos données. Jamais. C'est une promesse ferme et définitive.
              </p>
            </div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-3 text-sm font-bold text-blue-300 dark:text-primary uppercase tracking-wider">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Garanti à 100%</span>
               </div>
            </div>
          </div>

          {/* Card 3: Security */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-background border border-border/50 hover:border-blue-500/30 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
             <div className="absolute -right-8 -bottom-8 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl transition-all group-hover:bg-blue-500/10" />
             <div className="relative z-10">
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                 <Lock className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-black mb-3">Sécurité Renforcée</h3>
               <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                 Les informations sensibles ne sont jamais affichées sur les pages publiques. Tout est chiffré.
               </p>
             </div>
          </div>

          {/* Card 4: Contact (Action) */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 hover:bg-primary/10 transition-all duration-500 cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mail className="h-24 w-24 -rotate-12 text-foreground/10" />
             </div>
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black mb-2">Des questions ?</h3>
                  <p className="text-muted-foreground font-medium text-sm">Notre équipe DPO est là pour vous.</p>
                </div>
                <Button className="mt-6 w-full rounded-xl font-bold" asChild>
                   <a href="mailto:contact@make-the-change.com">Nous écrire</a>
                </Button>
             </div>
          </div>

        </div>
      </SectionContainer>
    </>
  )
}
