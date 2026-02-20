import { Button } from '@make-the-change/core/ui';
import { CheckCircle2, Fingerprint, Lock, Mail, Server } from 'lucide-react';
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section';
import type { PrivacyCardsProps } from './privacy.types';

export function PrivacyCardsSection({
    minimalCollection,
    dataOwnership,
    security,
    contact,
}: PrivacyCardsProps) {
    return (
        <MarketingSection size="lg" className="pb-32" contentClassName="max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                {/* Card 1: Data Collection (Wide) */}
                <div className="group md:col-span-2 p-10 rounded-[2.5rem] bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-500">
                            <Server className="h-10 w-10" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black mb-3">{minimalCollection.title}</h3>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                {minimalCollection.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2: No Selling (Tall/Colored) */}
                <div className="group md:col-span-1 md:row-span-2 p-10 rounded-[2.5rem] bg-marketing-neutral-900 dark:bg-card text-marketing-overlay-light dark:text-card-foreground relative overflow-hidden shadow-2xl shadow-marketing-info-900/20 hover:-translate-y-1 transition-transform duration-500 flex flex-col justify-between border border-transparent dark:border-border">
                    {/* Noise & Glow */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-marketing-info-500/30 rounded-full blur-[60px]" />

                    <div className="relative z-10">
                        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-marketing-overlay-light/10 dark:bg-primary/10 text-marketing-info-300 dark:text-primary backdrop-blur-md border border-marketing-overlay-light/10 dark:border-primary/20 group-hover:rotate-12 transition-transform duration-500">
                            <Fingerprint className="h-8 w-8" />
                        </div>
                        <h3 className="text-3xl font-black mb-4">{dataOwnership.title}</h3>
                        <p className="text-marketing-info-100/80 dark:text-muted-foreground font-medium text-lg leading-relaxed mb-8">
                            {dataOwnership.description}
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-sm font-bold text-marketing-info-300 dark:text-primary uppercase tracking-wider">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>{dataOwnership.guarantee}</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Security */}
                <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-background border border-border/50 hover:border-marketing-info-500/30 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 h-40 w-40 bg-marketing-info-500/5 rounded-full blur-3xl transition-all group-hover:bg-marketing-info-500/10" />
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-marketing-info-500/10 text-marketing-info-600 dark:text-marketing-info-400">
                            <Lock className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-black mb-3">{security.title}</h3>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                            {security.description}
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
                            <h3 className="text-xl font-black mb-2">{contact.title}</h3>
                            <p className="text-muted-foreground font-medium text-sm">
                                {contact.description}
                            </p>
                        </div>
                        <Button className="mt-6 w-full rounded-xl font-bold" asChild>
                            <a href="mailto:contact@make-the-change.com">{contact.cta}</a>
                        </Button>
                    </div>
                </div>
            </div>
        </MarketingSection>
    );
}
