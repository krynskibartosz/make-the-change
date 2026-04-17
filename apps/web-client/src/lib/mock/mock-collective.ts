import type { Guild } from '@make-the-change/core/shared'
import type { CollectivePost, MockViewerSession } from '@/lib/mock/types'
import { getMockTribeIdsForFaction } from '@/lib/mock/mock-viewer'

const MOCK_COLLECTIVE_GUILDS: Guild[] = [
  {
    id: 'guild-agroforest-pioneers',
    name: 'Agroforest Pioneers',
    slug: 'agroforest-pioneers',
    description: 'Des membres qui regenerent les terres et les corridors forestiers.',
    logo_url:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=200',
    banner_url:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=900',
    owner_id: 'mock-viewer-bartosz',
    type: 'open',
    metadata: {},
    created_at: '2026-01-10T08:00:00.000Z',
    updated_at: '2026-04-01T08:00:00.000Z',
    members_count: 42,
    xp_total: 1420,
    is_member: false,
  },
  {
    id: 'guild-ocean-mangrove-circle',
    name: 'Ocean Mangrove Circle',
    slug: 'ocean-mangrove-circle',
    description: 'Une tribu qui protege les zones humides, recifs et mangroves.',
    logo_url:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=200',
    banner_url:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=900',
    owner_id: 'mock-viewer-bartosz',
    type: 'open',
    metadata: {},
    created_at: '2026-01-18T08:00:00.000Z',
    updated_at: '2026-04-01T08:00:00.000Z',
    members_count: 48,
    xp_total: 1180,
    is_member: false,
  },
  {
    id: 'guild-campus-biodiversity-lab',
    name: 'Campus Biodiversity Lab',
    slug: 'campus-biodiversity-lab',
    description: 'Une communaute de terrain qui observe et restaure le vivant.',
    logo_url:
      'https://images.unsplash.com/photo-1516571748831-5d81767b788d?auto=format&fit=crop&q=80&w=200',
    banner_url:
      'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&q=80&w=900',
    owner_id: 'mock-viewer-bartosz',
    type: 'open',
    metadata: {},
    created_at: '2026-01-22T08:00:00.000Z',
    updated_at: '2026-04-01T08:00:00.000Z',
    members_count: 64,
    xp_total: 1525,
    is_member: false,
  },
  {
    id: 'guild-zero-dechet',
    name: 'Zero Dechet Makers',
    slug: 'zero-dechet',
    description: 'Des artisans et voisins qui reduisent les dechets au quotidien.',
    logo_url:
      'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&q=80&w=200',
    banner_url:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=900',
    owner_id: 'mock-viewer-bartosz',
    type: 'open',
    metadata: {},
    created_at: '2026-02-03T08:00:00.000Z',
    updated_at: '2026-04-01T08:00:00.000Z',
    members_count: 57,
    xp_total: 1340,
    is_member: false,
  },
]

