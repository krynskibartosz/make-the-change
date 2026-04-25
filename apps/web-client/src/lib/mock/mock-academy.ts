export const ACADEMY_PROGRESS_STORAGE_KEY = 'mtc_academy_progress_v1'
export const MOCK_ACADEMY_VIEWER_ID = 'mock-viewer'

export type AcademyMascot = 'ondine' | 'sylva' | 'abeille-transparente'
export type AcademyUnitStatus = 'completed' | 'active' | 'locked'
export type AcademyChapterStatus = 'completed' | 'active' | 'locked'
export type AcademyExerciseType = 'STORY' | 'SWIPE' | 'DRAG_DROP' | 'QUIZ'

export type AcademyReward = {
  type: 'seeds'
  amount: number
  label: string
}

export type AcademyStoryExercise = {
  id: string
  type: 'STORY'
  screens: Array<{
    text: string
    imageUrl?: string
    imagePrompt: string
  }>
}

export type AcademySwipeExercise = {
  id: string
  type: 'SWIPE'
  question: string
  card: {
    title: string
    subtitle: string
    imageUrl?: string
  }
  correctDirection: 'right' | 'left'
  leftLabel: string
  rightLabel: string
  correctFeedback: string
  incorrectFeedback: string
}

export type AcademyDragDropExercise = {
  id: string
  type: 'DRAG_DROP'
  instruction: string
  items: Array<{
    id: string
    text: string
  }>
}

export type AcademyQuizExercise = {
  id: string
  type: 'QUIZ'
  question: string
  options: Array<{
    text: string
    isCorrect: boolean
  }>
  successFeedback: string
  failureFeedback: string
}

export type AcademyExercise =
  | AcademyStoryExercise
  | AcademySwipeExercise
  | AcademyDragDropExercise
  | AcademyQuizExercise

export type AcademyUnit = {
  id: string
  slug: string
  chapterId: string
  title: string
  subtitle: string
  concept: string
  order: number
  durationMinutes: number
  mascot: AcademyMascot
  reward: AcademyReward
  exercises: AcademyExercise[]
}

export type AcademyChapter = {
  id: string
  slug: string
  title: string
  subtitle: string
  level: string
  order: number
  durationMinutes: number
  difficulty: 'debutant' | 'intermediaire' | 'avance'
  units: AcademyUnit[]
}

export type AcademyUnitResult = {
  unitId: string
  completedAt: string
  score: number
  mistakes: number
  rewardEarned: number
}

export type AcademyProgress = {
  viewerId: string
  completedUnitIds: string[]
  activeUnitId: string
  unitResults: Record<string, AcademyUnitResult>
  seedsBalance: number
  streak: {
    current: number
    best: number
    lastActivityDay: string | null
    completedDays: string[]
  }
  lives: {
    remaining: number
    updatedAt: string
  }
}

export type AcademyUnitWithStatus = AcademyUnit & {
  status: AcademyUnitStatus
  result: AcademyUnitResult | null
}

export type AcademyChapterWithStatus = Omit<AcademyChapter, 'units'> & {
  status: AcademyChapterStatus
  completedUnitsCount: number
  units: AcademyUnitWithStatus[]
}

export type AcademyRepository = {
  getCurriculum(): AcademyChapter[]
  getProgress(viewerId: string): AcademyProgress
  saveProgress(viewerId: string, progress: AcademyProgress): AcademyProgress
  completeUnit(
    viewerId: string,
    unitId: string,
    result: Pick<AcademyUnitResult, 'score' | 'mistakes'>,
  ): AcademyProgress
  resetProgress(viewerId: string): AcademyProgress
}

const storyImages = {
  sprout:
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop',
  forest:
    'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1000&auto=format&fit=crop',
  water:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
  reef:
    'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=1000&auto=format&fit=crop',
  field:
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop',
} as const

const makeReward = (amount: number): AcademyReward => ({
  type: 'seeds',
  amount,
  label: `${amount} Graines`,
})

const makeExercises = ({
  baseId,
  story,
  swipe,
  drag,
  quiz,
}: {
  baseId: string
  story: {
    first: string
    second: string
    firstVisual: string
    secondVisual: string
    firstImage?: string
    secondImage?: string
  }
  swipe: {
    question: string
    correct: string
    incorrect: string
    correctFeedback: string
    incorrectFeedback: string
    subtitle: string
  }
  drag: {
    instruction: string
    items: [string, string, string]
  }
  quiz: {
    question: string
    wrongAnswers: [string, string]
    correctAnswer: string
    successFeedback: string
  }
}): AcademyExercise[] => [
  {
    id: `${baseId}-story`,
    type: 'STORY',
    screens: [
      {
        text: story.first,
        imagePrompt: story.firstVisual,
        imageUrl: story.firstImage,
      },
      {
        text: story.second,
        imagePrompt: story.secondVisual,
        imageUrl: story.secondImage,
      },
    ],
  },
  {
    id: `${baseId}-swipe`,
    type: 'SWIPE',
    question: swipe.question,
    card: {
      title: swipe.correct,
      subtitle: swipe.subtitle,
      imageUrl: story.firstImage,
    },
    correctDirection: 'right',
    leftLabel: swipe.incorrect,
    rightLabel: swipe.correct,
    correctFeedback: swipe.correctFeedback,
    incorrectFeedback: swipe.incorrectFeedback,
  },
  {
    id: `${baseId}-drag`,
    type: 'DRAG_DROP',
    instruction: drag.instruction,
    items: drag.items.map((text, index) => ({
      id: `${baseId}-item-${index + 1}`,
      text,
    })),
  },
  {
    id: `${baseId}-quiz`,
    type: 'QUIZ',
    question: quiz.question,
    options: [
      { text: quiz.wrongAnswers[0], isCorrect: false },
      { text: quiz.wrongAnswers[1], isCorrect: false },
      { text: quiz.correctAnswer, isCorrect: true },
    ],
    successFeedback: quiz.successFeedback,
    failureFeedback: "Oups, ce n'est pas la bonne réponse.",
  },
]

