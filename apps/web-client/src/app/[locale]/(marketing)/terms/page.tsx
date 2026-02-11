import { Card, CardContent, Button } from '@make-the-change/core/ui'
import { SectionContainer } from '@/components/ui/section-container'
import { Shield, FileText, Mail, Scale, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'

export default function TermsPage() {
  return (
    <>
      {/* Hero Section - 2026 Style */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <Scale className="h-4 w-4" />
            <span className="uppercase tracking-widest text-xs font-bold">Juridique</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl mb-8 text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm">
            Conditions <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-400 to-primary bg-300% animate-gradient">
              d'Utilisation
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            La transparence est au cœur de notre mission. Voici les règles qui régissent notre plateforme et protègent notre communauté.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <SectionContainer size="md" className="relative pb-24">
        {/* Floating Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

        <div className="relative">
          {/* Glass Card Container */}
          <div className="rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="p-8 md:p-12 lg:p-16 space-y-12">
              {/* Section 1: Introduction */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Acceptation des conditions</h2>
                </div>
                <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed">
                  <p>
                    En utilisant <strong className="text-foreground">Make the CHANGE</strong>, vous rejoignez une communauté engagée pour l'impact environnemental. 
                    L'utilisation de nos services implique l'acceptation pleine et entière des présentes conditions d'utilisation.
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Section 2: Evolution */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Évolution de la plateforme</h2>
                </div>
                <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed">
                  <p>
                    Make the CHANGE est un projet vivant. Les contenus, le système de points et les classements sont susceptibles d'évoluer 
                    pour mieux servir notre mission.
                  </p>
                  <ul className="grid gap-4 mt-6 not-prose">
                    <li className="flex items-start gap-3 p-4 rounded-2xl bg-background/40 border border-white/5 hover:bg-background/60 transition-colors">
                      <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <span>Mises à jour régulières pour améliorer l'expérience</span>
                    </li>
                    <li className="flex items-start gap-3 p-4 rounded-2xl bg-background/40 border border-white/5 hover:bg-background/60 transition-colors">
                      <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <span>Transparence totale sur les changements majeurs</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Section 3: Contact */}
              <div className="bg-muted/30 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                  <Mail className="h-32 w-32" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Une question ?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Notre équipe est à votre écoute pour toute clarification concernant ces conditions ou pour toute suggestion.
                  </p>
                  <a 
                    href="mailto:contact@make-the-change.com" 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
                  >
                    <span>contact@make-the-change.com</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
