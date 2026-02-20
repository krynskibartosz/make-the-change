import { Sparkles, BarChart3, Eye, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@make-the-change/core/ui';
import { SectionContainer } from '@/components/ui/section-container';
import type { AboutValuesProps } from './about.types';

export function AboutValuesSection({
    sectionBadge,
    sectionHeading,
    sectionDescription,
    impact,
    transparency,
    community,
    innovation,
}: AboutValuesProps) {
    return (
        <SectionContainer size="lg" className="relative py-24">
            <div className="mb-20 max-w-3xl mx-auto md:text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    <span>{sectionBadge}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                    {sectionHeading.line1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-marketing-gradient-mid-400">
                        {sectionHeading.highlight}
                    </span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed mx-auto">
                    {sectionDescription}
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
                            {impact.title}
                        </h3>
                        <p className="text-marketing-positive-100/80 font-medium text-lg leading-relaxed">
                            {impact.description}
                        </p>
                    </div>

                    <div className="relative z-10 flex-shrink-0 w-full md:w-auto min-w-[200px] bg-marketing-overlay-light/5 rounded-2xl border border-marketing-overlay-light/10 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center group-hover:bg-marketing-overlay-light/10 transition-colors">
                        <span className="text-5xl font-black text-marketing-positive-400 mb-2">+85%</span>
                        <span className="text-sm font-medium text-marketing-positive-200 uppercase tracking-wider">
                            {impact.metricLabel}
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
                            {transparency.title}
                        </h3>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            {transparency.description}
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
                            {transparency.verifiedLabel}
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
                        <h3 className="text-2xl font-black mb-3">{community.title}</h3>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                            {community.description}
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
                        <h3 className="text-2xl font-black mb-3">{innovation.title}</h3>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                            {innovation.description}
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 flex gap-2">
                        <Badge
                            variant="outline"
                            className="bg-marketing-accent-alt-500/10 text-marketing-accent-alt-600 border-marketing-accent-alt-200 dark:border-marketing-accent-alt-900"
                        >
                            {innovation.badges.ai}
                        </Badge>
                        <Badge
                            variant="outline"
                            className="bg-marketing-accent-alt-500/10 text-marketing-accent-alt-600 border-marketing-accent-alt-200 dark:border-marketing-accent-alt-900"
                        >
                            {innovation.badges.iot}
                        </Badge>
                    </div>
                </div>
            </div>
        </SectionContainer>
    );
}