const makeUnit = (
  unit: Omit<AcademyUnit, 'reward' | 'exercises'> & {
    rewardAmount: number
    exercises: Parameters<typeof makeExercises>[0]
  },
): AcademyUnit => ({
  id: unit.id,
  slug: unit.slug,
  chapterId: unit.chapterId,
  title: unit.title,
  subtitle: unit.subtitle,
  concept: unit.concept,
  order: unit.order,
  durationMinutes: unit.durationMinutes,
  mascot: unit.mascot,
  reward: makeReward(unit.rewardAmount),
  exercises: makeExercises(unit.exercises),
})

const ACADEMY_CURRICULUM: AcademyChapter[] = [
  {
    id: 'chapter-1',
    slug: 'alphabet-originel',
    title: "L'Alphabet Originel",
    subtitle: 'Les éléments fondamentaux et les acteurs principaux de la nature.',
    level: 'A1',
    order: 1,
    durationMinutes: 45,
    difficulty: 'debutant',
    units: [
      makeUnit({
        id: 'unit-1-1',
        slug: 'les-forges-de-la-vie',
        chapterId: 'chapter-1',
        title: 'Les Forges de la Vie',
        subtitle: "Soleil, eau, sols : l'énergie de départ.",
        concept: 'Énergie, Minéraux, Hydratation',
        order: 1,
        durationMinutes: 2,
        mascot: 'ondine',
        rewardAmount: 10,
        exercises: {
          baseId: 'unit-1-1',
          story: {
            first: 'Soleil, eau, sol : les trois piliers de la vie.',
            second: "Ensemble, ils forgent l'énergie de toute la nature.",
            firstVisual: "Une jeune pousse lumineuse émergeant d'une terre humide sous un grand soleil.",
            secondVisual: "Ondine mélangeant de l'eau, de la terre et des rayons solaires.",
            firstImage: storyImages.sprout,
            secondImage: storyImages.forest,
          },
          swipe: {
            question: "Est-ce un ingrédient indispensable à la création de la vie ?",
            correct: "L'eau douce",
            incorrect: 'Le goudron',
            subtitle: 'Source de toute vie',
            correctFeedback: "Génial ! Sans eau, les cellules de la vie ne peuvent pas s'hydrater.",
            incorrectFeedback: "Oups ! Le goudron asphyxie les sols et empêche l'eau de circuler.",
          },
          drag: {
            instruction: 'Ordonne ces éléments du plus lointain au plus profond :',
            items: ['Le Soleil (Espace)', "L'Eau (Surface)", 'Les Minéraux (Sous-sol)'],
          },
          quiz: {
            question: "Quel élément fournit l'énergie de base à presque toute la Terre ?",
            wrongAnswers: ['Le vent fougueux', 'La roche magmatique'],
            correctAnswer: 'Le Soleil',
            successFeedback: 'Bingo ! Les plantes capturent sa lumière pour nourrir toute la chaîne alimentaire.',
          },
        },
      }),
      makeUnit({
        id: 'unit-1-2',
        slug: 'le-peuple-emeraude',
        chapterId: 'chapter-1',
        title: 'Le Peuple Émeraude',
        subtitle: 'Les plantes, grandes usines solaires du vivant.',
        concept: 'Photosynthèse, Racines, Feuilles',
        order: 2,
        durationMinutes: 2,
        mascot: 'sylva',
        rewardAmount: 10,
        exercises: {
          baseId: 'unit-1-2',
          story: {
            first: 'Les plantes sont les usines magiques de notre planète.',
            second: 'Elles transforment la lumière du soleil en énergie pure.',
            firstVisual: "Une forêt dense et vibrante vue d'en bas, baignée de lumière.",
            secondVisual: 'Sylva tenant une feuille verte brillante qui absorbe un rayon solaire.',
            firstImage: storyImages.forest,
            secondImage: storyImages.sprout,
          },
          swipe: {
            question: 'Que capte la plante pour réaliser la photosynthèse ?',
            correct: 'La lumière du soleil',
            incorrect: "L'ombre fraîche",
            subtitle: 'Un panneau solaire naturel',
            correctFeedback: 'Brillant ! Les feuilles sont de véritables panneaux solaires naturels.',
            incorrectFeedback: "Zut ! Sans lumière, la grande usine verte s'arrête.",
          },
          drag: {
            instruction: "Ordonne le trajet magique de l'eau dans une plante :",
            items: ['Les racines (Sol)', 'La tige (Transport)', 'Les feuilles (Évaporation)'],
          },
          quiz: {
            question: 'Quel super-pouvoir permet aux plantes de créer leur nourriture ?',
            wrongAnswers: ['La télékinésie', 'La digestion lente'],
            correctAnswer: 'La photosynthèse',
            successFeedback: "Super ! Elles créent du sucre avec du soleil, de l'eau et de l'air.",
          },
        },
      }),
      makeUnit({
        id: 'unit-1-3',
        slug: 'le-bestiaire-sauvage',
        chapterId: 'chapter-1',
        title: 'Le Bestiaire Sauvage',
        subtitle: 'Animaux, mouvement et instincts de survie.',
        concept: 'Animaux, Mouvement, Instinct',
        order: 3,
        durationMinutes: 2,
        mascot: 'abeille-transparente',
        rewardAmount: 15,
        exercises: {
          baseId: 'unit-1-3',
          story: {
            first: 'Les animaux respirent, bougent et explorent chaque recoin du monde.',
            second: "Leur secret pour survivre ? L'instinct et le mouvement permanent.",
            firstVisual: 'Une plaine sauvage vibrante où courent des animaux de différentes tailles.',
            secondVisual: 'Melli volant agilement au-dessus des hautes herbes.',
            firstImage: storyImages.field,
            secondImage: storyImages.forest,
          },
          swipe: {
            question: 'Quelle caractéristique appartient au règne animal ?',
            correct: 'Le mouvement autonome',
            incorrect: 'Des racines souterraines',
            subtitle: 'Explorer, fuir, chasser',
            correctFeedback: 'Exact ! Se déplacer permet de chasser, de fuir et d’explorer.',
            incorrectFeedback: 'Oups ! Les animaux ne sont pas fixés au sol comme les plantes.',
          },
          drag: {
            instruction: 'Classe ces animaux sauvages du plus lent au plus rapide :',
            items: ["L'escargot (Lent)", 'Le loup (Rapide)', 'Le faucon pèlerin (Très rapide)'],
          },
          quiz: {
            question: 'Comment appelle-t-on la boussole naturelle qui guide les actions des animaux ?',
            wrongAnswers: ['Le magnétisme', 'La photosynthèse'],
            correctAnswer: "L'instinct",
            successFeedback: "Parfait ! C'est ce GPS interne qui les aide à survivre dès la naissance.",
          },
        },
      }),
    ],
  },
  {
    id: 'chapter-2',
    slug: 'grammaire-especes',
    title: 'La Grammaire des Espèces',
    subtitle: "Comment les êtres vivants interagissent, s'allient et évoluent.",
    level: 'A2',
    order: 2,
    durationMinutes: 60,
    difficulty: 'debutant',
    units: [
      makeUnit({
        id: 'unit-2-1',
        slug: 'le-festin-des-predateurs',
        chapterId: 'chapter-2',
        title: 'Le Festin des Prédateurs',
        subtitle: 'Proies, prédateurs et équilibre vivant.',
        concept: 'Proies, Prédateurs, Équilibre',
        order: 1,
        durationMinutes: 2,
        mascot: 'abeille-transparente',
        rewardAmount: 20,
        exercises: {
          baseId: 'unit-2-1',
          story: {
            first: 'Dans la nature, tout le monde mange ou est mangé.',
            second: "C'est le cycle vital de la chaîne alimentaire !",
            firstVisual: 'Une boucle lumineuse reliant une herbe, un lièvre et un loup.',
            secondVisual: 'Melli observant avec des jumelles un aigle en chasse.',
            firstImage: storyImages.forest,
            secondImage: storyImages.field,
          },
          swipe: {
            question: "Est-ce le rôle utile d'un grand prédateur ?",
            correct: 'Réguler les proies',
            incorrect: "Fabriquer de l'engrais",
            subtitle: 'Gardien des équilibres',
            correctFeedback: 'Bien joué ! Sans les prédateurs, les herbivores mangeraient toute la forêt.',
            incorrectFeedback: "Aïe ! Ça, c'est le travail des insectes et des bactéries.",
          },
          drag: {
            instruction: 'Reconstitue cette chaîne alimentaire dans le bon ordre :',
            items: ['La feuille (Producteur)', 'La chenille (Herbivore)', "L'oiseau (Carnivore)"],
          },
          quiz: {
            question: "Qui se trouve tout à la base d'une chaîne alimentaire terrestre ?",
            wrongAnswers: ['Le super-prédateur', 'Le champignon géant'],
            correctAnswer: 'La plante verte',
            successFeedback: 'Bravo ! Elle produit sa propre énergie pour nourrir tous les autres.',
          },
        },
      }),
      makeUnit({
        id: 'unit-2-2',
        slug: 'les-alliances-invisibles',
        chapterId: 'chapter-2',
        title: 'Les Alliances Invisibles',
        subtitle: "Les pactes secrets qui relient les espèces.",
        concept: 'Mutualisme, Parasitisme, Coévolution',
        order: 2,
        durationMinutes: 2,
        mascot: 'sylva',
        rewardAmount: 20,
        exercises: {
          baseId: 'unit-2-2',
          story: {
            first: "Dans la nature, s'entraider est souvent vital pour survivre.",
            second: "Ces pactes secrets s'appellent la symbiose.",
            firstVisual: 'Un poisson-clown blotti en sécurité dans une anémone de mer.',
            secondVisual: 'Sylva faisant équipe avec un petit champignon.',
            firstImage: storyImages.reef,
            secondImage: storyImages.forest,
          },
          swipe: {
            question: 'Est-ce un exemple de relation mutuellement bénéfique ?',
            correct: "L'abeille et la fleur",
            incorrect: "Le moustique et l'humain",
            subtitle: 'Une alliance gagnant-gagnant',
            correctFeedback: "Génial ! L'une se nourrit de nectar, l'autre voyage pour se reproduire.",
            incorrectFeedback: 'Aïe ! Le moustique prend sans rien donner en retour.',
          },
          drag: {
            instruction: 'Classe ces relations de la plus amicale à la pire :',
            items: ['Mutualisme (Gagnant-Gagnant)', 'Commensalisme (Neutre)', 'Parasitisme (Gagnant-Perdant)'],
          },
          quiz: {
            question: "Comment s'appelle l'alliance vitale entre un champignon et une algue ?",
            wrongAnswers: ['Une moisissure', 'Un fossile'],
            correctAnswer: 'Le lichen',
            successFeedback: 'Bravo ! Ils fusionnent pour vivre même sur la roche nue.',
          },
        },
      }),
      makeUnit({
        id: 'unit-2-3',
        slug: 'la-loterie-des-mutations',
        chapterId: 'chapter-2',
        title: 'La Loterie des Mutations',
        subtitle: 'Adaptation, hasard et survie dans le temps.',
        concept: 'Adaptation, Sélection, Survie',
        order: 3,
        durationMinutes: 2,
        mascot: 'ondine',
        rewardAmount: 25,
        exercises: {
          baseId: 'unit-2-3',
          story: {
            first: 'La nature teste tout le temps de nouvelles formes bizarres.',
            second: "C'est l'évolution : les mieux adaptés survivent et se multiplient !",
            firstVisual: 'Plusieurs papillons de couleurs différentes volant au-dessus d’une fleur.',
            secondVisual: 'Ondine observant un papillon camouflé sur une feuille.',
            firstImage: storyImages.field,
            secondImage: storyImages.forest,
          },
          swipe: {
            question: "Qu'est-ce qui aide une espèce à survivre dans le temps ?",
            correct: 'Une mutation utile',
            incorrect: 'Rester exactement pareil',
            subtitle: 'Un avantage transmis',
            correctFeedback: "Exact ! Un long cou pour manger les hautes feuilles, c'est malin.",
            incorrectFeedback: "Aïe ! Si le climat change, l'espèce doit s'adapter ou disparaître.",
          },
          drag: {
            instruction: "Remets les étapes de l'évolution dans le bon ordre :",
            items: ['Mutation au hasard', 'Survie du mieux adapté', 'Transmission aux bébés'],
          },
          quiz: {
            question: "Quel célèbre scientifique a expliqué l'évolution par la sélection naturelle ?",
            wrongAnswers: ['Albert Einstein', 'Marie Curie'],
            correctAnswer: 'Charles Darwin',
            successFeedback: 'Bingo ! Son voyage aux Galápagos a changé la science pour toujours.',
          },
        },
      }),
    ],
  },
  {
    id: 'chapter-3',
    slug: 'economie-biosphere',
    title: "L'Économie de la Biosphère",
    subtitle: 'Les grands cycles qui maintiennent le moteur de la planète.',
    level: 'B1',
    order: 3,
    durationMinutes: 75,
    difficulty: 'intermediaire',
    units: [
      makeUnit({
        id: 'unit-3-1',
        slug: 'les-coursiers-du-nectar',
        chapterId: 'chapter-3',
        title: 'Les Coursiers du Nectar',
        subtitle: 'Pollinisation et reproduction des fleurs.',
        concept: 'Fleurs, Insectes, Reproduction',
        order: 1,
        durationMinutes: 2,
        mascot: 'abeille-transparente',
        rewardAmount: 30,
        exercises: {
          baseId: 'unit-3-1',
          story: {
            first: 'Pour se reproduire, les fleurs engagent des livreurs volants.',
            second: 'Contre du nectar sucré, les insectes transportent leur pollen !',
            firstVisual: 'Une fleur colorée attirant une abeille en plein vol.',
            secondVisual: 'Melli couverte de poudre jaune avec un sac à dos.',
            firstImage: storyImages.field,
            secondImage: storyImages.sprout,
          },
          swipe: {
            question: 'Cet animal est-il un bon pollinisateur ?',
            correct: 'Le papillon',
            incorrect: 'Le loup',
            subtitle: 'De fleur en fleur',
            correctFeedback: 'Vrai ! En butinant, il disperse le pollen.',
            incorrectFeedback: 'Oups ! Les loups chassent, ils ne butinent pas les pâquerettes.',
          },
          drag: {
            instruction: 'Remets les étapes de la pollinisation dans le bon ordre :',
            items: ["L'insecte boit le nectar", 'Le pollen colle à ses poils', 'Il féconde une autre fleur'],
          },
          quiz: {
            question: 'Sans la pollinisation, que manquerait-il dans nos assiettes ?',
            wrongAnswers: ["L'eau minérale", 'Le sel marin'],
            correctAnswer: 'Les fruits et légumes',
            successFeedback: 'Exact ! Sans pollinisateurs, adieu les fraises, les pommes et le chocolat.',
          },
        },
      }),
      makeUnit({
        id: 'unit-3-2',
        slug: 'leternel-voyage-bleu',
        chapterId: 'chapter-3',
        title: "L'Éternel Voyage Bleu",
        subtitle: "Le voyage infini de l'eau.",
        concept: "Évaporation, Précipitations, Infiltration",
        order: 2,
        durationMinutes: 2,
        mascot: 'ondine',
        rewardAmount: 30,
        exercises: {
          baseId: 'unit-3-2',
          story: {
            first: "L'eau de la Terre ne disparaît jamais, elle voyage !",
            second: 'Elle tourne en boucle entre ciel, terre et océan.',
            firstVisual: "Une petite goutte d'eau avec un sac à dos.",
            secondVisual: 'Ondine surfant joyeusement sur une vague infinie.',
            firstImage: storyImages.water,
            secondImage: storyImages.reef,
          },
          swipe: {
            question: "Qu'est-ce qui fait monter l'eau de l'océan vers le ciel ?",
            correct: 'La chaleur du soleil',
            incorrect: 'La gravité terrestre',
            subtitle: 'L’évaporation démarre ici',
            correctFeedback: "Parfait ! Le soleil chauffe l'eau qui s'évapore en gaz invisible.",
            incorrectFeedback: "Oups ! La gravité sert surtout à faire tomber la pluie.",
          },
          drag: {
            instruction: "Remets les étapes du cycle de l'eau dans l'ordre :",
            items: ['Évaporation (Océan)', 'Condensation (Nuages)', 'Précipitations (Pluie)'],
          },
          quiz: {
            question: "Où va une grande partie de l'eau qui tombe sur terre ?",
            wrongAnswers: ["Dans l'espace", 'Elle brûle au contact du sol'],
            correctAnswer: "Elle s'infiltre dans le sol",
            successFeedback: 'Génial ! Elle remplit les nappes phréatiques, nos réserves secrètes.',
          },
        },
      }),
      makeUnit({
        id: 'unit-3-3',
        slug: 'le-coffre-fort-noir',
        chapterId: 'chapter-3',
        title: 'Le Coffre-Fort Noir',
        subtitle: 'Carbone, forêts et stockage du vivant.',
        concept: 'Absorption, Stockage, Émissions',
        order: 3,
        durationMinutes: 2,
        mascot: 'sylva',
        rewardAmount: 35,
        exercises: {
          baseId: 'unit-3-3',
          story: {
            first: 'Le carbone est la brique de base du vivant.',
            second: 'Les forêts le stockent comme un immense coffre-fort.',
            firstVisual: 'Un atome de carbone entouré de feuilles et d’animaux.',
            secondVisual: 'Sylva fermant un coffre magique rempli de diamants noirs.',
            firstImage: storyImages.forest,
            secondImage: storyImages.sprout,
          },
          swipe: {
            question: 'Ce processus aide-t-il à stocker le gaz carbonique ?',
            correct: 'Un arbre qui grandit',
            incorrect: 'Un feu de forêt',
            subtitle: 'Du carbone dans le bois',
            correctFeedback: 'Super ! En poussant, le bois emprisonne le carbone.',
            incorrectFeedback: 'Aïe ! Brûler du bois libère le carbone enfoui.',
          },
          drag: {
            instruction: 'Ordonne le cycle naturel du carbone :',
            items: ["Gaz dans l'air", "L'arbre l'absorbe", 'La feuille nourrit le sol'],
          },
          quiz: {
            question: 'Quel autre milieu naturel est un immense puits de carbone ?',
            wrongAnswers: ['Le désert brûlant', 'La haute montagne'],
            correctAnswer: "L'océan profond",
            successFeedback: 'Bingo ! Ses eaux et ses algues microscopiques absorbent des tonnes de carbone.',
          },
        },
      }),
    ],
  },
  {
    id: 'chapter-4',
    slug: 'sanctuaires-sauvages',
    title: 'Les Sanctuaires Sauvages',
    subtitle: 'Écosystèmes uniques, isolés et fragiles.',
    level: 'B2',
    order: 4,
    durationMinutes: 90,
    difficulty: 'intermediaire',
    units: [
      makeUnit({
        id: 'unit-4-1',
        slug: 'lile-aux-lemuriens',
        chapterId: 'chapter-4',
        title: "L'Île aux Lémuriens",
        subtitle: 'Madagascar, laboratoire secret de la nature.',
        concept: 'Endémisme, Isolement, Biodiversité',
        order: 1,
        durationMinutes: 2,
        mascot: 'sylva',
        rewardAmount: 40,
        exercises: {
          baseId: 'unit-4-1',
          story: {
            first: 'Une île isolée devient le laboratoire secret de la nature.',
            second: 'Des espèces uniques vivent ici et nulle part ailleurs.',
            firstVisual: "L'île de Madagascar flottant paisiblement sur un océan bleu.",
            secondVisual: 'Sylva observant un maki catta perché dans un baobab.',
            firstImage: storyImages.water,
            secondImage: storyImages.forest,
          },
          swipe: {
            question: 'Ce comportement décrit-il une espèce endémique ?',
            correct: 'Vivre uniquement à Madagascar',
            incorrect: 'Voyager sur tous les continents',
            subtitle: 'Unique au monde',
            correctFeedback: "Exact ! Isolée de tout, l'espèce a évolué de façon unique.",
            incorrectFeedback: "Faux ! Une espèce endémique reste strictement à la maison.",
          },
          drag: {
            instruction: "Retrace l'arrivée des lémuriens sur l'île :",
            items: ['Dérive sur des radeaux de bois', "Arrivée sur l'île isolée", 'Évolution en espèces uniques'],
          },
          quiz: {
            question: "Quel arbre géant est l'emblème de Madagascar ?",
            wrongAnswers: ['Le chêne centenaire', 'Le pin parasol'],
            correctAnswer: 'Le baobab',
            successFeedback: "Bravo ! Son tronc en bouteille stocke l'eau pour survivre aux sécheresses.",
          },
        },
      }),
      makeUnit({
        id: 'unit-4-2',
        slug: 'les-metropoles-englouties',
        chapterId: 'chapter-4',
        title: 'Les Métropoles Englouties',
        subtitle: 'Récifs, polypes et blanchissement.',
        concept: 'Récifs, Polypes, Blanchissement',
        order: 2,
        durationMinutes: 2,
        mascot: 'ondine',
        rewardAmount: 40,
        exercises: {
          baseId: 'unit-4-2',
          story: {
            first: "Les récifs coralliens sont les villes géantes de l'océan.",
            second: 'Ils sont bâtis par de minuscules animaux appelés polypes.',
            firstVisual: 'Une ville sous-marine lumineuse et colorée faite de coraux.',
            secondVisual: 'Ondine regardant à la loupe un petit polype.',
            firstImage: storyImages.reef,
            secondImage: storyImages.water,
          },
          swipe: {
            question: 'Est-ce un danger mortel pour les récifs coralliens ?',
            correct: "Le réchauffement de l'eau",
            incorrect: 'Les poissons-clowns',
            subtitle: 'Stress thermique',
            correctFeedback: "Vrai ! L'eau trop chaude stresse le corail et provoque son blanchissement.",
            incorrectFeedback: 'Faux ! Ces poissons vivent en harmonie avec le récif.',
          },
          drag: {
            instruction: 'Ordonne les étapes du blanchissement corallien :',
            items: ["L'eau devient trop chaude", 'Le polype expulse son algue', "Le corail blanchit et s'affaiblit"],
          },
          quiz: {
            question: "Quelle est la véritable nature biologique d'un corail ?",
            wrongAnswers: ['Un rocher marin', 'Une plante aquatique'],
            correctAnswer: 'Un animal invertébré',
            successFeedback: 'Bingo ! Ces petits bâtisseurs créent des structures gigantesques.',
          },
        },
      }),
      makeUnit({
        id: 'unit-4-3',
        slug: 'le-bal-des-saisons',
        chapterId: 'chapter-4',
        title: 'Le Bal des Saisons',
        subtitle: 'Forêts tempérées et adaptation au rythme annuel.',
        concept: 'Saisons, Humus, Hibernation',
        order: 3,
        durationMinutes: 2,
        mascot: 'abeille-transparente',
        rewardAmount: 45,
        exercises: {
          baseId: 'unit-4-3',
          story: {
            first: 'Les forêts tempérées changent de visage quatre fois par an.',
            second: "Tout s'adapte : la sève ralentit, les animaux s'endorment.",
            firstVisual: 'Un même grand chêne divisé en quatre saisons.',
            secondVisual: 'Melli portant une écharpe et observant un loir endormi.',
            firstImage: storyImages.forest,
            secondImage: storyImages.field,
          },
          swipe: {
            question: 'Que font les arbres feuillus pour survivre au gel ?',
            correct: 'Perdre leurs feuilles',
            incorrect: 'Faire pousser des épines',
            subtitle: "Économiser l'eau",
            correctFeedback: "Exact ! C'est vital pour économiser l'eau et l'énergie pendant le froid.",
            incorrectFeedback: "Oups ! C'est plutôt la stratégie des sapins et des pins.",
          },
          drag: {
            instruction: 'Ordonne le cycle du sol de la forêt en automne :',
            items: ['Les feuilles mortes tombent', 'Insectes et champignons les mangent', "Création d'humus fertile"],
          },
          quiz: {
            question: "Comment appelle-t-on le sommeil profond des animaux en hiver ?",
            wrongAnswers: ['La migration', 'La métamorphose'],
            correctAnswer: "L'hibernation",
            successFeedback: "Parfait ! Ils consomment très peu d'énergie jusqu'au printemps.",
          },
        },
      }),
    ],
  },
  {
    id: 'chapter-5',
    slug: 'eveil-gardiens',
    title: "L'Éveil des Gardiens",
    subtitle: 'Comprendre les crises actuelles pour agir concrètement.',
    level: 'C1/C2',
    order: 5,
    durationMinutes: 120,
    difficulty: 'avance',
    units: [
      makeUnit({
        id: 'unit-5-1',
        slug: 'le-crepuscule-des-geants',
        chapterId: 'chapter-5',
        title: 'Le Crépuscule des Géants',
        subtitle: 'Déclin, menaces et sixième extinction.',
        concept: 'Déclin, Menaces, Anthropocène',
        order: 1,
        durationMinutes: 2,
        mascot: 'ondine',
        rewardAmount: 50,
        exercises: {
          baseId: 'unit-5-1',
          story: {
            first: 'De nombreuses espèces disparaissent à une vitesse jamais vue.',
            second: "C'est la sixième extinction, causée par les activités humaines.",
            firstVisual: "L'ombre d'un rhinocéros s'effaçant dans la brume.",
            secondVisual: "Ondine regardant tristement un sablier dont le sable s'écoule.",
            firstImage: storyImages.forest,
            secondImage: storyImages.water,
          },
          swipe: {
            question: 'Quelle est une cause majeure de cette extinction moderne ?',
            correct: 'La destruction des habitats',
            incorrect: "La chute d'une météorite",
            subtitle: 'Perdre sa maison',
            correctFeedback: 'Vrai ! Raser les forêts détruit la maison de millions d’espèces.',
            incorrectFeedback: "Faux ! Aujourd'hui, l'impact principal est humain.",
          },
          drag: {
            instruction: "Ordonne la ligne de temps du déclin d'une espèce :",
            items: ['Perte de son habitat', 'Population en chute libre', 'Extinction totale'],
          },
          quiz: {
            question: "Quel nom scientifique donne-t-on à notre époque d'impact humain ?",
            wrongAnswers: ['Le Jurassique', "L'Âge de Glace"],
            correctAnswer: "L'Anthropocène",
            successFeedback: 'Bingo ! Nos actions transforment toute la biosphère.',
          },
        },
      }),
      makeUnit({
        id: 'unit-5-2',
        slug: 'larsenal-de-lespoir',
        chapterId: 'chapter-5',
        title: "L'Arsenal de l'Espoir",
        subtitle: 'Conservation, restauration et solutions.',
        concept: 'Conservation, Restauration, Innovation',
        order: 2,
        durationMinutes: 2,
        mascot: 'abeille-transparente',
        rewardAmount: 50,
        exercises: {
          baseId: 'unit-5-2',
          story: {
            first: "Il n'est pas trop tard pour sauver notre belle planète.",
            second: 'Conservation et innovation sont nos meilleurs boucliers.',
            firstVisual: 'Des mains humaines plantant un jeune arbre dans la terre.',
            secondVisual: 'Melli brandissant un bouclier en forme de feuille.',
            firstImage: storyImages.sprout,
            secondImage: storyImages.forest,
          },
          swipe: {
            question: 'Est-ce une solution efficace pour protéger la biodiversité ?',
            correct: 'Créer des réserves naturelles',
            incorrect: 'Bétonner les rivières',
            subtitle: 'Un sanctuaire sûr',
            correctFeedback: 'Génial ! Ces zones offrent un refuge aux espèces menacées.',
            incorrectFeedback: "Oups ! Les cours d'eau naturels sont vitaux pour les écosystèmes.",
          },
          drag: {
            instruction: 'Ordonne les étapes pour restaurer une forêt détruite :',
            items: ['Protéger le sol nu', 'Replanter des espèces locales', 'Laisser la faune revenir'],
          },
          quiz: {
            question: 'Comment appelle-t-on les passages verts reliant les habitats naturels ?',
            wrongAnswers: ['Les autoroutes express', 'Les frontières invisibles'],
            correctAnswer: 'Les corridors écologiques',
            successFeedback: 'Super ! Ils permettent aux animaux de voyager et se reproduire en sécurité.',
          },
        },
      }),
      makeUnit({
        id: 'unit-5-3',
        slug: 'cultiver-lavenir',
        chapterId: 'chapter-5',
        title: "Cultiver l'Avenir",
        subtitle: 'Agroécologie, diversité et résilience.',
        concept: 'Permaculture, Synergie, Résilience',
        order: 3,
        durationMinutes: 2,
        mascot: 'sylva',
        rewardAmount: 100,
        exercises: {
          baseId: 'unit-5-3',
          story: {
            first: "L'agriculture de demain imite la sagesse de la forêt.",
            second: "C'est l'agroécologie : faire de la nature notre alliée.",
            firstVisual: 'Un champ foisonnant où légumes, arbres fruitiers et fleurs poussent ensemble.',
            secondVisual: 'Sylva récoltant un grand panier de légumes.',
            firstImage: storyImages.field,
            secondImage: storyImages.sprout,
          },
          swipe: {
            question: 'Est-ce un bon principe pour cultiver durablement ?',
            correct: 'Mélanger plusieurs espèces',
            incorrect: 'Asperger de pesticides chimiques',
            subtitle: 'La diversité protège',
            correctFeedback: "Génial ! Les plantes s'entraident et nourrissent le sol ensemble.",
            incorrectFeedback: "Aïe ! Ces produits empoisonnent la terre, l'eau et les insectes utiles.",
          },
          drag: {
            instruction: "Ordonne les étapes de création d'un jardin en permaculture :",
            items: ['Observer le terrain naturel', 'Planter des espèces variées', 'Récolter en enrichissant le sol'],
          },
          quiz: {
            question: 'Quel petit animal souterrain est le meilleur ami de la terre fertile ?',
            wrongAnswers: ['La taupe géante', 'La cigale bruyante'],
            correctAnswer: 'Le ver de terre',
            successFeedback: 'Bravo ! Ce laboureur infatigable aère le sol et crée un engrais naturel.',
          },
        },
      }),
    ],
  },
]

