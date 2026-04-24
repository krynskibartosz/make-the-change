// ─────────────────────────────────────────────────────────────
// Academy Mock Data — lib/mock/mock-academy.ts
// Structure multi-chapitres avec états variés pour tester tous
// les flows : complété, actif, verrouillé, next-chapter, etc.
// ─────────────────────────────────────────────────────────────

export type UnitStatus    = 'completed' | 'active' | 'locked'
export type ChapterStatus = 'completed' | 'active' | 'locked'
export type MascotteKey   = 'ondine' | 'sylva' | 'abeille-transparente'

// ─── Unit ─────────────────────────────────────────────────────
export type AcademyUnit = {
  id: string
  title: string
  status: UnitStatus
  reward: string
  mascotte: MascotteKey
  description?: string
}

// ─── Chapter ──────────────────────────────────────────────────
export type AcademyChapter = {
  id: number
  title: string
  subtitle: string
  level: string
  status: ChapterStatus
  units: AcademyUnit[]
}

// ─── Full syllabus ────────────────────────────────────────────
export type AcademySyllabus = {
  /** Index du chapitre actuellement actif (0-based) */
  currentChapterIndex: number
  chapters: AcademyChapter[]
}

// ─── Mock data ────────────────────────────────────────────────
const MOCK_ACADEMY_SYLLABUS: AcademySyllabus = {
  currentChapterIndex: 1, // L'utilisateur est au chapitre 2

  chapters: [
    // ── CHAPITRE 1 : terminé ──────────────────────────────────
    {
      id: 1,
      title: "L'Alphabet Originel",
      subtitle: "Les éléments fondamentaux de la nature.",
      level: "A1",
      status: "completed",
      units: [
        {
          id: '1.1',
          title: 'Les Forges de la Vie',
          status: 'completed',
          reward: '10 💧',
          mascotte: 'ondine',
          description: 'Soleil, eau, sols… Découvre les 3 éléments qui créent l\'énergie de notre planète.',
        },
        {
          id: '1.2',
          title: 'Le Peuple Émeraude',
          status: 'completed',
          reward: '10 🍃',
          mascotte: 'sylva',
          description: 'Les plantes sont les usines magiques de notre monde. Explore leurs secrets.',
        },
        {
          id: '1.3',
          title: 'Le Bestiaire Sauvage',
          status: 'completed',
          reward: '15 🐾',
          mascotte: 'abeille-transparente',
          description: 'Découvre les animaux fascinants qui peuplent nos écosystèmes.',
        },
        {
          id: '1.4',
          title: 'Les Gardiens de l\'Eau',
          status: 'completed',
          reward: '20 💧',
          mascotte: 'ondine',
          description: 'Comment l\'eau voyage-t-elle à travers la planète ? Le grand cycle révélé.',
        },
      ],
    },

    // ── CHAPITRE 2 : actif (en cours) ────────────────────────
    {
      id: 2,
      title: "La Grammaire des Espèces",
      subtitle: "Comment les êtres vivants interagissent et s'allient.",
      level: "A2",
      status: "active",
      units: [
        {
          id: '2.1',
          title: 'Le Festin des Prédateurs',
          status: 'completed',
          reward: '20 🐺',
          mascotte: 'ondine',
          description: 'Dans la nature, tout le monde mange ou est mangé. Explore la chaîne alimentaire.',
        },
        {
          id: '2.2',
          title: 'Les Alliés Invisibles',
          status: 'completed',
          reward: '15 🤝',
          mascotte: 'sylva',
          description: 'Symbioses, mutualismes, commensalismes — les espèces s\'entraident plus qu\'on ne le croit.',
        },
        {
          id: '2.3',
          title: 'La Guerre des Territoires',
          status: 'active',
          reward: '20 ⚔️',
          mascotte: 'abeille-transparente',
          description: 'Compétition, parasitisme, mimétisme : les stratégies secrètes du règne animal.',
        },
        {
          id: '2.4',
          title: 'L\'Équilibre Fragile',
          status: 'locked',
          reward: '25 ⚖️',
          mascotte: 'ondine',
          description: 'Qu\'arrive-t-il quand une espèce clé disparaît ? L\'effet domino de la biodiversité.',
        },
      ],
    },

    // ── CHAPITRE 3 : verrouillé ───────────────────────────────
    {
      id: 3,
      title: "L'Économie de la Biosphère",
      subtitle: "Les cycles qui maintiennent notre planète en marche.",
      level: "B1",
      status: "locked",
      units: [
        { id: '3.1', title: 'Le Cycle du Carbone',     status: 'locked', reward: '25 🌡️', mascotte: 'ondine',              description: 'Le carbone circule partout — atmosphère, océan, sol. Comprendre ce cycle, c\'est comprendre le climat.' },
        { id: '3.2', title: 'L\'Azote, Chef Invisible', status: 'locked', reward: '25 🧪', mascotte: 'sylva',               description: 'Sans azote, pas de protéines, pas de vie. Découvre comment les plantes s\'en emparent.' },
        { id: '3.3', title: 'L\'Eau qui Voyage',        status: 'locked', reward: '30 🌊', mascotte: 'abeille-transparente', description: 'Évaporation, précipitations, filtration : le voyage infini de chaque goutte d\'eau.' },
        { id: '3.4', title: 'Les Poumons du Monde',     status: 'locked', reward: '35 🌳', mascotte: 'ondine',              description: 'Les forêts régulent le climat planétaire. Mais pour combien de temps encore ?' },
      ],
    },

    // ── CHAPITRE 4 : verrouillé ───────────────────────────────
    {
      id: 4,
      title: "Les Sanctuaires Sauvages",
      subtitle: "Habitats uniques, isolés et fragiles.",
      level: "B2",
      status: "locked",
      units: [
        { id: '4.1', title: 'Les Abysses', status: 'locked', reward: '30 🌑', mascotte: 'ondine', description: 'Un monde sans lumière, sans chaleur, pourtant fourmillant de vie.' },
        { id: '4.2', title: 'La Canopée', status: 'locked', reward: '30 🌴', mascotte: 'sylva',  description: 'À 50 mètres du sol, une jungle dans la jungle — les secrets de la canopée.' },
        { id: '4.3', title: 'La Toundra', status: 'locked', reward: '35 ❄️', mascotte: 'abeille-transparente', description: 'Où survivre semble impossible. Pourtant, la vie a trouvé un moyen.' },
        { id: '4.4', title: 'Les Récifs Coralliens', status: 'locked', reward: '40 🪸', mascotte: 'ondine', description: 'Le paradis sous-marin qui nourrit 25 % de la vie marine — et qui disparaît.' },
      ],
    },
  ],
}

// ─── Accesseurs ───────────────────────────────────────────────

export function getMockAcademySyllabus(): AcademySyllabus {
  return MOCK_ACADEMY_SYLLABUS
}

/** Renvoie le chapitre courant (celui que l'utilisateur est en train de faire) */
export function getCurrentChapter(): AcademyChapter {
  const s = MOCK_ACADEMY_SYLLABUS
  return s.chapters[s.currentChapterIndex]
}

/** Renvoie le chapitre suivant, ou null si on est au dernier */
export function getNextChapter(): AcademyChapter | null {
  const s = MOCK_ACADEMY_SYLLABUS
  return s.chapters[s.currentChapterIndex + 1] ?? null
}

/** Renvoie tous les chapitres pour la page /academy/chapters */
export function getAllChapters(): AcademyChapter[] {
  return MOCK_ACADEMY_SYLLABUS.chapters
}
