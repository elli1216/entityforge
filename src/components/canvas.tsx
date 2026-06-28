import { useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
} from '@xyflow/react'
import type {
  NodeChange,
  EdgeChange,
  Connection,
  Node,
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { EntityNode, type EntityNodeCallbacks } from './entity-node'
import { RelationshipEdge } from './relationship-edge'
import type { Workspace } from '#/lib/schema'
import { RELATIONSHIP_TYPES } from '#/lib/relationship-types'

const nodeTypes = { entity: EntityNode }
const edgeTypes = { relationship: RelationshipEdge }

type Props = {
  workspace: Workspace
  updateWorkspace: (next: Workspace | ((prev: Workspace) => Workspace)) => void
}

const defaultEdgeOptions = {
  style: { stroke: 'var(--java-blue)', strokeWidth: 2 },
  labelStyle: { fill: 'var(--java-muted)', fontSize: 10 },
}

export function Canvas({ workspace, updateWorkspace }: Props) {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateWorkspace((prev) => {
        const nextNodes = applyNodeChanges(changes, prev.nodes as Node[])
        return { ...prev, nodes: nextNodes as Workspace['nodes'] }
      })
    },
    [updateWorkspace],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      updateWorkspace((prev) => {
        const nextEdges = applyEdgeChanges(changes, prev.edges as Edge[])
        return { ...prev, edges: nextEdges as Workspace['edges'] }
      })
    },
    [updateWorkspace],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      updateWorkspace((prev) => {
        const edge: Edge = {
          id: crypto.randomUUID(),
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
          type: 'relationship',
          data: { relationshipType: RELATIONSHIP_TYPES.MANY_TO_ONE },
        }
        const nextEdges = addEdge(edge, prev.edges as Edge[])
        return { ...prev, edges: nextEdges as Workspace['edges'] }
      })
    },
    [updateWorkspace],
  )

  const handleUpdateNode = useCallback<EntityNodeCallbacks['onUpdateNode']>(
    (nodeId, nextData) => {
      updateWorkspace((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...nextData } }
            : n,
        ),
      }))
    },
    [updateWorkspace],
  )

  const handleDeleteNode = useCallback<EntityNodeCallbacks['onDeleteNode']>(
    (nodeId) => {
      updateWorkspace((prev) => ({
        nodes: prev.nodes.filter((n) => n.id !== nodeId),
        edges: prev.edges.filter(
          (e) => e.source !== nodeId && e.target !== nodeId,
        ),
      }))
    },
    [updateWorkspace],
  )

  const nodesWithCallbacks: Node[] = workspace.nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onUpdateNode: handleUpdateNode,
      onDeleteNode: handleDeleteNode,
    },
  }))

  return (
    <ReactFlow
      nodes={nodesWithCallbacks}
      edges={workspace.edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      deleteKeyCode="Delete"
      fitView
      className="bg-(--bg-base)"
    >
      <Background gap={20} size={1} style={{ backgroundColor: 'var(--bg-base)', color: 'var(--line)' }} />
      <Controls
        style={{
          borderRadius: '8px',
          border: '1px solid var(--line)',
          background: 'var(--surface-strong)',
        }}
      />
    </ReactFlow>
  )
}