const MOCK_COLLECTIVE_FEED: CollectivePost[] = [
  {
    id: 'evt-1',
    name: 'Thomas M.',
    profileId: 'thomas-m',
    time: 'Il y a 2 min',
    action: 'Vient de soutenir le projet Foret Mediterraneenne',
    iconName: 'sprout',
    iconColor: 'text-green-500',
    actionHighlight: 'Foret Mediterraneenne',
    likes: 24,
    bravos: 8,
    avatarColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'evt-2',
    name: 'EcoGuerrier',
    profileId: 'eco-guerrier',
    time: 'Il y a 14 min',
    action: 'A valide une Serie de 7 jours',
    iconName: 'trophy',
    iconColor: 'text-amber-400',
    likes: 41,
    bravos: 17,
    avatarColor: 'bg-lime-500/20 text-lime-400',
  },
  {
    id: 'tribe-1',
    name: 'Agroforest Pioneers',
    time: 'Il y a 30 min',
    action: 'Vient d’atteindre son objectif mensuel : 5 000 arbres plantes !',
    iconName: 'trophy',
    iconColor: 'text-amber-400',
    likes: 284,
    bravos: 96,
    avatarColor: 'bg-lime-500/20 text-lime-400',
    isTribe: true,
    tribeName: 'Agroforest Pioneers',
    tribeSlug: 'agroforest-pioneers',
  },
  {
    id: 'evt-3',
    name: 'Sarah L.',
    profileId: 'sarah-l',
    time: 'Il y a 1 heure',
    action: 'A debloque le Lynx Boreal dans le BioDex',
    iconName: 'paw',
    iconColor: 'text-purple-400',
    likes: 63,
    bravos: 22,
    avatarColor: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: 'evt-4',
    name: 'Citoyen Anonyme',
    profileId: 'citoyen-anonyme',
    time: 'Il y a 2 heures',
    action: 'A rejoint la Tribu Agroforest Pioneers',
    iconName: 'handshake',
    iconColor: 'text-zinc-400',
    likes: 18,
    bravos: 5,
    avatarColor: 'bg-zinc-500/20 text-zinc-400',
    tribeName: 'Agroforest Pioneers',
    tribeSlug: 'agroforest-pioneers',
  },
  {
    id: 'evt-5',
    name: 'Marie-Claire B.',
    profileId: 'marie-claire-b',
    time: 'Il y a 3 heures',
    action: 'A participe a la collecte de fonds Zones Humides',
    iconName: 'globe',
    iconColor: 'text-blue-400',
    likes: 89,
    bravos: 31,
    avatarColor: 'bg-rose-500/20 text-rose-400',
  },
  {
    id: 'tribe-2',
    name: 'Ocean Mangrove Circle',
    time: 'Il y a 4 heures',
    action: 'A franchi la barre des 12 recifs suivis ce mois-ci !',
    iconName: 'droplets',
    iconColor: 'text-cyan-400',
    likes: 178,
    bravos: 61,
    avatarColor: 'bg-blue-500/20 text-blue-400',
    isTribe: true,
    tribeName: 'Ocean Mangrove Circle',
    tribeSlug: 'ocean-mangrove-circle',
  },
  {
    id: 'evt-6',
    name: 'Lucas V.',
    profileId: 'lucas-v',
    time: 'Il y a 5 heures',
    action: 'A valide le defi « Zero Dechet » de la semaine',
    iconName: 'leaf',
    iconColor: 'text-emerald-500',
    likes: 35,
    bravos: 12,
    avatarColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 'evt-7',
    name: 'NaturaMind',
    profileId: 'natura-mind',
    time: 'Hier',
    action: 'Vient de debloquer le badge Gardien des Forets',
    iconName: 'star',
    iconColor: 'text-amber-400',
    likes: 112,
    bravos: 47,
    avatarColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'evt-8',
    name: 'Amira K.',
    profileId: 'amira-k',
    time: 'Hier',
    action: "A decouvert l'Aigle de Bonelli dans le BioDex",
    iconName: 'bird',
    iconColor: 'text-sky-400',
    likes: 57,
    bravos: 19,
    avatarColor: 'bg-cyan-500/20 text-cyan-400',
  },
]

export const getCollectiveFeed = (): CollectivePost[] => {
  return MOCK_COLLECTIVE_FEED.map((entry) => ({ ...entry }))
}

export const getMockCollectiveGuilds = (session?: MockViewerSession | null): Guild[] => {
  const memberTribeIds = new Set(getMockTribeIdsForFaction(session?.faction ?? null))

  return MOCK_COLLECTIVE_GUILDS.map((guild) => ({
    ...guild,
    is_member: memberTribeIds.has(guild.slug),
  }))
}

export const getMockGuildBySlug = (slug: string, session?: MockViewerSession | null): Guild | null => {
  return getMockCollectiveGuilds(session).find((guild) => guild.slug === slug) || null
}

export const getMockGuildLeaderboard = () => {
  return getMockCollectiveGuilds(null)
    .map((guild) => ({
      guild_id: guild.id,
      guild_name: guild.name,
      guild_slug: guild.slug,
      guild_logo_url: guild.logo_url || null,
      members_count: guild.members_count || 0,
      posts_count: 18,
      reactions_received: 96,
      comments_received: 42,
      score: guild.xp_total || 0,
    }))
    .sort((first, second) => second.score - first.score)
}
