export type AntsirabeVariantId = 'portrait' | 'territory' | 'support'

export type VariantIconId =
  | 'banknote'
  | 'boxes'
  | 'check'
  | 'compass'
  | 'flower'
  | 'handshake'
  | 'map'
  | 'route'
  | 'shield'
  | 'sprout'
  | 'user'

export type VariantTheme = {
  text: string
  mutedText: string
  border: string
  surface: string
  button: string
  buttonShadow: string
  glow: string
  progress: string
}

export type VariantMetric = {
  value: string
  label: string
  note: string
}

export type VariantCard = {
  icon: VariantIconId
  title: string
  body: string
  metric?: string
}

export type VariantFlowStep = {
  icon: VariantIconId
  title: string
  body: string
}

export type VariantColumn = {
  title: string
  items: string[]
}

export type AntsirabeVariantSlide =
  | {
      id: string
      kind: 'hero'
      label: string
      title: string
      body: string
      imageUrl: string
      metric: VariantMetric
    }
  | {
      id: string
      kind: 'cards'
      label: string
      title: string
      body: string
      prompt: string
      cards: VariantCard[]
    }
  | {
      id: string
      kind: 'flow'
      label: string
      title: string
      body: string
      steps: VariantFlowStep[]
    }
  | {
      id: string
      kind: 'compare'
      label: string
      title: string
      body: string
      columns: VariantColumn[]
      closing: string
    }
  | {
      id: string
      kind: 'final'
      label: string
      title: string
      body: string
      cards: VariantCard[]
      closing: string
    }

export type AntsirabeCourseVariant = {
  id: AntsirabeVariantId
  title: string
  shortTitle: string
  subtitle: string
  detail: string
  imageUrl: string
  href: string
  projectHref: string
  theme: VariantTheme
  slides: AntsirabeVariantSlide[]
}

const projectHref = '/projects/ruchers-apiculteurs-independants-antsirabe'

