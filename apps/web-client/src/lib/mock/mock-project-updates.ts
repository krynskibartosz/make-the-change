import type { ProjectUpdate } from '@/types/project'
import {
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_PROJECT_SARDINIA_SLUG,
} from '@/lib/mock/mock-ids'

/**
 * Mock data — flux terrain (Phase 8 du refactor).
 * Chaque projet a 2-3 updates récentes du partenaire/producteur.
 * Trié par date décroissante dans les selectors.
 */
const PROJECT_UPDATES: ProjectUpdate[] = [
  // ============ Antsirabe (apiculteurs) ============
  {
    id: 'update-antsirabe-2026-05',
    projectSlug: MOCK_PROJECT_ANTSIRABE_SLUG,
    postedAt: '2026-05-12T08:00:00.000Z',
    title: '18 kg de miel récoltés ce mois-ci',
    body: 'Les apiculteurs ont inspecté 12 ruches et récolté 18 kg de miel polyfloral. Les pots sont en cours d\'étiquetage à la miellerie partenaire.',
    imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
    authorName: 'Hary, apiculteur à Antsirabe',
    milestone: 'production',
  },
  {
    id: 'update-antsirabe-2026-04',
    projectSlug: MOCK_PROJECT_ANTSIRABE_SLUG,
    postedAt: '2026-04-03T10:30:00.000Z',
    title: 'Inspection de printemps : ruches en bonne santé',
    body: 'Les colonies ont bien passé la saison sèche. 8 ruches montrent une activité de ponte intense, signe d\'une bonne dynamique pour la récolte à venir.',
    authorName: 'Hary, apiculteur à Antsirabe',
    milestone: 'reporting',
  },

  // ============ Manakara (miellerie) ============
  {
    id: 'update-manakara-2026-05',
    projectSlug: MOCK_PROJECT_MANAKARA_SLUG,
    postedAt: '2026-05-15T14:20:00.000Z',
    title: 'Première livraison de la saison expédiée',
    body: 'La miellerie a expédié 320 pots de miel d\'eucalyptus vers Bruxelles cette semaine. Le miel arrivera en boutique d\'ici fin mai.',
    imageUrl: '/images/projects/miellerie-manakara.jpg',
    authorName: 'Voary, responsable miellerie',
    milestone: 'delivery',
  },
  {
    id: 'update-manakara-2026-04',
    projectSlug: MOCK_PROJECT_MANAKARA_SLUG,
    postedAt: '2026-04-22T09:15:00.000Z',
    title: '450 kg de miel mis en pot',
    body: 'Le contrôle qualité est terminé. Les pots de la récolte d\'avril ont été remplis et étiquetés sur place selon les normes de traçabilité.',
    authorName: 'Voary, responsable miellerie',
    milestone: 'production',
  },

  // ============ Coral (restauration corallienne) ============
  {
    id: 'update-coral-2026-05',
    projectSlug: MOCK_PROJECT_CORAL_SLUG,
    postedAt: '2026-05-08T11:00:00.000Z',
    title: '24 fragments transplantés sur la zone 3',
    body: 'L\'équipe a effectué 4 plongées cette semaine pour transplanter 24 fragments d\'Acropora élevés en nurserie. Croissance attendue : 15 cm sur 6 mois.',
    imageUrl: '/images/projects/coral-restoration.jpg',
    authorName: 'Putri, marine biologist',
    milestone: 'production',
  },
  {
    id: 'update-coral-2026-03',
    projectSlug: MOCK_PROJECT_CORAL_SLUG,
    postedAt: '2026-03-20T07:45:00.000Z',
    title: 'Suivi des transplants : taux de survie à 78%',
    body: 'Le suivi trimestriel sur la zone 1 montre un taux de survie de 78% pour les fragments transplantés en décembre. Trois espèces de poissons sont déjà revenues.',
    authorName: 'Putri, marine biologist',
    milestone: 'reporting',
  },

  // ============ Habeebee (Belgique) ============
  {
    id: 'update-habeebee-2026-05',
    projectSlug: MOCK_PROJECT_HABEEBEE_SLUG,
    postedAt: '2026-05-10T16:00:00.000Z',
    title: 'Installation de 3 nouvelles ruches à Bruxelles',
    body: 'Trois ruches ont été installées sur les toits du Mont des Arts. Elles rejoignent le réseau urbain Habeebee et seront suivies en continu.',
    authorName: 'Équipe Habeebee',
    milestone: 'production',
  },
  {
    id: 'update-habeebee-2026-04',
    projectSlug: MOCK_PROJECT_HABEEBEE_SLUG,
    postedAt: '2026-04-18T13:30:00.000Z',
    title: 'Atelier découverte au parc Josaphat',
    body: '32 personnes ont participé à l\'atelier d\'observation des pollinisateurs ce weekend. Une trentaine d\'espèces d\'abeilles sauvages recensées sur le site.',
    milestone: 'reporting',
  },

  // ============ Sardaigne (oliviers) ============
  {
    id: 'update-sardinia-2026-05',
    projectSlug: MOCK_PROJECT_SARDINIA_SLUG,
    postedAt: '2026-05-05T09:00:00.000Z',
    title: 'Floraison des oliviers en avance',
    body: 'Avec un printemps précoce, les oliviers sont déjà en pleine floraison. Si la météo se maintient, on prévoit une bonne récolte en novembre.',
    authorName: 'Giovanni, oléiculteur',
    milestone: 'reporting',
  },
  {
    id: 'update-sardinia-2026-03',
    projectSlug: MOCK_PROJECT_SARDINIA_SLUG,
    postedAt: '2026-03-15T11:20:00.000Z',
    title: 'Taille de printemps terminée sur 140 arbres',
    body: 'L\'équipe a terminé la taille des 140 oliviers de la parcelle nord. Pratique manuelle pour préserver la structure des arbres et la biodiversité.',
    authorName: 'Giovanni, oléiculteur',
    milestone: 'production',
  },
]

export function getMockProjectUpdates(projectSlug: string): ProjectUpdate[] {
  return PROJECT_UPDATES.filter((update) => update.projectSlug === projectSlug).sort(
    (a, b) => b.postedAt.localeCompare(a.postedAt),
  )
}

export function getLatestProjectUpdate(projectSlug: string): ProjectUpdate | null {
  const updates = getMockProjectUpdates(projectSlug)
  return updates[0] ?? null
}
