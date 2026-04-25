'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type EcosystemDefinition,
  type EcosystemNode,
  findCascadeNodeIds,
} from '@/lib/ecosystem/graph'

export function useEcosystem(ecosystem: EcosystemDefinition, isAccessUnlocked: boolean) {
  const [nodes, setNodes] = useState<EcosystemNode[]>(() =>
    ecosystem.nodes.map((node) => ({
      ...node,
      status: isAccessUnlocked ? node.status : node.focal ? 'discovered' : 'locked',
    })),
  )

  useEffect(() => {
    setNodes(
      ecosystem.nodes.map((node) => ({
        ...node,
        status: isAccessUnlocked ? node.status : node.focal ? 'discovered' : 'locked',
      })),
    )
  }, [ecosystem, isAccessUnlocked])

  const edges = ecosystem.edges

  const triggerExtinction = useCallback(
    (nodeId: string) => {
      const impactedNodeIds = findCascadeNodeIds(nodeId, edges)

      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          impactedNodeIds.has(node.id) && node.status !== 'locked'
            ? {
                ...node,
                status: 'collapsed',
              }
            : node,
        ),
      )
    },
    [edges],
  )

  const healEcosystem = useCallback(() => {
    setNodes(
      ecosystem.nodes.map((node) => ({
        ...node,
        status: isAccessUnlocked ? node.status : node.focal ? 'discovered' : 'locked',
      })),
    )
  }, [ecosystem, isAccessUnlocked])

  const protectProjectArea = useCallback(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.projectProtected && node.status !== 'locked'
          ? {
              ...node,
              status: 'protected',
            }
          : node,
      ),
    )
  }, [])

  const revealLockedNodes = useCallback(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.status === 'locked'
          ? {
              ...node,
              status: 'discovered',
            }
          : node,
      ),
    )
  }, [])

  const revealNode = useCallback((nodeId: string) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId && node.status === 'locked'
          ? {
              ...node,
              status: 'discovered',
            }
          : node,
      ),
    )
  }, [])

  const hasDeadNodes = useMemo(() => nodes.some((node) => node.status === 'collapsed'), [nodes])
  const lockedCount = useMemo(
    () => nodes.filter((node) => node.status === 'locked').length,
    [nodes],
  )

  return {
    nodes,
    edges,
    triggerExtinction,
    healEcosystem,
    protectProjectArea,
    revealLockedNodes,
    revealNode,
    hasDeadNodes,
    lockedCount,
  }
}
