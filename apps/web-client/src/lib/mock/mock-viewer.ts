import { getMockImpactPoints } from '@/lib/mock/mock-member-data'
import { FACTION_TO_TRIBE_ID, MOCK_EXISTING_VIEWER_ID } from '@/lib/mock/mock-ids'
import type { Faction, MockViewerSession, Profile, Viewer } from '@/lib/mock/types'

type MockProfileSeed = Omit<Profile, 'faction'> & {
  defaultFaction: Faction | null
}

const EXISTING_VIEWER_PROFILE: MockProfileSeed = {
  id: MOCK_EXISTING_VIEWER_ID,
  displayName: 'Bartosz Krynski',
  firstName: 'Bartosz',
  lastName: 'Krynski',
  username: 'bartosz_k',
  email: 'bartosz@make-the-change.com',
  avatarUrl: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=320&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
  defaultFaction: 'Vie Sauvage',
  memberSince: '2026-01-12',
  streakDays: 12,
  points: 2450,
  totalSeedsContributed: 2450,
  beesSaved: 3800,
  honeyGeneratedKg: 0.77,
  co2CapturedKg: 3.85,
  phone: '+32 470 00 00 00',
  bio: "Je soutiens les projets qui rendent l'impact concret et visible au quotidien.",
  city: 'Bruxelles',
  country: 'Belgique',
  addressStreet: 'Rue du Nectar 12',
  addressPostalCode: '1000',
  tribeIds: ['campus-biodiversity-lab'],
}

