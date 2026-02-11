import {
  Button,
} from '@make-the-change/core/ui'
import { Mail, MessageCircle, HelpCircle, ArrowRight, Sparkles, Globe, Twitter, Linkedin, Instagram, MapPin, Copy, Check } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { ContactCopyButton } from './contact-copy-button'

export default function ContactPage() {
  return (
    <>
      {/* Hero Section - Dribbble 2026 Style */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-teal-400/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          {/* Abstract Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-8 animate-in fade-in zoom-in duration-700 shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="uppercase tracking-widest text-xs font-bold">Toujours à l'écoute</span>
          </div>
          
          <h1 className="mx-auto max-w-7xl text-7xl font-black tracking-tighter sm:text-8xl lg:text-9xl mb-8 text-foreground animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 drop-shadow-2xl">
            Parlons de <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-primary via-teal-400 to-emerald-500 opacity-20 blur-2xl rounded-full" />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-400 to-emerald-500 animate-gradient bg-300%">
                l'avenir.
              </span>
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl sm:text-3xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Une idée folle ? Un projet ambitieux ? <br/>
            <span className="text-foreground">Construisons-le ensemble.</span>
          </p>
        </div>
      </section>

      {/* Contact Options - Ultra Bento Grid */}
      <SectionContainer 
        size="lg"
        className="relative pb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full max-w-7xl mx-auto auto-rows-[350px]">
          
          {/* Card 1 - Email (Featured - Top Left - 4 cols) */}
          <div className="group md:col-span-4 p-12 rounded-[3rem] bg-card text-card-foreground relative overflow-hidden shadow-2xl shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all duration-700 border border-border/50">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 to-teal-500/0 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-500/10 text-emerald-500 backdrop-blur-xl border border-emerald-500/20 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                  Envoyez-nous <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">un signal.</span>
                </h3>
                <p className="text-muted-foreground font-medium text-xl max-w-md">
                  Notre équipe est réactive. Réponse garantie sous 24h.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-8">
                 <a href="mailto:contact@make-the-change.com" className="inline-flex items-center gap-4 text-3xl md:text-4xl font-black hover:text-emerald-500 transition-colors tracking-tight">
                    contact@make-the-change.com
                    <ArrowRight className="h-8 w-8 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                 </a>
                 <ContactCopyButton className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300" />
              </div>
            </div>
          </div>

          {/* Card 2 - Socials (Vertical - Top Right - 2 cols) */}
           <div className="group md:col-span-2 md:row-span-2 p-10 rounded-[3rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-700 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             
             <div className="relative z-10">
               <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                 <Globe className="h-8 w-8" />
               </div>
               <h3 className="text-3xl font-black mb-4">Social Hub</h3>
               <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                 Rejoignez la conversation et suivez nos impacts en temps réel.
               </p>
             </div>
             
             <div className="grid gap-4 mt-8">
                {[
                  { icon: Twitter, label: "Twitter / X", handle: "@makethechange" },
                  { icon: Linkedin, label: "LinkedIn", handle: "Make the Change" },
                  { icon: Instagram, label: "Instagram", handle: "@mtc_impact" }
                ].map((social, i) => (
                  <a key={i} href="#" className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-primary/10 transition-colors group/item border border-border/50 hover:border-primary/20">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-foreground group-hover/item:text-primary transition-colors shadow-sm">
                        <social.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{social.label}</div>
                        <div className="text-xs text-muted-foreground">{social.handle}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-primary" />
                  </a>
                ))}
             </div>
          </div>
          
          {/* Card 3 - FAQ (Square - Bottom Left - 2 cols) */}
          <div className="group md:col-span-2 p-10 rounded-[3rem] bg-muted/30 border border-border/50 hover:border-blue-500/50 transition-all duration-700 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-colors duration-700" />
            
            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                <HelpCircle className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">FAQ</h3>
              <p className="text-muted-foreground font-medium text-sm">
                Réponses instantanées.
              </p>
            </div>
            
            <div className="relative mt-4 space-y-2">
               {/* Abstract FAQ Items */}
               {[1, 2, 3].map((i) => (
                 <div key={i} className="h-2 bg-foreground/5 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-blue-500/20 w-1/2 animate-pulse" style={{ width: `${Math.random() * 50 + 30}%`, animationDelay: `${i * 200}ms` }} />
                 </div>
               ))}
            </div>

            <Button variant="outline" className="w-full rounded-2xl mt-6 h-12 font-bold border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400" asChild>
                <Link href="/faq">Consulter la FAQ</Link>
            </Button>
          </div>

           {/* Card 4 - Office / Map (Wide - Bottom Center - 2 cols) */}
           <div className="group md:col-span-2 p-10 rounded-[3rem] bg-card text-card-foreground border border-border/50 hover:border-purple-500/50 transition-all duration-700 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
             <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03]" />
             
             <div className="relative z-10 flex items-start justify-between">
               <div>
                 <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 backdrop-blur-md border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                   <MapPin className="h-7 w-7" />
                 </div>
                 <h3 className="text-2xl font-black mb-1">Paris, FR</h3>
                 <p className="text-muted-foreground font-medium text-sm">
                   HQ & Innovation Lab
                 </p>
               </div>
               <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                  Open
               </div>
             </div>
             
             <div className="relative z-10 mt-6 h-32 rounded-2xl bg-muted border border-border/50 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                 {/* Stylized Map Points */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-ping absolute" />
                    <div className="h-4 w-4 rounded-full bg-purple-500 relative z-10 border-2 border-white dark:border-black" />
                 </div>
                 <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground">
                    48.8566° N, 2.3522° E
                 </div>
             </div>
          </div>

        </div>
      </SectionContainer>

      {/* CTA Section - Experimental Layout */}
      <div className="container mx-auto px-4 pb-20 lg:pb-32">
        <div className="relative rounded-[3rem] bg-primary text-primary-foreground p-12 md:p-24 overflow-hidden isolate shadow-2xl shadow-primary/30 group">
          
          {/* Fluid Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal-600" />
          <div className="absolute -top-[50%] -right-[20%] w-[100%] h-[100%] rounded-full bg-white/10 blur-[100px] animate-blob" />
          <div className="absolute -bottom-[50%] -left-[20%] w-[100%] h-[100%] rounded-full bg-black/10 blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

          <div className="relative z-10 flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="max-w-3xl">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 mix-blend-overlay opacity-90 group-hover:opacity-100 transition-opacity">
                Prêt à <br/>
                changer <br/>
                le monde ?
              </h2>
              <div className="h-2 w-32 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/2 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            
            <div className="flex flex-col gap-6 w-full md:w-auto">
              <p className="text-xl font-medium opacity-80 max-w-xs md:text-right">
                Rejoignez 50,000+ acteurs du changement dès aujourd'hui.
              </p>
              <Button size="lg" className="h-20 px-12 text-xl rounded-full font-black bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-xl border-4 border-transparent hover:border-primary/20 bg-clip-padding">
                Commencer maintenant
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
