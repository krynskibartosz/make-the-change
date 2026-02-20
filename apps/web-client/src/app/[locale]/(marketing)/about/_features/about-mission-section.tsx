import { Target, Eye, Leaf, Heart } from 'lucide-react';
import { SectionContainer } from '@/components/ui/section-container';
import { placeholderImages } from '@/lib/placeholder-images';
import type { AboutMissionProps } from './about.types';

export function AboutMissionSection({
    title,
    heading,
    description,
    metrics,
    community,
    imageAlt,
}: AboutMissionProps) {
    return (
        <SectionContainer size="lg" className="relative">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
                <div className="space-y-8 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marketing-warning-500/10 text-marketing-warning-600 text-xs font-bold uppercase tracking-wider">
                        <Target className="h-4 w-4" />
                        {title}
                    </div>
                    <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                        {heading.line1} <br />
                        <span className="text-primary">{heading.highlight}</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-medium max-w-xl">
                        {description}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 pt-4">
                        <div className="group relative overflow-hidden p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Eye className="h-16 w-16" />
                            </div>
                            <p className="text-4xl font-black text-primary mb-1">100%</p>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
                                {metrics.transparency}
                            </p>
                        </div>
                        <div className="group relative overflow-hidden p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Leaf className="h-16 w-16" />
                            </div>
                            <p className="text-4xl font-black text-primary mb-1">+50</p>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
                                {metrics.activeProjects}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative order-1 lg:order-2">
                    <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-muted relative z-10 rotate-3 transition-transform duration-700 hover:rotate-0">
                        <img
                            src={placeholderImages.projects[0]}
                            alt={imageAlt}
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
                                    {community.title}
                                </p>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {community.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative blob behind */}
                    <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full scale-125" />
                </div>
            </div>
        </SectionContainer>
    );
}
