import { Sparkles, Globe, Leaf, Users } from 'lucide-react';
import { MarketingHeroShell } from '@/app/[locale]/(marketing)/_features/marketing-hero-shell';
import type { AboutHeroProps } from './about.types';

export function AboutHeroSection({ badge, title, intro, cards }: AboutHeroProps) {
    return (
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
                <span className="uppercase tracking-widest text-xs font-bold">{badge}</span>
            </div>

            <h1 className="mx-auto max-w-6xl text-6xl font-black tracking-tighter sm:text-8xl lg:text-9xl mb-8 text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm">
                {title}
            </h1>

            <p className="mx-auto max-w-2xl text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                {intro}
            </p>

            {/* Hero Visual - Floating Cards */}
            <div className="mt-16 relative h-64 sm:h-96 w-full max-w-4xl mx-auto perspective-1000">
                {/* Center Card */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 sm:w-80 sm:h-96 bg-background rounded-3xl border border-border shadow-2xl z-20 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-1000 delay-300">
                    <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Globe className="h-16 w-16 text-primary" />
                    </div>
                    <div className="text-3xl font-black text-foreground">
                        {cards.global.title}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-2">
                        {cards.global.subtitle}
                    </div>
                </div>

                {/* Left Card */}
                <div className="absolute left-1/2 top-1/2 -translate-x-[120%] -translate-y-[40%] rotate-[-12deg] w-56 h-72 bg-muted/50 backdrop-blur-md rounded-3xl border border-marketing-overlay-light/20 shadow-xl z-10 flex flex-col items-center justify-center p-6 animate-in slide-in-from-right-8 fade-in duration-1000 delay-500 hidden sm:flex">
                    <Leaf className="h-12 w-12 text-marketing-positive-500 mb-4" />
                    <div className="text-xl font-bold text-foreground">{cards.nature}</div>
                </div>

                {/* Right Card */}
                <div className="absolute left-1/2 top-1/2 -translate-x-[20%] -translate-y-[60%] rotate-[12deg] w-56 h-72 bg-muted/50 backdrop-blur-md rounded-3xl border border-marketing-overlay-light/20 shadow-xl z-10 flex flex-col items-center justify-center p-6 animate-in slide-in-from-left-8 fade-in duration-1000 delay-700 hidden sm:flex">
                    <Users className="h-12 w-12 text-marketing-warning-500 mb-4" />
                    <div className="text-xl font-bold text-foreground">{cards.social}</div>
                </div>
            </div>
        </MarketingHeroShell>
    );
}
