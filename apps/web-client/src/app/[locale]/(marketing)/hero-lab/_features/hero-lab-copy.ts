import type { HeroLabCopy, HeroLabLocale } from './hero-lab.types'

const heroLabCopyByLocale = {
  en: {
    nav: {
      title: 'Hero Lab',
      index: 'Index',
      farmMinerals: 'Farm Minerals',
      v1: 'V1 Manifesto',
      v3: 'V3 Community',
      awwwards: 'Awwwards',
      home: 'Main Home',
    },
    index: {
      eyebrow: 'Design Sandbox',
      title: 'Compare Hero concepts without touching production.',
      description:
        'Open Awwwards, V3 and V1 in separate tabs to compare storytelling, hierarchy and conversion signals in real context.',
      openHome: 'Open main homepage',
    },
    cards: [
      {
        id: 'farmminerals',
        href: '/hero-lab/farmminerals',
        cta: 'Open Farm Minerals',
        title: 'Farm Minerals - Pixel Clone',
        summary:
          'Exact local clone of farmminerals.com with mirrored assets, timeline behavior and original section structure.',
      },
      {
        id: 'awwwards',
        href: '/hero-lab/awwwards',
        cta: 'Open Awwwards',
        title: 'Awwwards - Full Redesign',
        summary:
          'A total visual reset inspired by Vercel-grade polish, editorial rhythm and immersive product staging.',
      },
      {
        id: 'v3',
        href: '/hero-lab/v3',
        cta: 'Open V3',
        title: 'V3 - Community Momentum',
        summary: 'Social-proof storytelling focused on belonging, movement and shared progress.',
      },
      {
        id: 'v1',
        href: '/hero-lab/v1',
        cta: 'Open V1',
        title: 'V1 - Cinematic Manifesto',
        summary: 'Emotional impact-first opening with bold typography and immersive atmosphere.',
      },
    ],
    variants: {
      v1: {
        badge: 'Cinematic Manifesto',
        title: 'Bring life back to life.',
        subtitle:
          'Every contribution restores ecosystems through verified projects and measurable impact.',
        microProof: 'Built for emotion first, then trust.',
      },
      v2: {
        badge: 'Impact Command Center',
        title: 'See your impact before you invest.',
        subtitle:
          'Understand where your money goes, how your points grow and what changes on the ground.',
        microProof: 'Built for clarity, proof and immediate action.',
      },
      v3: {
        badge: 'Community Momentum',
        title: 'The change is already in motion.',
        subtitle:
          'Join a living community transforming everyday investments into biodiversity results.',
        microProof: 'Built for belonging, momentum and social proof.',
      },
    },
  },
  fr: {
    nav: {
      title: 'Hero Lab',
      index: 'Index',
      farmMinerals: 'Farm Minerals',
      v1: 'V1 Manifeste',
      v3: 'V3 Communauté',
      awwwards: 'Awwwards',
      home: 'Home principale',
    },
    index: {
      eyebrow: 'Sandbox design',
      title: 'Comparer des concepts Hero sans toucher la production.',
      description:
        'Ouvre Awwwards, V3 et V1 dans des onglets séparés pour comparer storytelling, hiérarchie et signaux de conversion dans le contexte réel.',
      openHome: 'Voir la homepage principale',
    },
    cards: [
      {
        id: 'farmminerals',
        href: '/hero-lab/farmminerals',
        cta: 'Ouvrir Farm Minerals',
        title: 'Farm Minerals - Clone pixel',
        summary:
          'Clone local exact de farmminerals.com avec assets mirroirs, comportement scroll et structure de sections identiques.',
      },
      {
        id: 'awwwards',
        href: '/hero-lab/awwwards',
        cta: 'Ouvrir Awwwards',
        title: 'Awwwards - Refonte totale',
        summary:
          'Une direction radicale inspirée des landing pages premium 2026: profondeur, narration visuelle et motion.',
      },
      {
        id: 'v3',
        href: '/hero-lab/v3',
        cta: 'Ouvrir V3',
        title: 'V3 - Élan communautaire',
        summary: 'Storytelling orienté preuve sociale et sentiment de rejoindre un mouvement réel.',
      },
      {
        id: 'v1',
        href: '/hero-lab/v1',
        cta: 'Ouvrir V1',
        title: 'V1 - Manifeste cinématique',
        summary: 'Entrée émotionnelle forte avec typographie massive et ambiance immersive.',
      },
    ],
    variants: {
      v1: {
        badge: 'Manifeste cinématique',
        title: 'Redonnez du vivant.',
        subtitle:
          'Chaque contribution finance des projets vérifiés et recrée un impact mesurable sur le terrain.',
        microProof: "Construit pour l'émotion, puis la confiance.",
      },
      v2: {
        badge: "Centre de contrôle d'impact",
        title: "Voyez votre impact avant d'investir.",
        subtitle:
          'Comprenez où va votre contribution, combien de points vous générez et ce qui change réellement.',
        microProof: "Construit pour la clarté, la preuve et l'action.",
      },
      v3: {
        badge: 'Élan communautaire',
        title: 'Le changement est déjà lancé.',
        subtitle:
          'Rejoignez une communauté qui transforme des investissements du quotidien en résultats biodiversité.',
        microProof: "Construit pour l'appartenance et la dynamique collective.",
      },
    },
  },
  nl: {
    nav: {
      title: 'Hero Lab',
      index: 'Index',
      farmMinerals: 'Farm Minerals',
      v1: 'V1 Manifest',
      v3: 'V3 Community',
      awwwards: 'Awwwards',
      home: 'Hoofdpagina',
    },
    index: {
      eyebrow: 'Design sandbox',
      title: 'Vergelijk Hero-concepten zonder productie te wijzigen.',
      description:
        'Open Awwwards, V3 en V1 in aparte tabbladen om storytelling, hiërarchie en conversiesignalen in echte context te vergelijken.',
      openHome: 'Open hoofdpagina',
    },
    cards: [
      {
        id: 'farmminerals',
        href: '/hero-lab/farmminerals',
        cta: 'Open Farm Minerals',
        title: 'Farm Minerals - Pixel clone',
        summary:
          'Exacte lokale kloon van farmminerals.com met gemirrorde assets, scroll-gedrag en dezelfde sectiestructuur.',
      },
      {
        id: 'awwwards',
        href: '/hero-lab/awwwards',
        cta: 'Open Awwwards',
        title: 'Awwwards - Volledige redesign',
        summary:
          'Een complete visuele reset met premium art direction, cinematic depth en sterke storytelling.',
      },
      {
        id: 'v3',
        href: '/hero-lab/v3',
        cta: 'Open V3',
        title: 'V3 - Community momentum',
        summary: 'Storytelling rond sociale bewijskracht en collectieve vooruitgang.',
      },
      {
        id: 'v1',
        href: '/hero-lab/v1',
        cta: 'Open V1',
        title: 'V1 - Cinematisch manifest',
        summary: 'Emotionele eerste indruk met sterke typografie en meeslepende sfeer.',
      },
    ],
    variants: {
      v1: {
        badge: 'Cinematisch manifest',
        title: 'Breng het leven terug.',
        subtitle: 'Elke bijdrage ondersteunt geverifieerde projecten en levert meetbare impact op.',
        microProof: 'Gebouwd voor emotie, daarna vertrouwen.',
      },
      v2: {
        badge: 'Impact control center',
        title: 'Zie je impact voordat je investeert.',
        subtitle:
          'Begrijp waar je bijdrage naartoe gaat, hoeveel punten je verdient en wat er echt verandert.',
        microProof: 'Gebouwd voor helderheid, bewijs en directe actie.',
      },
      v3: {
        badge: 'Community momentum',
        title: 'De verandering is al begonnen.',
        subtitle:
          'Sluit je aan bij een community die investeringen omzet in echte biodiversiteitsresultaten.',
        microProof: 'Gebouwd voor betrokkenheid en gezamenlijke beweging.',
      },
    },
  },
} satisfies Record<HeroLabLocale, HeroLabCopy>

const isHeroLabLocale = (value: string): value is HeroLabLocale => value in heroLabCopyByLocale

export const resolveHeroLabLocale = (locale: string): HeroLabLocale =>
  isHeroLabLocale(locale) ? locale : 'en'

export const getHeroLabCopy = (locale: string): HeroLabCopy =>
  heroLabCopyByLocale[resolveHeroLabLocale(locale)]