const flattenUnits = (chapters: AcademyChapter[] = ACADEMY_CURRICULUM): AcademyUnit[] =>
  chapters.flatMap((chapter) => chapter.units)

const getLocalDayKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getYesterdayDayKey = (dayKey: string) => {
  const [year, month, day] = dayKey.split('-').map(Number)
  if (!year || !month || !day) {
    return ''
  }

  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return getLocalDayKey(date)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getDefaultProgress = (viewerId: string): AcademyProgress => {
  const firstUnit = flattenUnits()[0]
  if (!firstUnit) {
    throw new Error('Academy curriculum must contain at least one unit.')
  }

  return {
    viewerId,
    completedUnitIds: [],
    activeUnitId: firstUnit.id,
    unitResults: {},
    seedsBalance: 0,
    streak: {
      current: 0,
      best: 0,
      lastActivityDay: null,
      completedDays: [],
    },
    lives: {
      remaining: 5,
      updatedAt: new Date().toISOString(),
    },
  }
}

export const getDefaultAcademyProgress = (viewerId: string): AcademyProgress =>
  getDefaultProgress(viewerId)

const getNextActiveUnitId = (completedUnitIds: string[]) => {
  const completed = new Set(completedUnitIds)
  const nextUnit = flattenUnits().find((unit) => !completed.has(unit.id))
  return nextUnit?.id ?? flattenUnits().at(-1)?.id ?? ''
}

const normalizeProgress = (viewerId: string, value: unknown): AcademyProgress => {
  const defaults = getDefaultProgress(viewerId)
  if (!isRecord(value)) {
    return defaults
  }

  const allUnitIds = new Set(flattenUnits().map((unit) => unit.id))
  const completedUnitIds = Array.isArray(value.completedUnitIds)
    ? value.completedUnitIds.filter((id): id is string => typeof id === 'string' && allUnitIds.has(id))
    : defaults.completedUnitIds

  const unitResults = isRecord(value.unitResults)
    ? Object.fromEntries(
        Object.entries(value.unitResults).filter(
          ([unitId, result]) => allUnitIds.has(unitId) && isRecord(result),
        ),
      ) as Record<string, AcademyUnitResult>
    : defaults.unitResults

  const streak = isRecord(value.streak) ? value.streak : {}
  const lives = isRecord(value.lives) ? value.lives : {}

  return {
    viewerId,
    completedUnitIds,
    activeUnitId: getNextActiveUnitId(completedUnitIds),
    unitResults,
    seedsBalance:
      typeof value.seedsBalance === 'number' && Number.isFinite(value.seedsBalance)
        ? Math.max(0, Math.floor(value.seedsBalance))
        : defaults.seedsBalance,
    streak: {
      current:
        typeof streak.current === 'number' && Number.isFinite(streak.current)
          ? Math.max(0, Math.floor(streak.current))
          : defaults.streak.current,
      best:
        typeof streak.best === 'number' && Number.isFinite(streak.best)
          ? Math.max(0, Math.floor(streak.best))
          : defaults.streak.best,
      lastActivityDay:
        typeof streak.lastActivityDay === 'string' && streak.lastActivityDay
          ? streak.lastActivityDay
          : null,
      completedDays: Array.isArray(streak.completedDays)
        ? streak.completedDays.filter((day): day is string => typeof day === 'string')
        : [],
    },
    lives: {
      remaining:
        typeof lives.remaining === 'number' && Number.isFinite(lives.remaining)
          ? Math.max(0, Math.min(5, Math.floor(lives.remaining)))
          : defaults.lives.remaining,
      updatedAt:
        typeof lives.updatedAt === 'string' && lives.updatedAt
          ? lives.updatedAt
          : defaults.lives.updatedAt,
    },
  }
}

const readStoredProgress = (): Record<string, unknown> => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(ACADEMY_PROGRESS_STORAGE_KEY)
    if (!rawValue) {
      return {}
    }

    const parsed = JSON.parse(rawValue) as unknown
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

const writeStoredProgress = (entries: Record<string, AcademyProgress>) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ACADEMY_PROGRESS_STORAGE_KEY, JSON.stringify(entries))
}

