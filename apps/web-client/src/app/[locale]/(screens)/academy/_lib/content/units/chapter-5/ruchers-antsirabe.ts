import type { AcademyUnitDefinition } from '../../../schema'

const HIVE_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop'
const BEE_IMAGE = 'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?q=80&w=1000&auto=format&fit=crop'
const FLOWER_IMAGE = 'https://images.unsplash.com/photo-1490750967868-88df5691b9db?q=80&w=1000&auto=format&fit=crop'

export const ruchersAntsirabeUnit: AcademyUnitDefinition = {
  id: 'unit-5-4',
  slug: 'ruchers-antsirabe',
  chapterId: 'chapter-5',
  schemaVersion: 2,
  title: 'Une ruche, tout un réseau vivant',
  shortTitle: 'Ruche vivante',
  pathLabel: 'Ruche',
  subtitle: "L'abeille ne sait pas qu'elle pollinise. Pourtant, sans elle, fraises, amandes et avocats disparaîtraient.",
  concept: "Les ruchers d'apiculteurs indépendants comme réseau vivant de pollinisation.",
  conceptIds: ['accidental-pollination', 'waggle-dance', 'hive-as-superorganism'],
  kind: 'project',
  iconKey: 'bee',
  masteryGoal: "Expliquer pourquoi la pollinisation est un accident milliardaire — et ce que ça implique pour la biodiversité.",
  order: 4,
  durationMinutes: 4,
  estimatedMinutes: '3-4 min',
  learningGoal: "Comprendre les 3 faits contre-intuitifs sur les abeilles : l'accident, la danse GPS, et le coût invisible.",
  mascot: 'melli',
  rewardAmount: 70,

  // ─── Discovery (12 exercices) ────────────────────────────────────────────────
  // Bloc 1 (1-5) : l'accident milliardaire
  // Bloc 2 (6-9) : la danse GPS
  // Bloc 3 (10-12) : le coût invisible + synthèse

  authoredDiscovery: [
    // 1 — STORY hook
    {
      id: 'c5-ra-disc-1',
      type: 'STORY',
      conceptId: 'accidental-pollination',
      difficulty: 'easy',
      cognitiveTags: ['hook'],
      learningObjective: "Déclencher la curiosité : l'abeille ne sait pas ce qu'elle fait.",
      screens: [
        {
          text: "Une abeille ne sait pas qu'elle pollinise. Elle cherche juste à manger. Le reste, c'est un accident.",
          imagePrompt: 'Gros plan abeille couverte de pollen jaune sur fleur eucalyptus, lumière chaude',
          imageUrl: BEE_IMAGE,
          kind: 'hook',
          boldTokens: ['un accident'],
        },
      ],
    },

    // 2 — SWIPE pre-test (idée reçue)
    {
      id: 'c5-ra-disc-2',
      type: 'SWIPE',
      conceptId: 'accidental-pollination',
      difficulty: 'easy',
      cognitiveTags: ['pre-test', 'misconception'],
      learningObjective: "Révéler que la pollinisation n'est pas intentionnelle.",
      question: 'Vrai ou faux ?',
      card: {
        title: 'Les abeilles pollinisent intentionnellement les fleurs.',
        subtitle: 'Idée reçue',
        imagePrompt: 'Abeille sur fleur avec pollen visible sur pattes',
      },
      correctDirection: 'left',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "L'abeille veut du nectar, pas polliner. Le pollen colle à son corps par accident.",
      incorrectFeedback: "Non — l'abeille se fiche des fleurs. Elle veut le nectar. La pollinisation est un effet de bord.",
      explanation: "L'abeille s'enfonce dans la fleur pour atteindre le nectar. Le pollen colle à ses poils sans qu'elle le décide.",
      misconceptionId: 'intentional-pollination',
    },

    // 3 — STORY reveal
    {
      id: 'c5-ra-disc-3',
      type: 'STORY',
      conceptId: 'accidental-pollination',
      difficulty: 'easy',
      cognitiveTags: ['reveal'],
      learningObjective: "Comprendre le mécanisme concret de l'accident pollinisateur.",
      screens: [
        {
          text: "L'abeille plonge dans la fleur pour le nectar. Le pollen colle à ses poils. Fleur suivante : il en tombe. Fécondation.",
          imagePrompt: 'Abeille enfoncée dans une fleur, pollen orange sur pattes et abdomen, fond flou',
          imageUrl: FLOWER_IMAGE,
          kind: 'reveal',
          boldTokens: ['Le pollen colle'],
        },
      ],
    },

    // 4 — QUIZ generation (aliments)
    {
      id: 'c5-ra-disc-4',
      type: 'QUIZ',
      conceptId: 'accidental-pollination',
      difficulty: 'easy',
      cognitiveTags: ['generation'],
      learningObjective: "Distinguer les aliments pollinisés par les abeilles de ceux pollinisés par le vent.",
      question: "Lequel de ces aliments n'a PAS besoin des abeilles pour exister ?",
      options: [
        {
          text: 'Le riz',
          isCorrect: true,
          feedback: 'Exact. Le riz est pollinisé par le vent — comme le blé et le maïs. Les abeilles ne jouent aucun rôle.',
        },
        {
          text: 'Les amandes',
          isCorrect: false,
          feedback: "Les amandiers dépendent à 100% des abeilles. Sans elles, zéro récolte possible.",
        },
        {
          text: 'Le café',
          isCorrect: false,
          feedback: "Le caféier peut s'autopolliniser, mais les abeilles augmentent les rendements de 20 à 50 %. Sans elles, la récolte souffrirait — pas disparaîtrait.",
        },
        {
          text: 'Les fraises',
          isCorrect: false,
          feedback: 'Les fraises pollinisées par les abeilles sont bien plus grosses et mieux formées.',
        },
      ],
    },

    // 5 — SWIPE misconception (contre-intuitif : on survivrait)
    {
      id: 'c5-ra-disc-5',
      type: 'SWIPE',
      conceptId: 'accidental-pollination',
      difficulty: 'medium',
      cognitiveTags: ['misconception'],
      learningObjective: "Comprendre que les céréales de base (riz, blé) ne dépendent pas des abeilles.",
      question: 'Vrai ou faux ?',
      card: {
        title: 'Sans abeilles, on mangerait quand même à notre faim.',
        subtitle: '🧠 Idée contre-intuitive',
        imagePrompt: 'Champ de riz en terrasse, Asie du Sud-Est, lumière dorée',
      },
      correctDirection: 'right',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: 'Riz, blé, maïs — les calories de base — sont pollinisés par le vent. On survivrait.',
      incorrectFeedback: "Paradoxalement vrai : riz, blé et maïs n'ont pas besoin des abeilles. On perdrait les saveurs.",
      explanation: "On perdrait fraises, amandes, avocats, pommes. Le café souffrirait fortement (−20 à 50 % de rendement). Les calories de base (riz, blé) survivraient.",
    },

    // 6 — STORY build-up (intro danse)
    {
      id: 'c5-ra-disc-6',
      type: 'STORY',
      conceptId: 'waggle-dance',
      difficulty: 'medium',
      cognitiveTags: ['reveal'],
      learningObjective: "Découvrir que les abeilles ont un langage gestuel codé.",
      screens: [
        {
          text: "Une butineuse rentre dans la ruche. Elle commence à danser. Ce n'est pas de l'excitation — c'est un message.",
          imagePrompt: "Abeille dansant sur un rayon de cire, entourée d'autres abeilles qui l'observent",
          imageUrl: HIVE_IMAGE,
          kind: 'build-up',
          boldTokens: ["c'est un message"],
        },
      ],
    },

    // 7 — DRAG_DROP horizontal : voyage de l'information
    {
      id: 'c5-ra-disc-7',
      type: 'DRAG_DROP',
      conceptId: 'waggle-dance',
      difficulty: 'medium',
      cognitiveTags: ['generation'],
      learningObjective: "Comprendre comment la danse encode et diffuse l'information dans la ruche.",
      instruction: "Ordonne le voyage de l'information.",
      axis: 'horizontal',
      axisRationale: "Chronologie : de la découverte individuelle jusqu'à l'action collective déclenchée.",
      slotCount: 4,
      items: [
        { id: 'c5-ra-disc-7-a', text: '🌸 Fleur repérée à 2 km' },
        { id: 'c5-ra-disc-7-b', text: '🏠 Retour dans la ruche' },
        { id: 'c5-ra-disc-7-c', text: '💃 Danse codée (angle + durée)' },
        { id: 'c5-ra-disc-7-d', text: '🐝 300 abeilles s\'envolent' },
      ],
      correctFeedback: 'Exact. Une découverte individuelle devient action collective. La ruche est un cerveau distribué.',
      incorrectFeedback: "L'ordre : découverte → retour → danse → envol. L'information voyage de l'une vers toutes.",
    },

    // 8 — SWIPE sprint (danse encode 2 infos)
    {
      id: 'c5-ra-disc-8',
      type: 'SWIPE',
      conceptId: 'waggle-dance',
      difficulty: 'medium',
      cognitiveTags: ['sprint'],
      learningObjective: "Ancrer la double précision de la danse frétillante.",
      question: 'Vrai ou faux ?',
      card: {
        title: "La danse d'une abeille encode à la fois la direction et la distance.",
        subtitle: '⚡ Sprint',
        imagePrompt: 'Abeille en pleine danse frétillante sur un cadre de ruche, autres abeilles autour',
      },
      correctDirection: 'right',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Exact. Angle = direction par rapport au soleil. Durée = distance. Un GPS biologique.",
      incorrectFeedback: "Si ! Angle → direction, durée → distance. Une abeille peut indiquer une fleur à 2 km près.",
      explanation: "La danse frétillante encode angle (direction/soleil) et durée (≈ distance). C'est un langage symbolique — Karl von Frisch, Nobel 1973.",
    },

    // 9 — SWIPE sprint (coût du miel)
    {
      id: 'c5-ra-disc-9',
      type: 'SWIPE',
      conceptId: 'hive-as-superorganism',
      difficulty: 'medium',
      cognitiveTags: ['sprint'],
      learningObjective: "Mémoriser le coût de production collectif d'un pot de miel.",
      question: 'Vrai ou faux ?',
      card: {
        title: "Pour un pot de 500g de miel, les abeilles volent l'équivalent de 2 fois le tour de la Terre.",
        subtitle: '⚡ Sprint',
        imagePrompt: 'Pot de miel artisanal sur fond naturel, lumière chaude',
      },
      correctDirection: 'right',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Exact. ~80 000 km de vol collectif pour 500g. Le miel, c'est du travail pur.",
      incorrectFeedback: "Si ! 80 000 km de vol collectif pour un seul pot. Ce chiffre change la perception du miel.",
      explanation: "Pour 500g de miel : 2 millions de fleurs visitées, ~80 000 km de vol collectif — soit 2 fois le tour du globe.",
    },

    // 10 — QUIZ metacognition
    {
      id: 'c5-ra-disc-10',
      type: 'QUIZ',
      conceptId: 'accidental-pollination',
      difficulty: 'medium',
      cognitiveTags: ['metacognition'],
      learningObjective: "Ancrer la portée philosophique de l'accident de pollinisation.",
      question: "Pourquoi dire que la pollinisation est 'accidentelle' change notre regard ?",
      options: [
        {
          text: "Parce que ça montre que la nature crée de l'ordre vital — sans intention d'aucune sorte.",
          isCorrect: true,
          feedback: "Exact. Pas de plan, pas de conscience — juste des interactions qui créent de la vie à grande échelle.",
        },
        {
          text: "Parce que les abeilles sont moins importantes qu'on le croyait.",
          isCorrect: false,
          feedback: "C'est l'inverse. L'accident rend leur rôle encore plus fragile et précieux — pas moins.",
        },
        {
          text: "Parce que ça prouve que les abeilles sont des insectes simples.",
          isCorrect: false,
          feedback: "Non. Elles ont un langage GPS, une organisation collective complexe — elles sont remarquables.",
        },
        {
          text: "Parce que le miel n'est pas vraiment naturel.",
          isCorrect: false,
          feedback: "La nature du miel n'est pas en cause ici — c'est la pollinisation qui est accidentelle.",
        },
      ],
    },

    // 11 — DRAG_DROP : aliments qui dépendent des abeilles
    {
      id: 'c5-ra-disc-11',
      type: 'DRAG_DROP',
      conceptId: 'accidental-pollination',
      difficulty: 'medium',
      cognitiveTags: ['generation'],
      learningObjective: "Distinguer les aliments pollinisés par les abeilles de ceux pollinisés par le vent.",
      instruction: 'Quels aliments disparaîtraient sans abeilles ?',
      axis: 'horizontal',
      axisRationale: "Tri : identifier les aliments dépendants des abeilles parmi les propositions.",
      slotCount: 3,
      items: [
        { id: 'c5-ra-disc-11-a', text: '🍎 Pommes' },
        { id: 'c5-ra-disc-11-b', text: '🍓 Fraises' },
        { id: 'c5-ra-disc-11-c', text: '🌰 Amandes' },
        { id: 'c5-ra-disc-11-d', text: '🍚 Riz', isDistractor: true },
        { id: 'c5-ra-disc-11-e', text: '🌾 Blé', isDistractor: true },
      ],
      correctFeedback: "Exact. Pommes, fraises, amandes dépendent des abeilles. Riz et blé sont pollinisés par le vent.",
      incorrectFeedback: "Riz et blé sont pollinisés par le vent — pas besoin d'abeilles. Pommes, fraises et amandes, si.",
    },

    // 12 — QUIZ closure
    {
      id: 'c5-ra-disc-12',
      type: 'QUIZ',
      conceptId: 'hive-as-superorganism',
      difficulty: 'medium',
      cognitiveTags: ['closure'],
      learningObjective: "Synthétiser ce que la ruche fait vraiment dans son territoire.",
      question: "Qu'est-ce qu'une ruche change concrètement dans son territoire ?",
      options: [
        {
          text: "Elle transforme la faim de 60 000 individus en réseau de pollinisation — sans plan.",
          isCorrect: true,
          feedback: "Exact. La faim collective devient service écologique. Sans intention, sans conscience.",
        },
        {
          text: "Elle produit du miel pour les humains.",
          isCorrect: false,
          feedback: "Le miel est un résultat visible — pas ce que la ruche 'fait' vraiment dans l'écosystème.",
        },
        {
          text: "Elle protège les fleurs des prédateurs.",
          isCorrect: false,
          feedback: "Non. Les abeilles visitent les fleurs par intérêt personnel — pas pour les protéger.",
        },
        {
          text: "Elle régule la température de son environnement.",
          isCorrect: false,
          feedback: "La ruche régule sa propre température interne — pas celle de son environnement.",
        },
      ],
    },
  ],

  // ─── Pool (8 exercices) ───────────────────────────────────────────────────────

  pool: [
    // pool-1 : 1/12 cuillère à café
    {
      id: 'c5-ra-pool-1',
      type: 'SWIPE',
      conceptId: 'hive-as-superorganism',
      difficulty: 'easy',
      cognitiveTags: ['sprint'],
      learningObjective: "Mémoriser la production d'une abeille par vie — et comprendre le collectif.",
      question: 'Vrai ou faux ?',
      card: {
        title: "Une abeille produit 1/12 de cuillère à café de miel dans toute sa vie.",
        subtitle: '⚡ Sprint',
        imagePrompt: 'Abeille ouvrière sur un rayon de cire doré, lumière chaude',
      },
      correctDirection: 'right',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Exact. Une vie entière — 6 semaines — pour 1/12 de cuillère à café. Puis elle meurt.",
      incorrectFeedback: "Si ! 1/12 de cuillère à café. Une vie entière d'ouvrière pour ça. La ruche tient par le nombre.",
      explanation: "Une ouvrière vit ~6 semaines en été et produit 1/12 de cuillère à café de miel. La ruche tient par le collectif de 60 000.",
    },

    // pool-2 : pourquoi l'ouvrière vit si peu
    {
      id: 'c5-ra-pool-2',
      type: 'QUIZ',
      conceptId: 'hive-as-superorganism',
      difficulty: 'medium',
      cognitiveTags: ['generation'],
      learningObjective: "Comprendre pourquoi une ouvrière vit si peu.",
      question: "Pourquoi une ouvrière vit-elle seulement 6 semaines en été ?",
      options: [
        {
          text: "Elle s'use littéralement : ses ailes s'abîment après ~800 km de vol.",
          isCorrect: true,
          feedback: "Exact. Les ailes s'usent. L'abeille ne peut plus butiner — et meurt. Elle se consume pour la ruche.",
        },
        {
          text: "Elle est tuée par les mâles pour faire de la place.",
          isCorrect: false,
          feedback: "C'est l'inverse : les faux-bourdons sont chassés à l'automne, pas les ouvrières.",
        },
        {
          text: "La reine la remplace systématiquement.",
          isCorrect: false,
          feedback: "La reine pond de nouveaux œufs, mais ne 'remplace' pas les ouvrières individuellement.",
        },
        {
          text: "Elle manque de nourriture en fin d'été.",
          isCorrect: false,
          feedback: "Non. C'est l'usure physique qui la tue — pas la faim. Elle vole jusqu'à ne plus pouvoir.",
        },
      ],
    },

    // pool-3 : blé et riz survivent sans abeilles
    {
      id: 'c5-ra-pool-3',
      type: 'SWIPE',
      conceptId: 'accidental-pollination',
      difficulty: 'medium',
      cognitiveTags: ['misconception'],
      learningObjective: "Consolider que les céréales de base ne dépendent pas des abeilles.",
      question: 'Vrai ou faux ?',
      card: {
        title: "Sans abeilles, le blé et le riz disparaîtraient aussi.",
        subtitle: '🧠 Idée reçue',
        imagePrompt: 'Champ de blé doré au soleil, épis bien formés',
      },
      correctDirection: 'left',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Faux. Blé, riz, maïs sont pollinisés par le vent. On survivrait — mais sans fraises ni amandes.",
      incorrectFeedback: "Blé et riz n'ont pas besoin des abeilles. Ils sont pollinisés par le vent depuis des millions d'années.",
      explanation: "Les céréales (riz, blé, maïs) sont anémophiles — pollinisées par le vent. Les abeilles ne jouent aucun rôle là-dedans.",
    },

    // pool-4 : vote d'essaimage
    {
      id: 'c5-ra-pool-4',
      type: 'QUIZ',
      conceptId: 'hive-as-superorganism',
      difficulty: 'medium',
      cognitiveTags: ['generation'],
      learningObjective: "Comprendre que les abeilles prennent des décisions collectives par vote.",
      question: "Comment une ruche choisit-elle son nouveau logement lors d'un essaimage ?",
      options: [
        {
          text: "Des éclaireuses visitent les sites et 'votent' en dansant pour le meilleur.",
          isCorrect: true,
          feedback: "Exact. Chaque éclaireuse danse pour son site. Celle qui convainc le plus gagne. C'est un vote.",
        },
        {
          text: "La reine choisit seule l'emplacement.",
          isCorrect: false,
          feedback: "Non. La reine suit les ouvrières — elle ne choisit pas. C'est une décision collective.",
        },
        {
          text: "C'est le hasard : la ruche part dans la première direction venue.",
          isCorrect: false,
          feedback: "Non. C'est un processus délibéré. Les éclaireuses explorent et rapportent de l'information.",
        },
        {
          text: "L'apiculteur choisit le nouvel emplacement.",
          isCorrect: false,
          feedback: "L'apiculteur peut récupérer un essaim, mais le choix de l'emplacement vient de la ruche elle-même.",
        },
      ],
    },

    // pool-5 : pommes myrtilles avocat vs maïs pain
    {
      id: 'c5-ra-pool-5',
      type: 'DRAG_DROP',
      conceptId: 'accidental-pollination',
      difficulty: 'medium',
      cognitiveTags: ['generation'],
      learningObjective: "Consolider la distinction aliments-abeilles vs aliments-vent.",
      instruction: 'Quels aliments disparaîtraient sans abeilles ?',
      axis: 'horizontal',
      axisRationale: "Tri : identifier les aliments dépendants des abeilles parmi les propositions.",
      slotCount: 3,
      items: [
        { id: 'c5-ra-pool-5-a', text: '🍎 Pommes' },
        { id: 'c5-ra-pool-5-b', text: '🥑 Avocat' },
        { id: 'c5-ra-pool-5-c', text: '🫐 Myrtilles' },
        { id: 'c5-ra-pool-5-d', text: '🌽 Maïs', isDistractor: true },
        { id: 'c5-ra-pool-5-e', text: '🍞 Pain (blé)', isDistractor: true },
      ],
      correctFeedback: "Exact. Pommes, avocat, myrtilles dépendent des abeilles. Maïs et blé sont pollinisés par le vent.",
      incorrectFeedback: "Maïs et blé sont pollinisés par le vent. Pommes, avocat et myrtilles ont besoin des abeilles.",
    },

    // pool-6 : miel = régurgité (surprise)
    {
      id: 'c5-ra-pool-6',
      type: 'SWIPE',
      conceptId: 'hive-as-superorganism',
      difficulty: 'medium',
      cognitiveTags: ['misconception'],
      learningObjective: "Comprendre que le miel est un produit collectif transformé par régurgitations.",
      question: 'Vrai ou faux ?',
      card: {
        title: "Le miel est simplement du nectar séché dans les alvéoles.",
        subtitle: '🧠 Idée reçue',
        imagePrompt: 'Cadre de miel operculé, cire blanche brillante, lumière chaude',
      },
      correctDirection: 'left',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Non : le nectar est régurgité et partagé entre des milliers d'abeilles avant d'être stocké.",
      incorrectFeedback: "Non — le miel est du nectar transformé par régurgitations successives entre abeilles, puis ventilé.",
      explanation: "Le nectar est régurgité de bouche en bouche, enrichi d'enzymes, ventilé pour réduire l'humidité — puis operculé à la cire.",
    },

    // pool-7 : ce qu'encode la durée de la danse
    {
      id: 'c5-ra-pool-7',
      type: 'QUIZ',
      conceptId: 'waggle-dance',
      difficulty: 'hard',
      cognitiveTags: ['generation'],
      learningObjective: "Comprendre précisément ce qu'encode la durée de la danse frétillante.",
      question: "Dans la danse frétillante, que signifie la DURÉE de la phase frétillante ?",
      options: [
        {
          text: "La distance de la source de nourriture (~1 seconde = ~1 km).",
          isCorrect: true,
          feedback: "Exact. ~1 seconde de danse = ~1 km de distance. C'est du codage symbolique pur.",
        },
        {
          text: "La qualité du nectar trouvé.",
          isCorrect: false,
          feedback: "La qualité est encodée par l'intensité de la danse, pas sa durée.",
        },
        {
          text: "Le nombre d'abeilles nécessaires pour la récolte.",
          isCorrect: false,
          feedback: "Non. La durée encode la distance — pas le recrutement.",
        },
        {
          text: "Le temps avant la prochaine floraison.",
          isCorrect: false,
          feedback: "Non. Les abeilles encodent des coordonnées spatiales — pas des prévisions temporelles.",
        },
      ],
    },

    // pool-8 : rayon de butinage jusqu'à 5 km
    {
      id: 'c5-ra-pool-8',
      type: 'SWIPE',
      conceptId: 'waggle-dance',
      difficulty: 'easy',
      cognitiveTags: ['sprint'],
      learningObjective: "Ancrer la portée territoriale d'une ruche.",
      question: 'Vrai ou faux ?',
      card: {
        title: "Une abeille peut indiquer une fleur à plus de 2 km de la ruche.",
        subtitle: '⚡ Sprint',
        imagePrompt: "Paysage malgache avec collines verdoyantes et champs de fleurs",
      },
      correctDirection: 'right',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Exact. La danse peut encoder jusqu'à 5 km. Une ruche connaît son territoire sur des km à la ronde.",
      incorrectFeedback: "Si ! Jusqu'à 5 km de rayon. Les 45 ruches d'Andraina couvrent une zone immense autour d'Antsirabe.",
      explanation: "La danse frétillante peut encoder des distances jusqu'à 5 km. L'information circule dans la ruche entière en quelques minutes.",
    },
  ],

  // ─── Legendary (8 exercices) ──────────────────────────────────────────────────

  authoredLegendary: [
    // leg-1 — STORY hook
    {
      id: 'c5-ra-leg-1',
      type: 'STORY',
      conceptId: 'hive-as-superorganism',
      difficulty: 'easy',
      cognitiveTags: ['hook'],
      learningObjective: "Resituer l'engagement dans la durée de vie d'une abeille.",
      screens: [
        {
          text: "Tu as soutenu une ruche. Dedans : des milliers d'abeilles qui vivront 6 semaines et mourront en volant.",
          imagePrompt: 'Ruche ouverte avec cadres de cire et abeilles actives, lumière du matin à Antsirabe',
          imageUrl: HIVE_IMAGE,
          kind: 'hook',
          boldTokens: ['6 semaines'],
        },
      ],
    },

    // leg-2 — QUIZ : ce qu'encode la danse (Nobel)
    {
      id: 'c5-ra-leg-2',
      type: 'QUIZ',
      conceptId: 'waggle-dance',
      difficulty: 'hard',
      cognitiveTags: ['generation'],
      learningObjective: "Maîtriser les deux coordonnées encodées dans la danse frétillante.",
      question: "La danse frétillante encode deux informations spatiales. Lesquelles ?",
      options: [
        {
          text: "Direction (angle par rapport au soleil) et distance (durée de la danse).",
          isCorrect: true,
          feedback: "Exact. Coordonnées polaires encodées dans un comportement physique. Nobel de biologie 1973.",
        },
        {
          text: "Quantité de nectar et type de fleur.",
          isCorrect: false,
          feedback: "Ces infos existent (odeur, intensité) — mais les deux coordonnées encodées sont angle et durée.",
        },
        {
          text: "Température et humidité de la source.",
          isCorrect: false,
          feedback: "Non. La danse encode des coordonnées spatiales — pas des conditions météo.",
        },
        {
          text: "Heure d'arrivée et nombre de butineuses disponibles.",
          isCorrect: false,
          feedback: "Non. La danse dit OÙ aller — pas quand ni combien.",
        },
      ],
    },

    // leg-3 — SWIPE (piège expert : extinction humaine)
    {
      id: 'c5-ra-leg-3',
      type: 'SWIPE',
      conceptId: 'accidental-pollination',
      difficulty: 'hard',
      cognitiveTags: ['misconception'],
      learningObjective: "Distinguer catastrophe alimentaire et extinction totale sans abeilles.",
      question: 'Vrai ou faux ?',
      card: {
        title: "Si les abeilles disparaissaient, l'humanité mourrait de faim rapidement.",
        subtitle: '🧠 Piège expert',
        imagePrompt: 'Champs agricoles vus du ciel, mélange de cultures et forêts',
      },
      correctDirection: 'left',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Exagéré. Les céréales (riz, blé) survivraient. On perdrait diversité et plaisir — pas toutes les calories.",
      incorrectFeedback: "Ce n'est pas si direct. Les céréales de base sont pollinisées par le vent. On perdrait la diversité, pas tout.",
      explanation: "Riz, blé, maïs = vent. On perdrait 30% de la diversité alimentaire — une catastrophe mondiale, pas une extinction totale.",
      misconceptionId: 'no-bees-total-famine',
    },

    // leg-4 — DRAG_DROP : chaîne de l'information
    {
      id: 'c5-ra-leg-4',
      type: 'DRAG_DROP',
      conceptId: 'waggle-dance',
      difficulty: 'hard',
      cognitiveTags: ['generation'],
      learningObjective: "Reconstituer la chaîne complète de l'information dans une ruche.",
      instruction: "Ordonne comment l'information voyage dans la ruche.",
      axis: 'horizontal',
      axisRationale: "Chronologie : de la découverte individuelle à l'action collective à grande échelle.",
      slotCount: 4,
      items: [
        { id: 'c5-ra-leg-4-a', text: '🐝 Éclaireuse découvre une fleur' },
        { id: 'c5-ra-leg-4-b', text: '💃 Danse frétillante (angle + durée)' },
        { id: 'c5-ra-leg-4-c', text: '👀 300 abeilles décodent le message' },
        { id: 'c5-ra-leg-4-d', text: '🌸 Des millions de fleurs visitées' },
      ],
      correctFeedback: "Exact. Une découverte individuelle devient action collective. La ruche est un cerveau distribué.",
      incorrectFeedback: "L'ordre : découverte → danse → décodage → action collective à grande échelle.",
    },

    // leg-5 — QUIZ : superorganisme
    {
      id: 'c5-ra-leg-5',
      type: 'QUIZ',
      conceptId: 'hive-as-superorganism',
      difficulty: 'hard',
      cognitiveTags: ['generation'],
      learningObjective: "Comprendre pourquoi une ruche est qualifiée de superorganisme.",
      question: "Pourquoi une ruche est-elle qualifiée de 'superorganisme' ?",
      options: [
        {
          text: "Parce que décision, mémoire et action sont distribuées entre toutes les abeilles.",
          isCorrect: true,
          feedback: "Exact. Aucune abeille ne 'sait' tout — mais la ruche sait. C'est de l'intelligence émergente.",
        },
        {
          text: "Parce qu'elle peut survivre des décennies.",
          isCorrect: false,
          feedback: "La longévité est un signe — mais ce n'est pas la définition du superorganisme.",
        },
        {
          text: "Parce que les abeilles ont une mémoire collective génétique.",
          isCorrect: false,
          feedback: "Non. La mémoire collective est comportementale (danse, phéromones) — pas génétique.",
        },
        {
          text: "Parce qu'elle produit plus qu'une colonie normale.",
          isCorrect: false,
          feedback: "La production n'a rien à voir. C'est la nature distribuée de l'intelligence qui compte.",
        },
      ],
    },

    // leg-6 — SWIPE : 80 000 km de vol
    {
      id: 'c5-ra-leg-6',
      type: 'SWIPE',
      conceptId: 'hive-as-superorganism',
      difficulty: 'medium',
      cognitiveTags: ['generation'],
      learningObjective: "Ancrer le coût réel de production d'un pot de miel.",
      question: 'Vrai ou faux ?',
      card: {
        title: "Un pot de miel de 500g représente ~80 000 km de vol collectif.",
        subtitle: '✓ Fait vérifiable',
        imagePrompt: "Pot de miel artisanal d'eucalyptus, étiquette Ilanga Nature, fond bois naturel",
      },
      correctDirection: 'right',
      leftLabel: 'FAUX',
      rightLabel: 'VRAI',
      correctFeedback: "Exact. 80 000 km — 2 fois le tour de la Terre — pour 500g. Et ce n'est pas la partie la plus spectaculaire.",
      incorrectFeedback: "Si ! ~80 000 km de vol collectif. 2 tours du globe pour un seul pot de miel d'Andraina.",
      explanation: "500g de miel = 2 millions de fleurs visitées, ~80 000 km de vol collectif. Le miel est du travail pur, compressé en pot.",
    },

    // leg-7 — STORY : les 45 ruches d'Andraina
    {
      id: 'c5-ra-leg-7',
      type: 'STORY',
      conceptId: 'hive-as-superorganism',
      difficulty: 'medium',
      cognitiveTags: ['reveal'],
      learningObjective: "Visualiser ce que les 45 ruches d'Andraina font réellement.",
      screens: [
        {
          text: "Les 45 ruches d'Andraina visitent des millions de fleurs chaque jour. Sans plan. Sans conscience. Ça marche.",
          imagePrompt: "Vue aérienne de la région d'Antsirabe, paysage vert avec champs et eucalyptus en fleur",
          imageUrl: FLOWER_IMAGE,
          kind: 'reveal',
          boldTokens: ['Sans plan. Sans conscience.'],
        },
      ],
    },

    // leg-8 — QUIZ closure
    {
      id: 'c5-ra-leg-8',
      type: 'QUIZ',
      conceptId: 'accidental-pollination',
      difficulty: 'medium',
      cognitiveTags: ['closure', 'metacognition'],
      learningObjective: "Synthétiser la transformation de perspective du cours.",
      question: "Quelle est la vraie révélation de ce cours ?",
      options: [
        {
          text: "La nature crée de l'ordre vital à grande échelle — sans intention d'aucune sorte.",
          isCorrect: true,
          feedback: "Exact. Ni l'abeille ni la fleur ne 'veulent' quoi que ce soit. Et pourtant : 30% de notre alimentation en dépend.",
        },
        {
          text: "Les abeilles sont plus intelligentes qu'on ne le pensait.",
          isCorrect: false,
          feedback: "Intelligence ou pas — la révélation est que l'intention n'est pas nécessaire pour créer un système vital.",
        },
        {
          text: "Le miel est plus précieux qu'on ne le croyait.",
          isCorrect: false,
          feedback: "Le coût du miel est surprenant — mais ce n'est pas la transformation centrale du cours.",
        },
        {
          text: "Andraina fait un travail essentiel pour la planète.",
          isCorrect: false,
          feedback: "Vrai — mais la révélation est plus large : c'est la logique de la nature entière qui est en jeu.",
        },
      ],
    },
  ],

  // ─── Lessons (exactement 4) ───────────────────────────────────────────────────

  lessons: [
    {
      id: 'ra-lesson-1-discovery',
      slug: 'decouvrir',
      title: 'Découvrir',
      kind: 'discovery',
      order: 1,
      estimatedMinutes: '3-4 min',
      learningGoal: "Découvrir l'accident milliardaire, la danse GPS et le coût invisible du miel.",
      generation: 'authored-discovery',
      rules: { exerciseCount: 12 },
    },
    {
      id: 'ra-lesson-2-practice',
      slug: 'comprendre',
      title: 'Comprendre',
      kind: 'practice',
      order: 2,
      estimatedMinutes: '3 min',
      learningGoal: "Consolider : pollinisation accidentelle, aliments concernés, coût collectif du miel.",
      generation: 'pool-practice',
      rules: { exerciseCount: 8, misconceptionRatio: 0.4, interleaveFromPreviousUnits: 0 },
    },
    {
      id: 'ra-lesson-3-mastery',
      slug: 'relier',
      title: 'Relier',
      kind: 'mastery',
      order: 3,
      estimatedMinutes: '4 min',
      learningGoal: "Relier la danse frétillante, l'essaimage collectif et le coût de production du miel.",
      generation: 'pool-mastery',
      rules: { exerciseCount: 8, misconceptionRatio: 0.5, interleaveFromPreviousUnits: 0, hardRatio: 0.5 },
    },
    {
      id: 'ra-lesson-4-legendary',
      slug: 'valider',
      title: 'Valider',
      kind: 'legendary',
      order: 4,
      estimatedMinutes: '4-5 min',
      learningGoal: "Synthétiser : nature sans intention, intelligence distribuée, biodiversité comme effet de bord.",
      generation: 'authored-legendary',
      rules: { exerciseCount: 8 },
      reward: { type: 'seeds', amount: 70, label: '70 XP Academy' },
    },
  ],
}
