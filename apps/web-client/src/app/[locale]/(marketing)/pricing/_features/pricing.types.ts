export type PricingTierFeature = string;

export type PricingTier = {
    title: string;
    price: string;
    perMonth: string;
    description: string;
    features: PricingTierFeature[];
    cta: string;
};

export type PricingHeroProps = {
    title: string;
    subtitle: string;
};

export type PricingTiersProps = {
    sectionTitle: string;
    explorer: PricingTier;
    protector: PricingTier & { badge: string };
    ambassador: PricingTier;
};

export type PricingViewModel = {
    hero: PricingHeroProps;
    tiers: PricingTiersProps;
};
