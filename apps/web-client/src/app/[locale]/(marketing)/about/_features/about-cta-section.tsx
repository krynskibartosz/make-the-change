import { Globe } from 'lucide-react';
import { Button } from '@make-the-change/core/ui';
import { MarketingCtaBand } from '@/app/[locale]/(marketing)/_features/marketing-cta-band';
import { Link } from '@/i18n/navigation';
import type { AboutCtaProps } from './about.types';

export function AboutCtaSection({ badge, title, description, primary, secondary }: AboutCtaProps) {
    return (
        <div className="container mx-auto px-4 pb-20 lg:pb-32 pt-20">
            <MarketingCtaBand
                badge={
                    <>
                        <Globe className="h-5 w-5 text-marketing-positive-400" />
                        <span className="text-sm font-bold tracking-widest uppercase text-marketing-positive-100">
                            {badge}
                        </span>
                    </>
                }
                title={
                    <>
                        <span className="block text-marketing-overlay-light">{title.line1}</span>
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-marketing-positive-400 via-marketing-gradient-mid-300 to-marketing-positive-400 bg-300% animate-gradient">
                            {title.line2}
                        </span>
                    </>
                }
                description={description}
                primaryAction={
                    <Link href="/register">
                        <Button
                            size="lg"
                            className="h-16 px-10 text-lg rounded-full font-bold bg-marketing-positive-500 text-marketing-overlay-light hover:bg-marketing-positive-400 hover:scale-105 transition-all shadow-[0_0_50px_-10px_hsl(var(--marketing-positive) / 0.4)] border-none"
                        >
                            {primary}
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
                            {secondary}
                        </Button>
                    </Link>
                }
            />
        </div>
    );
}