const PUBLIC_PROFILE_DIRECTORY: Record<string, Partial<MockProfileSeed>> = {
  'thomas-m': {
    displayName: 'Thomas M.',
    username: 'thomas_m',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    defaultFaction: 'Terres & Forêts',
    points: 1820,
    streakDays: 9,
    city: 'Lyon',
    country: 'France',
    tribeIds: ['agroforest-pioneers'],
  },
  'eco-guerrier': {
    displayName: 'EcoGuerrier',
    username: 'eco_guerrier',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80',
    defaultFaction: 'Vie Sauvage',
    points: 3210,
    streakDays: 7,
    city: 'Namur',
    country: 'Belgique',
    tribeIds: ['zero-dechet'],
  },
  'sarah-l': {
    displayName: 'Sarah L.',
    username: 'sarah_l',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
    defaultFaction: 'Vie Sauvage',
    points: 2105,
    city: 'Lille',
    country: 'France',
    tribeIds: ['campus-biodiversity-lab'],
  },
  'citoyen-anonyme': {
    displayName: 'Citoyen Anonyme',
    username: 'citoyen_anonyme',
    avatarUrl: null,
    defaultFaction: 'Artisans Locaux',
    points: 540,
    city: 'Liege',
    country: 'Belgique',
    tribeIds: ['agroforest-pioneers'],
  },
  'marie-claire-b': {
    displayName: 'Marie-Claire B.',
    username: 'marie_claire_b',
    avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=320&q=80',
    defaultFaction: 'Artisans Locaux',
    points: 2790,
    city: 'Bordeaux',
    country: 'France',
    tribeIds: ['ocean-mangrove-circle'],
  },
  'lucas-v': {
    displayName: 'Lucas V.',
    username: 'lucas_v',
    avatarUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=320&q=80',
    defaultFaction: 'Terres & Forêts',
    points: 1630,
    city: 'Namur',
    country: 'Belgique',
    tribeIds: ['zero-dechet'],
  },
  'natura-mind': {
    displayName: 'NaturaMind',
    username: 'natura_mind',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
    defaultFaction: 'Terres & Forêts',
    points: 3560,
    city: 'Bruxelles',
    country: 'Belgique',
    tribeIds: ['campus-biodiversity-lab'],
  },
  'amira-k': {
    displayName: 'Amira K.',
    username: 'amira_k',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=320&q=80',
    defaultFaction: 'Vie Sauvage',
    points: 2275,
    city: 'Anvers',
    country: 'Belgique',
    tribeIds: ['ocean-mangrove-circle'],
  },
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const splitDisplayName = (displayName: string) => {
  const trimmed = displayName.trim()
  if (!trimmed) {
    return { firstName: '', lastName: '' }
  }

  const [firstName, ...rest] = trimmed.split(/\s+/)
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

const buildGenericProfile = (session: MockViewerSession): Profile => {
  const names = splitDisplayName(session.displayName)

  return {
    id: session.viewerId,
    displayName: session.displayName,
    firstName: names.firstName || session.displayName,
    lastName: names.lastName || null,
    username: slugify(session.displayName).replace(/-/g, '_'),
    email: session.email,
    avatarUrl: session.avatarUrl ?? null,
    coverUrl: null,
    faction: session.faction,
    memberSince: '2026-04-17',
    streakDays: 1,
    points: 120,
    totalSeedsContributed: 120,
    beesSaved: 240,
    honeyGeneratedKg: 0.05,
    co2CapturedKg: 0.24,
    phone: '',
    bio: '',
    city: 'Bruxelles',
    country: 'Belgique',
    addressStreet: 'Avenue du Vivant 8',
    addressPostalCode: '1050',
    tribeIds: session.faction ? [FACTION_TO_TRIBE_ID[session.faction]] : [],
  }
}

export const getMockExistingViewerSession = (email?: string): MockViewerSession => ({
  viewerId: EXISTING_VIEWER_PROFILE.id,
  displayName: EXISTING_VIEWER_PROFILE.displayName,
  email: email || EXISTING_VIEWER_PROFILE.email,
  faction: EXISTING_VIEWER_PROFILE.defaultFaction,
  avatarUrl: EXISTING_VIEWER_PROFILE.avatarUrl,
})

export const createMockRegisteredViewerSession = ({
  displayName,
  email,
}: {
  displayName: string
  email: string
}): MockViewerSession => ({
  viewerId: MOCK_EXISTING_VIEWER_ID,
  displayName: displayName || 'Nouveau membre',
  email,
  faction: null,
  avatarUrl: null,
})

export const getMockTribeIdsForFaction = (faction: Faction | null): string[] => {
  return faction ? [FACTION_TO_TRIBE_ID[faction]] : []
}

export const getMockViewer = (session: MockViewerSession): Viewer => {
  const profile = getMockProfile(session)

  return {
    viewerId: session.viewerId,
    displayName: profile.displayName,
    email: session.email,
    faction: session.faction,
    avatarUrl: profile.avatarUrl,
  }
}

export const getMockProfile = (session: MockViewerSession): Profile => {
  const activeFaction = session.faction ?? EXISTING_VIEWER_PROFILE.defaultFaction

  if (session.viewerId === EXISTING_VIEWER_PROFILE.id) {
    const names = splitDisplayName(session.displayName)

    return {
      ...EXISTING_VIEWER_PROFILE,
      displayName: session.displayName,
      firstName: names.firstName || EXISTING_VIEWER_PROFILE.firstName || session.displayName,
      lastName: names.lastName || EXISTING_VIEWER_PROFILE.lastName || null,
      email: session.email,
      avatarUrl: session.avatarUrl ?? EXISTING_VIEWER_PROFILE.avatarUrl,
      points: getMockImpactPoints(session.viewerId),
      totalSeedsContributed:
        EXISTING_VIEWER_PROFILE.totalSeedsContributed ?? getMockImpactPoints(session.viewerId),
      faction: activeFaction,
      tribeIds: activeFaction ? getMockTribeIdsForFaction(activeFaction) : [],
    }
  }

  return buildGenericProfile(session)
}

export const getMockPublicProfile = (
  id: string,
  viewerSession?: MockViewerSession | null,
): Profile | null => {
  if (viewerSession && viewerSession.viewerId === id) {
    return getMockProfile(viewerSession)
  }

  const directoryEntry = PUBLIC_PROFILE_DIRECTORY[id]
  if (!directoryEntry) {
    return null
  }

  return {
    id,
    displayName: directoryEntry.displayName || 'Membre',
    username: directoryEntry.username || slugify(directoryEntry.displayName || 'membre').replace(/-/g, '_'),
    email: `${slugify(directoryEntry.displayName || 'membre')}@make-the-change.mock`,
    avatarUrl: directoryEntry.avatarUrl === undefined ? null : directoryEntry.avatarUrl,
    faction: directoryEntry.defaultFaction ?? null,
    memberSince: '2026-02-01',
    streakDays: directoryEntry.streakDays ?? 5,
    points: directoryEntry.points ?? 900,
    totalSeedsContributed: Math.max(180, Math.round((directoryEntry.points ?? 900) * 1.15)),
    beesSaved: Math.max(180, Math.round((directoryEntry.points ?? 900) * 1.4)),
    honeyGeneratedKg: Number(((directoryEntry.points ?? 900) / 3000).toFixed(2)),
    co2CapturedKg: Number(((directoryEntry.points ?? 900) / 550).toFixed(2)),
    city: directoryEntry.city || 'Bruxelles',
    country: directoryEntry.country || 'Belgique',
    addressStreet: 'Rue des Pollinisateurs 1',
    addressPostalCode: '1000',
    tribeIds: directoryEntry.tribeIds || [],
  }
}