const getUnitById = (unitId: string): AcademyUnit | null =>
  flattenUnits().find((unit) => unit.id === unitId) ?? null

const getStoredProgressEntries = (): Record<string, AcademyProgress> => {
  const rawEntries = readStoredProgress()
  return Object.fromEntries(
    Object.entries(rawEntries).map(([viewerId, progress]) => [
      viewerId,
      normalizeProgress(viewerId, progress),
    ]),
  )
}

export const localAcademyRepository: AcademyRepository = {
  getCurriculum() {
    return ACADEMY_CURRICULUM
  },

  getProgress(viewerId) {
    const entries = getStoredProgressEntries()
    return entries[viewerId] ?? getDefaultProgress(viewerId)
  },

  saveProgress(viewerId, progress) {
    const nextProgress = normalizeProgress(viewerId, progress)
    const entries = getStoredProgressEntries()
    writeStoredProgress({
      ...entries,
      [viewerId]: nextProgress,
    })
    return nextProgress
  },

  completeUnit(viewerId, unitId, result) {
    const unit = getUnitById(unitId)
    if (!unit) {
      return this.getProgress(viewerId)
    }

    const current = this.getProgress(viewerId)
    const wasAlreadyCompleted = current.completedUnitIds.includes(unitId)
    const completedUnitIds = wasAlreadyCompleted
      ? current.completedUnitIds
      : [...current.completedUnitIds, unitId]

    const timestamp = new Date().toISOString()
    const today = getLocalDayKey()
    const yesterday = getYesterdayDayKey(today)
    const completedDays = current.streak.completedDays.includes(today)
      ? current.streak.completedDays
      : [...current.streak.completedDays, today].sort()
    const nextCurrentStreak =
      current.streak.lastActivityDay === today
        ? current.streak.current || 1
        : current.streak.lastActivityDay === yesterday
          ? current.streak.current + 1
          : 1

    return this.saveProgress(viewerId, {
      ...current,
      completedUnitIds,
      activeUnitId: getNextActiveUnitId(completedUnitIds),
      unitResults: {
        ...current.unitResults,
        [unitId]: {
          unitId,
          completedAt: current.unitResults[unitId]?.completedAt ?? timestamp,
          score: Math.max(current.unitResults[unitId]?.score ?? 0, result.score),
          mistakes: Math.min(current.unitResults[unitId]?.mistakes ?? result.mistakes, result.mistakes),
          rewardEarned: current.unitResults[unitId]?.rewardEarned ?? unit.reward.amount,
        },
      },
      seedsBalance: wasAlreadyCompleted ? current.seedsBalance : current.seedsBalance + unit.reward.amount,
      streak: {
        current: nextCurrentStreak,
        best: Math.max(current.streak.best, nextCurrentStreak),
        lastActivityDay: today,
        completedDays,
      },
      lives: {
        remaining: 5,
        updatedAt: timestamp,
      },
    })
  },

  resetProgress(viewerId) {
    const entries = getStoredProgressEntries()
    const nextProgress = getDefaultProgress(viewerId)
    writeStoredProgress({
      ...entries,
      [viewerId]: nextProgress,
    })
    return nextProgress
  },
}

