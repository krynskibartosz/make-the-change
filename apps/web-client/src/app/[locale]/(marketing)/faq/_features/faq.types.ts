export type FaqItemConfig = {
    id: string;
    category: string;
    q: string;
    a: string;
    iconName: 'Zap' | 'Globe' | 'Sparkles' | 'ShieldCheck';
    color: string;
};

export type FaqViewModel = {
    badge: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyDescription: string;
    footerPrompt: string;
    footerCta: string;
    learnMore: string;
    items: FaqItemConfig[];
};
