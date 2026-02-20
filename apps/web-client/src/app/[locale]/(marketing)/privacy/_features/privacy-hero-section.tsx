import { Lock, Shield } from 'lucide-react';
import { MarketingHero } from '@/app/[locale]/(marketing)/_features/marketing-hero';
import type { PrivacyHeroProps } from './privacy.types';

export function PrivacyHeroSection({ badge, title, description }: PrivacyHeroProps) {
    return (
        <MarketingHero
            minHeightClassName="min-h-[70vh]"
            titleClassName="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm"
            descriptionClassName="sm:text-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
            background={
                <>
                    <div className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-marketing-info-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
                    <div className="absolute bottom-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
                </>
            }
            badge={
                <div className="inline-flex items-center gap-2 rounded-full border border-marketing-info-500/20 bg-marketing-info-500/5 px-4 py-1.5 text-sm font-medium text-marketing-info-600 dark:text-marketing-info-400 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                    <Shield className="h-4 w-4" />
                    <span className="uppercase tracking-widest text-xs font-bold">{badge}</span>
                </div>
            }
            title={
                <>
                    {title.line1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-marketing-info-600 via-primary to-marketing-info-600 dark:from-marketing-info-400 dark:to-marketing-info-400 animate-gradient bg-300%">
                        {title.highlight}
                    </span>
                </>
            }
            description={
                <>
                    {description.line1} {description.line2}
                </>
            }
            visual={
                <div className="mt-16 relative h-48 w-48 mx-auto animate-in zoom-in duration-1000 delay-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-marketing-info-500 to-primary rounded-[2rem] rotate-3 opacity-20 blur-2xl" />
                    <div className="relative h-full w-full bg-background/50 backdrop-blur-xl border border-marketing-overlay-light/20 dark:border-marketing-overlay-light/10 rounded-[2rem] shadow-2xl flex items-center justify-center">
                        <Lock className="h-20 w-20 text-foreground/80" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-marketing-positive-500 border-4 border-background" />
                    </div>
                </div>
            }
        />
    );
}