export const academyRepository: AcademyRepository = localAcademyRepository

export function getAllChapters(): AcademyChapter[] {
  return academyRepository.getCurriculum()
}

export function getAllUnits(): AcademyUnit[] {
  return flattenUnits()
}

export function getChapterBySlug(slug: string): AcademyChapter | null {
  return ACADEMY_CURRICULUM.find((chapter) => chapter.slug === slug || chapter.id === slug) ?? null
}

export function getUnitBySlug(chapterSlug: string, unitSlug: string): AcademyUnit | null {
  const chapter = getChapterBySlug(chapterSlug)
  return (
    chapter?.units.find((unit) => unit.slug === unitSlug || unit.id === unitSlug) ??
    null
  )
}

export function getNextUnit(unitId: string): AcademyUnit | null {
  const units = flattenUnits()
  const currentIndex = units.findIndex((unit) => unit.id === unitId)
  return currentIndex >= 0 ? units[currentIndex + 1] ?? null : null
}

export function decorateAcademyWithProgress(
  chapters: AcademyChapter[],
  progress: AcademyProgress,
): AcademyChapterWithStatus[] {
  const completed = new Set(progress.completedUnitIds)

  return chapters.map((chapter) => {
    const units = chapter.units.map((unit) => {
      const status: AcademyUnitStatus = completed.has(unit.id)
        ? 'completed'
        : unit.id === progress.activeUnitId
          ? 'active'
          : 'locked'

      return {
        ...unit,
        status,
        result: progress.unitResults[unit.id] ?? null,
      }
    })
    const completedUnitsCount = units.filter((unit) => unit.status === 'completed').length
    const status: AcademyChapterStatus =
      completedUnitsCount === units.length
        ? 'completed'
        : units.some((unit) => unit.status === 'active')
          ? 'active'
          : 'locked'

    return {
      ...chapter,
      status,
      completedUnitsCount,
      units,
    }
  })
}

export function getCurrentChapter(
  chapters: AcademyChapterWithStatus[],
): AcademyChapterWithStatus {
  const currentChapter =
    chapters.find((chapter) => chapter.status === 'active') ??
    chapters.find((chapter) => chapter.status === 'locked') ??
    chapters[chapters.length - 1]

  if (!currentChapter) {
    throw new Error('Academy surface requires at least one chapter.')
  }

  return currentChapter
}

export function getNextChapter(
  chapters: AcademyChapterWithStatus[],
  currentChapterId: string,
): AcademyChapterWithStatus | null {
  const currentIndex = chapters.findIndex((chapter) => chapter.id === currentChapterId)
  return currentIndex >= 0 ? chapters[currentIndex + 1] ?? null : null
}

export function getMonthActivityDays(progress: AcademyProgress, date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const completed = new Set(progress.streak.completedDays)

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const dayKey = getLocalDayKey(new Date(year, month, day))
    return {
      day,
      dayKey,
      isCompleted: completed.has(dayKey),
      isToday: dayKey === getLocalDayKey(date),
    }
  })
}

export function getAcademyMonthLabel(date = new Date(), locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date)
}
