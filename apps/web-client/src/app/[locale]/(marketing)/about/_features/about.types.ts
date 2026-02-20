export type AboutHeroProps = {
    badge: string;
    title: string;
    intro: string;
    cards: {
        global: {
            title: string;
            subtitle: string;
        };
        nature: string;
        social: string;
    };
};

export type AboutMissionProps = {
    title: string;
    heading: {
        line1: string;
        highlight: string;
    };
    description: string;
    metrics: {
        transparency: string;
        activeProjects: string;
    };
    community: {
        title: string;
        description: string;
    };
    imageAlt: string;
};

export type AboutValuesProps = {
    sectionBadge: string;
    sectionHeading: {
        line1: string;
        highlight: string;
    };
    sectionDescription: string;
    impact: {
        title: string;
        description: string;
        metricLabel: string;
    };
    transparency: {
        title: string;
        description: string;
        verifiedLabel: string;
    };
    community: {
        title: string;
        description: string;
    };
    innovation: {
        title: string;
        description: string;
        badges: {
            ai: string;
            iot: string;
        };
    };
};

export type AboutTeamMemberProps = {
    role: string;
    badge?: string;
    quote: string;
    bio: string;
};

export type AboutTeamProps = {
    title: string;
    subtitle: string;
    gregory: AboutTeamMemberProps;
    bartosz: AboutTeamMemberProps;
};

export type AboutCtaProps = {
    badge: string;
    title: {
        line1: string;
        line2: string;
    };
    description: string;
    primary: string;
    secondary: string;
};

export type AboutViewModel = {
    hero: AboutHeroProps;
    mission: AboutMissionProps;
    values: AboutValuesProps;
    team: AboutTeamProps;
    cta: AboutCtaProps;
};