export const ANTSIRABE_COURSE_VARIANTS: AntsirabeCourseVariant[] = [
  {
    id: 'portrait',
    title: 'Andraina, 45 ruches',
    shortTitle: 'Version humaine',
    subtitle:
      'Le projet raconté par le travail de terrain, pas par une leçon générale sur les abeilles.',
    detail: 'Prototype · 3 min',
    imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
    href: '/academy/project-experiences/ruchers-antsirabe/variants/portrait',
    projectHref,
    theme: {
      text: 'text-emerald-200',
      mutedText: 'text-emerald-100/65',
      border: 'border-emerald-300/18',
      surface: 'bg-emerald-300/[0.075]',
      button: 'bg-emerald-400 text-[#04110e]',
      buttonShadow: 'shadow-[0_5px_0_#047857]',
      glow: 'bg-[radial-gradient(circle,rgba(52,211,153,0.24),transparent_60%)]',
      progress: 'rgba(52,211,153,0.95)',
    },
    slides: [
      {
        id: 'hook',
        kind: 'hero',
        label: 'Portrait',
        title: "Ici, le sujet n'est pas seulement l'abeille.",
        body: "C'est Andraina, son assistant, 45 ruches autour d'Antsirabe et une activité apicole locale que le projet aide à structurer.",
        imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
        metric: {
          value: '45',
          label: 'ruches suivies',
          note: 'Une unité concrète du projet, pas une estimation écologique.',
        },
      },
      {
        id: 'work',
        kind: 'cards',
        label: 'Travail',
        title: 'Le rucher vit parce que quelqu’un le suit.',
        body: "Une ruche n'est pas posée puis oubliée. Le cours teste ici une approche plus humaine : montrer ce qui se passe entre le soutien et le miel.",
        prompt: 'Touche une carte pour révéler le rôle du terrain.',
        cards: [
          {
            icon: 'boxes',
            title: 'Installer',
            body: 'Matériel, emplacement, protection et mise en place progressive des colonies.',
            metric: '395 € / ruche',
          },
          {
            icon: 'shield',
            title: 'Suivre',
            body: "Observer l'activité, repérer les signaux faibles et intervenir quand la colonie en a besoin.",
          },
          {
            icon: 'flower',
            title: 'Lire les floraisons',
            body: "Le miel d'eucalyptus raconte aussi ce que les abeilles trouvent autour du rucher.",
          },
          {
            icon: 'handshake',
            title: 'Transmettre',
            body: "Le savoir-faire peut circuler : Andraina a déjà formé d'autres apiculteurs de la région.",
          },
        ],
      },
      {
        id: 'chain',
        kind: 'flow',
        label: 'Chaîne',
        title: 'Le projet relie humains, ruches et valorisation.',
        body: "Cette version fait comprendre le projet comme une chaîne de soin et de débouchés, plutôt que comme une preuve automatique d'impact.",
        steps: [
          {
            icon: 'handshake',
            title: 'Ilanga Nature équipe',
            body: 'Les ruches et le cadre apicole viennent soutenir une activité locale existante.',
          },
          {
            icon: 'user',
            title: 'Andraina suit',
            body: 'Le travail terrain reste central : observation, récolte, décisions et transmission.',
          },
          {
            icon: 'sprout',
            title: 'Le paysage nourrit',
            body: 'Les floraisons disponibles autour du rucher déterminent une partie de la récolte.',
          },
          {
            icon: 'check',
            title: 'Le miel valorise',
            body: 'La production donne une sortie économique lisible, sans résumer tout le vivant à un pot.',
          },
        ],
      },
      {
        id: 'finish',
        kind: 'final',
        label: 'Synthèse',
        title: 'Ce que cette version fait mieux.',
        body: 'Elle rend le cours très spécifique à Antsirabe : on retient un projet, un apiculteur, une activité et une responsabilité de terrain.',
        cards: [
          {
            icon: 'user',
            title: 'Plus incarné',
            body: 'Le point d’entrée devient Andraina, pas une notion générique sur les abeilles.',
          },
          {
            icon: 'boxes',
            title: 'Plus concret',
            body: 'La ruche est présentée comme une unité de projet avec un prix et un suivi.',
          },
          {
            icon: 'shield',
            title: 'Plus prudent',
            body: 'On distingue activité soutenue et impact écologique estimé.',
          },
        ],
        closing: 'Angle testé : un mini-documentaire projet, chaleureux et très identifiable.',
      },
    ],
  },
  {
    id: 'territory',
    title: '45 ruches, un territoire vivant',
    shortTitle: 'Version territoire',
    subtitle:
      "Le projet raconté par l'espace, les floraisons et les limites des ordres de grandeur.",
    detail: 'Prototype · 4 min',
    imageUrl: '/images/projects/miellerie-manakara.jpg',
    href: '/academy/project-experiences/ruchers-antsirabe/variants/territory',
    projectHref,
    theme: {
      text: 'text-lime-200',
      mutedText: 'text-lime-100/60',
      border: 'border-lime-300/18',
      surface: 'bg-lime-300/[0.07]',
      button: 'bg-lime-300 text-[#102006]',
      buttonShadow: 'shadow-[0_5px_0_#4d7c0f]',
      glow: 'bg-[radial-gradient(circle,rgba(190,242,100,0.22),transparent_60%)]',
      progress: 'rgba(190,242,100,0.95)',
    },
    slides: [
      {
        id: 'hook',
        kind: 'hero',
        label: 'Territoire',
        title: 'Une ruche ne tient pas dans sa boîte.',
        body: "Autour d'Antsirabe, le rucher aide à visualiser un réseau local : floraisons, cultures, abeilles, météo et saisons.",
        imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
        metric: {
          value: '≈ 28 km²',
          label: 'zone potentielle par ruche',
          note: 'Les zones se chevauchent : ce n’est pas une surface gagnée.',
        },
      },
      {
        id: 'layers',
        kind: 'cards',
        label: 'Couches',
        title: 'Le bon sujet devient le paysage autour des ruches.',
        body: "Cette variante garde l'émerveillement, mais elle le rattache davantage au site et aux ressources florales locales.",
        prompt: 'Choisis une couche du territoire.',
        cards: [
          {
            icon: 'map',
            title: 'Le site',
            body: "Un rucher localisé autour d'Antsirabe, avec 45 ruches déclarées dans le projet.",
            metric: 'Antsirabe',
          },
          {
            icon: 'flower',
            title: 'Les floraisons',
            body: "L'eucalyptus est le miel mis en avant aujourd'hui, mais les floraisons varient selon les saisons.",
          },
          {
            icon: 'compass',
            title: 'Le rayon',
            body: 'Les abeilles peuvent explorer plusieurs kilomètres quand les ressources proches ne suffisent pas.',
          },
          {
            icon: 'shield',
            title: 'La prudence',
            body: 'Les chiffres aident à comprendre une échelle, pas à mesurer directement ton impact.',
          },
        ],
      },
      {
        id: 'proof',
        kind: 'compare',
        label: 'Preuves',
        title: 'Tout n’a pas le même statut.',
        body: 'Cette version peut devenir très crédible si elle apprend à lire les données sans surpromettre.',
        columns: [
          {
            title: 'Données projet',
            items: ['45 ruches', '395 € par ruche', 'Ilanga Nature', 'Antsirabe'],
          },
          {
            title: 'Ordres de grandeur',
            items: [
              'Rayon de butinage',
              'Visites florales',
              'Production future',
              'Variations saisonnières',
            ],
          },
        ],
        closing:
          'Le message devient : ce rucher rend visible une échelle vivante, pas une preuve totale.',
      },
      {
        id: 'finish',
        kind: 'final',
        label: 'Synthèse',
        title: 'Ce que cette version fait mieux.',
        body: "Elle évite le cours générique en posant une question très Make the Change : comment un projet local s'inscrit dans un territoire ?",
        cards: [
          {
            icon: 'map',
            title: 'Plus spatial',
            body: 'On comprend où le projet agit et pourquoi le paysage compte.',
          },
          {
            icon: 'flower',
            title: 'Plus vivant',
            body: 'Les floraisons deviennent le personnage principal avec les abeilles.',
          },
          {
            icon: 'shield',
            title: 'Plus crédible',
            body: 'Les estimations sont visibles comme estimations.',
          },
        ],
        closing: 'Angle testé : une carte sensible du territoire, plus écologique que biologique.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Que finance une ruche ?',
    shortTitle: 'Version soutien',
    subtitle:
      'Le projet raconté par le budget, les unités financées et le passage vers le terrain.',
    detail: 'Prototype · 3 min',
    imageUrl: '/images/products/miel-eucalyptus-ilanga.png',
    href: '/academy/project-experiences/ruchers-antsirabe/variants/support',
    projectHref,
    theme: {
      text: 'text-amber-200',
      mutedText: 'text-amber-100/62',
      border: 'border-amber-300/20',
      surface: 'bg-amber-300/[0.075]',
      button: 'bg-amber-300 text-[#201400]',
      buttonShadow: 'shadow-[0_5px_0_#b45309]',
      glow: 'bg-[radial-gradient(circle,rgba(252,211,77,0.22),transparent_60%)]',
      progress: 'rgba(252,211,77,0.95)',
    },
    slides: [
      {
        id: 'hook',
        kind: 'hero',
        label: 'Soutien',
        title: "Une ruche n'est pas juste un symbole.",
        body: 'Pour Antsirabe, la donnée la plus spécifique est simple : 45 ruches à 395 €. Cette version part de là.',
        imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
        metric: {
          value: '395 €',
          label: 'par ruche',
          note: 'Donnée projet utilisée comme unité de soutien concrète.',
        },
      },
      {
        id: 'budget',
        kind: 'cards',
        label: 'Budget',
        title: 'Le cours devient une lecture du projet.',
        body: 'Au lieu de demander “que font les abeilles ?”, cette variante demande “qu’est-ce qui est réellement financé ?”.',
        prompt: 'Compare les unités du projet.',
        cards: [
          {
            icon: 'banknote',
            title: '1 ruche',
            body: 'Une unité simple à comprendre et à relier au terrain.',
            metric: '395 €',
          },
          {
            icon: 'boxes',
            title: '45 ruches',
            body: 'Le volume actuel du projet Antsirabe.',
            metric: '17 775 €',
          },
          {
            icon: 'user',
            title: '2 emplois',
            body: 'Une donnée sociale projet à garder séparée des estimations écologiques.',
            metric: 'terrain',
          },
          {
            icon: 'flower',
            title: 'Miel',
            body: "La récolte donne une valorisation visible, notamment autour de l'eucalyptus.",
          },
        ],
      },
      {
        id: 'from-support-to-field',
        kind: 'flow',
        label: 'Terrain',
        title: 'Du soutien à la ruche, il y a plusieurs étapes.',
        body: "Cette version rend l'action plus lisible sans promettre que chaque euro produit un effet écologique exact.",
        steps: [
          {
            icon: 'banknote',
            title: 'Soutien',
            body: 'Le projet rassemble un budget autour d’unités concrètes.',
          },
          {
            icon: 'boxes',
            title: 'Équipement',
            body: 'La ruche devient du matériel et un cadre de production apicole.',
          },
          {
            icon: 'user',
            title: 'Suivi',
            body: 'L’apiculteur observe, entretient et récolte au bon moment.',
          },
          {
            icon: 'check',
            title: 'Valorisation',
            body: 'Le miel et le suivi terrain rendent le projet compréhensible et vérifiable progressivement.',
          },
        ],
      },
      {
        id: 'finish',
        kind: 'final',
        label: 'Synthèse',
        title: 'Ce que cette version fait mieux.',
        body: "Elle aide l'utilisateur à comprendre ce qu'il soutient vraiment, sans transformer l'Academy en tableau d'impact.",
        cards: [
          {
            icon: 'banknote',
            title: 'Plus actionnable',
            body: 'Le lien entre argent, ruche et projet devient immédiat.',
          },
          {
            icon: 'check',
            title: 'Plus transparent',
            body: 'On sépare données réelles, estimations et suivi futur.',
          },
          {
            icon: 'route',
            title: 'Plus utile',
            body: 'La sortie naturelle devient “voir le projet” ou “soutenir”.',
          },
        ],
        closing:
          'Angle testé : une expérience de compréhension du soutien, simple et très concrète.',
      },
    ],
  },
]

export function getAntsirabeCourseVariant(id: string): AntsirabeCourseVariant | null {
  return ANTSIRABE_COURSE_VARIANTS.find((variant) => variant.id === id) ?? null
}
