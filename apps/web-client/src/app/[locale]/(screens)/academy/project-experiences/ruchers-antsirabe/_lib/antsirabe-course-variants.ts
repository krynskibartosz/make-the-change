export type AntsirabeVariantId = 'portrait' | 'territory' | 'support'

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

// ── Slide types ──────────────────────────────────────────────────────────────

export type StorySlide = {
  id: string
  kind: 'story'
  label: string
  title: string
  body: string
  imageUrl?: string
  stat?: { value: string; label: string; note: string }
}

export type QuizOption = {
  id: string
  text: string
  correct: boolean
  feedback: string
}

export type QuizSlide = {
  id: string
  kind: 'quiz'
  label: string
  question: string
  options: QuizOption[]
}

export type SortColumn = {
  id: string
  title: string
  colorKey: 'green' | 'amber'
}

export type SortItem = {
  id: string
  text: string
  correctColumnId: string
}

export type SortSlide = {
  id: string
  kind: 'sort'
  label: string
  instruction: string
  columns: [SortColumn, SortColumn]
  items: SortItem[]
  successMessage: string
}

export type FinalSlide = {
  id: string
  kind: 'final'
  label: string
  badge: string
  title: string
  body: string
  closing: string
}

export type AntsirabeVariantSlide = StorySlide | QuizSlide | SortSlide | FinalSlide

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
  // ── Variant 1 : portrait — RÉCIT (lecture narrative) ──────────────────────
  {
    id: 'portrait',
    title: 'Andraina, 45 ruches',
    shortTitle: 'Récit',
    subtitle:
      "Le projet raconté comme un mini-documentaire terrain — pas une leçon générale sur les abeilles.",
    detail: 'Récit · 4 min',
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
        kind: 'story',
        label: 'Portrait',
        title: "Andraina gère 45 ruches autour d'Antsirabe.",
        body: "Ce n'est pas un chiffre écologique. C'est un travail : installer, observer, récolter et transmettre. Le cours part de là.",
        imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
        stat: {
          value: '45',
          label: 'ruches suivies',
          note: "Une unité concrète du projet, pas une estimation.",
        },
      },
      {
        id: 'work',
        kind: 'story',
        label: 'Terrain',
        title: "Une ruche n'est pas posée puis oubliée.",
        body: "Andraina intervient régulièrement : vérifier l'activité, repérer les signaux faibles, protéger les colonies avant les maladies et les intempéries. C'est ce suivi que le projet rend possible.",
        imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
        stat: {
          value: '395 €',
          label: 'par ruche',
          note: "Installation, équipement et première année de suivi.",
        },
      },
      {
        id: 'harvest',
        kind: 'story',
        label: 'Récolte',
        title: "Le miel d'eucalyptus raconte une saison.",
        body: "Autour d'Antsirabe, les floraisons locales déterminent ce que les abeilles rapportent. La récolte n'est pas garantie : elle dépend du paysage, de la météo et du travail d'Andraina.",
        imageUrl: '/images/products/miel-eucalyptus-ilanga.png',
      },
      {
        id: 'transmission',
        kind: 'story',
        label: 'Transmission',
        title: "Le savoir circule au-delà du rucher.",
        body: "Andraina a déjà formé d'autres apiculteurs de la région. Ce projet structure une activité locale qui existait avant lui — et qui existera après.",
        imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
      },
      {
        id: 'finish',
        kind: 'final',
        label: 'Fin',
        badge: 'Récit · Version humaine',
        title: "Ce que ce format change.",
        body: "On retient un projet, un apiculteur, une activité. Pas un cours générique sur les abeilles.",
        closing: "Le point d'entrée est Andraina — pas la pollinisation mondiale.",
      },
    ],
  },

  // ── Variant 2 : territory — QUIZ (questions interactives) ─────────────────
  {
    id: 'territory',
    title: '45 ruches, un territoire vivant',
    shortTitle: 'Quiz',
    subtitle:
      "Le projet exploré par des questions — pour tester ce qu'on comprend vraiment du terrain et des données.",
    detail: 'Quiz · 3 min',
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
        kind: 'story',
        label: 'Contexte',
        title: "Une ruche ne tient pas dans sa boîte.",
        body: "Autour d'Antsirabe, le rucher s'inscrit dans un territoire : des floraisons locales, un paysage agricole, une faune sauvage. Ce cours teste votre lecture du projet.",
        imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
        stat: {
          value: '≈ 3 km',
          label: 'rayon de butinage',
          note: "Un ordre de grandeur biologique, pas une garantie de surface.",
        },
      },
      {
        id: 'q1',
        kind: 'quiz',
        label: 'Question 1',
        question: "Quand une abeille explore jusqu'à 3 km de son rucher, que peut-on en dire ?",
        options: [
          {
            id: 'a',
            text: "Elle garantit la pollinisation de toute cette zone.",
            correct: false,
            feedback:
              "Explorer n'est pas garantir. L'abeille cherche des fleurs disponibles sans couvrir le territoire de façon uniforme.",
          },
          {
            id: 'b',
            text: "C'est un ordre de grandeur biologique, pas une preuve d'impact.",
            correct: true,
            feedback:
              "Exact. Ce rayon aide à visualiser l'échelle du projet, mais ne prouve pas que tout le territoire est amélioré.",
          },
          {
            id: 'c',
            text: "La superficie couverte est exactement 28 km².",
            correct: false,
            feedback:
              "28 km² vient du calcul d'un cercle à 3 km de rayon — c'est une estimation utile, pas une mesure directe du terrain.",
          },
          {
            id: 'd',
            text: "Les ruches voisines ne se concurrencent jamais.",
            correct: false,
            feedback:
              "Les zones de butinage de plusieurs ruches se chevauchent souvent — on ne peut pas additionner les surfaces.",
          },
        ],
      },
      {
        id: 'q2',
        kind: 'quiz',
        label: 'Question 2',
        question: "Que finance concrètement le projet à Antsirabe ?",
        options: [
          {
            id: 'a',
            text: "La protection d'un écosystème de 28 km².",
            correct: false,
            feedback:
              "C'est une extrapolation. Le projet finance des ruches et un suivi terrain — pas un territoire délimité.",
          },
          {
            id: 'b',
            text: "45 ruches, leur installation et le suivi d'Andraina.",
            correct: true,
            feedback:
              "C'est la donnée solide. Des unités concrètes avec un apiculteur dédié et un coût vérifiable.",
          },
          {
            id: 'c',
            text: "La production garantie d'au moins une tonne de miel.",
            correct: false,
            feedback:
              "La production future est une estimation — elle dépend des floraisons locales, de la météo et du travail terrain.",
          },
          {
            id: 'd',
            text: "La biodiversité de la région Vakinankaratra.",
            correct: false,
            feedback:
              "Le projet agit sur une activité apicole locale. Son lien à la biodiversité régionale reste un bénéfice potentiel, pas mesuré.",
          },
        ],
      },
      {
        id: 'q3',
        kind: 'quiz',
        label: 'Question 3',
        question: "Pourquoi distinguer données projet et ordres de grandeur ?",
        options: [
          {
            id: 'a',
            text: "Pour impressionner avec des chiffres plus grands.",
            correct: false,
            feedback:
              "C'est l'opposé du but. Distinguer les deux évite de surpromettre et rend le projet plus crédible.",
          },
          {
            id: 'b',
            text: "Parce que les ordres de grandeur ne servent à rien.",
            correct: false,
            feedback:
              "Les ordres de grandeur ont une vraie valeur pédagogique — ils aident à visualiser l'échelle. Mais ils ne prouvent pas l'impact.",
          },
          {
            id: 'c',
            text: "Parce que données mesurées et estimations n'ont pas le même statut de preuve.",
            correct: true,
            feedback:
              "45 ruches à 395 € est vérifiable. 28 km² est une estimation utile — mais pas une mesure directe.",
          },
          {
            id: 'd',
            text: "Pour cacher les estimations imprécises aux utilisateurs.",
            correct: false,
            feedback:
              "Au contraire — les montrer séparément permet de comprendre ce qu'on soutient vraiment.",
          },
        ],
      },
      {
        id: 'finish',
        kind: 'final',
        label: 'Fin',
        badge: 'Quiz · Version territoire',
        title: "Ce que ce format change.",
        body: "Le quiz force à distinguer ce qu'on sait de ce qu'on suppose. C'est ça, lire un projet sérieusement.",
        closing: "Lire les données avec rigueur, c'est respecter le projet.",
      },
    ],
  },

  // ── Variant 3 : support — TRI (classification interactive) ────────────────
  {
    id: 'support',
    title: 'Que finance une ruche ?',
    shortTitle: 'Tri',
    subtitle:
      "Le projet exploré par la classification — distinguer ce qui est financé de ce qui est estimé.",
    detail: 'Tri interactif · 4 min',
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
        kind: 'story',
        label: 'Mise en place',
        title: "395 € finance une ruche — et c'est tout ce qu'on sait avec certitude.",
        body: "Le reste dépend du terrain, des saisons et du suivi. Ce cours vous demande de trier : qu'est-ce qui est une donnée réelle ? Qu'est-ce qui est une estimation ?",
        imageUrl: '/images/products/miel-eucalyptus-ilanga.png',
        stat: {
          value: '395 €',
          label: 'par ruche',
          note: "La donnée la plus concrète du projet.",
        },
      },
      {
        id: 'sort1',
        kind: 'sort',
        label: 'Tri 1 / 2',
        instruction: "Chaque élément est-il une donnée réelle du projet ou une estimation ?",
        columns: [
          { id: 'real', title: 'Donnée réelle', colorKey: 'green' },
          { id: 'estimate', title: 'Estimation', colorKey: 'amber' },
        ],
        items: [
          { id: 's1-1', text: "45 ruches installées à Antsirabe", correctColumnId: 'real' },
          { id: 's1-2', text: "395 € investis par ruche", correctColumnId: 'real' },
          { id: 's1-3', text: "2 emplois liés au projet", correctColumnId: 'real' },
          { id: 's1-4', text: "28 km² de territoire potentiel par ruche", correctColumnId: 'estimate' },
          {
            id: 's1-5',
            text: "Des millions de fleurs visitées par saison",
            correctColumnId: 'estimate',
          },
        ],
        successMessage:
          "Les données réelles sont peu nombreuses mais solides. Les estimations sont utiles — à condition de les nommer clairement.",
      },
      {
        id: 'sort2',
        kind: 'sort',
        label: 'Tri 2 / 2',
        instruction:
          "Ce financement agit-il directement sur le projet ou génère-t-il un bénéfice possible ?",
        columns: [
          { id: 'direct', title: 'Financement direct', colorKey: 'green' },
          { id: 'indirect', title: 'Bénéfice possible', colorKey: 'amber' },
        ],
        items: [
          {
            id: 's2-1',
            text: "L'équipement apicole d'Andraina",
            correctColumnId: 'direct',
          },
          { id: 's2-2', text: "La récolte et la vente du miel", correctColumnId: 'direct' },
          { id: 's2-3', text: "Le revenu d'Andraina", correctColumnId: 'direct' },
          {
            id: 's2-4',
            text: "La pollinisation des cultures alentour",
            correctColumnId: 'indirect',
          },
          {
            id: 's2-5',
            text: "L'amélioration de la biodiversité locale",
            correctColumnId: 'indirect',
          },
        ],
        successMessage:
          "Le financement direct est clair et vérifiable. Les bénéfices possibles ont de la valeur — mais ne constituent pas des promesses.",
      },
      {
        id: 'finish',
        kind: 'final',
        label: 'Fin',
        badge: 'Tri · Version soutien',
        title: "Ce que ce format change.",
        body: "Le tri force à réfléchir. On ne reçoit plus le projet comme un exposé — on apprend à le lire.",
        closing: "Comprendre ce qu'on finance, c'est soutenir avec clarté.",
      },
    ],
  },
]

export function getAntsirabeCourseVariant(id: string): AntsirabeCourseVariant | null {
  return ANTSIRABE_COURSE_VARIANTS.find((variant) => variant.id === id) ?? null
}
