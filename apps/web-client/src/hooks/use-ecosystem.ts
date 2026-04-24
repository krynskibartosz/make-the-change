'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  type EcosystemNode,
  findCascadeNodeIds,
  INITIAL_ECOSYSTEM_EDGES,
  INITIAL_ECOSYSTEM_NODES,
} from '@/lib/ecosystem/graph'

export function useEcosystem() {
  const [nodes, setNodes] = useState<EcosystemNode[]>(() =>
    INITIAL_ECOSYSTEM_NODES.map((node) => ({ ...node })),
  )

  const edges = INITIAL_ECOSYSTEM_EDGES

  const triggerExtinction = useCallback((nodeId: string) => {
    const impactedNodeIds = findCascadeNodeIds(nodeId, edges)

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        impactedNodeIds.has(node.id)
          ? {
              ...node,
              status: 'dead',
            }
          : node,
      ),
    )
  }, [])

  const healEcosystem = useCallback(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        status: 'healthy',
      })),
    )
  }, [])

  const hasDeadNodes = useMemo(() => nodes.some((node) => node.status === 'dead'), [nodes])

  return {
    nodes,
    edges,
    triggerExtinction,
    healEcosystem,
    hasDeadNodes,
  }
}
