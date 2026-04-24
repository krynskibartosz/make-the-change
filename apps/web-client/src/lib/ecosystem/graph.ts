export type EcosystemStatus = 'healthy' | 'dead'

export type EcosystemNodeType = 'base' | 'flora' | 'fauna'

export type EcosystemNode = {
  id: string
  name: string
  type: EcosystemNodeType
  status: EcosystemStatus
  trophicLevel: number
  lane: number
}

export type EcosystemEdge = {
  source: string
  target: string
  relation: 'nourrit' | 'habitat' | 'proie' | 'symbiose'
}

export const INITIAL_ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: 'sol',
    name: 'Sols Vivants',
    type: 'base',
    status: 'healthy',
    trophicLevel: 0,
    lane: 50,
  },
  {
    id: 'mycelium',
    name: 'Mycelium',
    type: 'base',
    status: 'healthy',
    trophicLevel: 1,
    lane: 22,
  },
  {
    id: 'fleur',
    name: 'Orchidee',
    type: 'flora',
    status: 'healthy',
    trophicLevel: 1,
    lane: 50,
  },
  {
    id: 'fougere',
    name: 'Fougere',
    type: 'flora',
    status: 'healthy',
    trophicLevel: 1,
    lane: 78,
  },
  {
    id: 'papillon',
    name: 'Papillon',
    type: 'fauna',
    status: 'healthy',
    trophicLevel: 2,
    lane: 24,
  },
  {
    id: 'insecte',
    name: 'Mante Religieuse',
    type: 'fauna',
    status: 'healthy',
    trophicLevel: 2,
    lane: 52,
  },
  {
    id: 'grenouille',
    name: 'Grenouille',
    type: 'fauna',
    status: 'healthy',
    trophicLevel: 2,
    lane: 80,
  },
  {
    id: 'cameleon',
    name: 'Cameleon de Parson',
    type: 'fauna',
    status: 'healthy',
    trophicLevel: 3,
    lane: 42,
  },
  {
    id: 'fossa',
    name: 'Fossa',
    type: 'fauna',
    status: 'healthy',
    trophicLevel: 4,
    lane: 63,
  },
]

export const INITIAL_ECOSYSTEM_EDGES: EcosystemEdge[] = [
  {
    source: 'sol',
    target: 'mycelium',
    relation: 'nourrit',
  },
  {
    source: 'sol',
    target: 'fleur',
    relation: 'nourrit',
  },
  {
    source: 'sol',
    target: 'fougere',
    relation: 'nourrit',
  },
  {
    source: 'mycelium',
    target: 'fleur',
    relation: 'symbiose',
  },
  {
    source: 'fleur',
    target: 'papillon',
    relation: 'habitat',
  },
  {
    source: 'fleur',
    target: 'insecte',
    relation: 'habitat',
  },
  {
    source: 'fougere',
    target: 'grenouille',
    relation: 'habitat',
  },
  {
    source: 'papillon',
    target: 'insecte',
    relation: 'proie',
  },
  {
    source: 'insecte',
    target: 'cameleon',
    relation: 'proie',
  },
  {
    source: 'grenouille',
    target: 'fossa',
    relation: 'proie',
  },
  {
    source: 'cameleon',
    target: 'fossa',
    relation: 'proie',
  },
]

export function findCascadeNodeIds(nodeId: string, edges: readonly EcosystemEdge[]): Set<string> {
  const impactedNodeIds = new Set<string>()

  function visit(currentNodeId: string) {
    if (impactedNodeIds.has(currentNodeId)) {
      return
    }

    impactedNodeIds.add(currentNodeId)

    for (const edge of edges) {
      if (edge.source === currentNodeId) {
        visit(edge.target)
      }
    }
  }

  visit(nodeId)
  return impactedNodeIds
}
