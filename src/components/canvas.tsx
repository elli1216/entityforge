import { useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { EntityNode, type EntityNodeCallbacks } from './entity-node'
import type { Workspace } from '#/lib/schema'

const nodeTypes = { entity: EntityNode }

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
      const nextNodes = applyNodeChanges(changes, workspace.nodes as Node[])
      updateWorkspace((prev) => ({ ...prev, nodes: nextNodes as Workspace['nodes'] }))
    },
    [workspace.nodes, updateWorkspace],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const nextEdges = applyEdgeChanges(changes, workspace.edges as Edge[])
      updateWorkspace((prev) => ({ ...prev, edges: nextEdges as Workspace['edges'] }))
    },
    [workspace.edges, updateWorkspace],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        id: crypto.randomUUID(),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
        type: 'default',
        data: { relationshipType: 'many-to-one' },
      }
      const nextEdges = addEdge(edge, workspace.edges as Edge[])
      updateWorkspace((prev) => ({ ...prev, edges: nextEdges as Workspace['edges'] }))
    },
    [workspace.edges, updateWorkspace],
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

  const nodesWithCallbacks: Node[] = workspace.nodes.map((n) => ({
    ...n,
    data: { ...n.data, onUpdateNode: handleUpdateNode },
  }))

  return (
    <ReactFlow
      nodes={nodesWithCallbacks}
      edges={workspace.edges as Edge[]}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      fitView
      className="bg-[var(--bg-base)]"
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
