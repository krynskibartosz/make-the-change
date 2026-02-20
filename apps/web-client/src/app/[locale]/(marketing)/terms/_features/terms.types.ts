export type TermsHeroProps = {
    badge: string;
    title: string;
    description: string;
};

export type TermsSection = {
    title: string;
    content: string;
};

export type TermsContactProps = {
    title: string;
    content: string;
    cta: string;
};

export type TermsContentProps = {
    acceptance: TermsSection;
    evolution: TermsSection;
    contact: TermsContactProps;
};

export type TermsViewModel = {
    hero: TermsHeroProps;
    content: TermsContentProps;
};
