import { useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  useReactFlow,
} from '@xyflow/react'
import type {
  NodeChange,
  EdgeChange,
  Connection,
  Node,
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { EntityNode } from './entity-node'
import type { EntityNodeCallbacks } from './entity-node'
import { RelationshipEdge } from './relationship-edge'
import type { Workspace } from '#/lib/schema'
import { RELATIONSHIP_TYPES } from '#/lib/relationship-types'

const nodeTypes = { entity: EntityNode }
const edgeTypes = { relationship: RelationshipEdge }

function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <div
      className="absolute bottom-4 right-4 z-10 flex flex-col overflow-hidden rounded-lg border shadow-lg"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--surface-strong)',
      }}
    >
      <button
        className="flex h-8 w-8 cursor-pointer items-center justify-center border-0 text-sm transition-colors hover:bg-black/5"
        style={{ color: 'var(--java-muted)', borderBottom: '1px solid var(--line)' }}
        onClick={() => zoomIn()}
        title="Zoom in"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
      <button
        className="flex h-8 w-8 cursor-pointer items-center justify-center border-0 text-sm transition-colors hover:bg-black/5"
        style={{ color: 'var(--java-muted)', borderBottom: '1px solid var(--line)' }}
        onClick={() => zoomOut()}
        title="Zoom out"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>
      <button
        className="flex h-8 w-8 cursor-pointer items-center justify-center border-0 text-sm transition-colors hover:bg-black/5"
        style={{ color: 'var(--java-muted)' }}
        onClick={() => fitView()}
        title="Fit view"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  )
}

type Props = {
  workspace: Workspace
  updateWorkspace: (next: Workspace | ((prev: Workspace) => Workspace)) => void
  onCloneNode: EntityNodeCallbacks['onCloneNode']
}

const defaultEdgeOptions = {
  style: { stroke: 'var(--java-blue)', strokeWidth: 2 },
  labelStyle: { fill: 'var(--java-muted)', fontSize: 10 },
}

export function Canvas({ workspace, updateWorkspace, onCloneNode }: Props) {
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
      onCloneNode,
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
      <ZoomControls />
    </ReactFlow>
  )
}
