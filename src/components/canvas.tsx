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
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

const nodeTypes = { entity: EntityNode }
const edgeTypes = { relationship: RelationshipEdge }

function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <div
      className="absolute bottom-4 right-4 z-10 flex flex-col overflow-hidden rounded-xl border shadow-xl backdrop-blur-md"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--surface-strong)',
      }}
    >
      <button
        className="flex h-8 w-8 cursor-pointer items-center justify-center border-0 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: 'var(--java-muted)', borderBottom: '1px solid var(--line)' }}
        onClick={() => zoomIn()}
        title="Zoom In (+)"
      >
        <ZoomIn className="size-4" />
      </button>
      <button
        className="flex h-8 w-8 cursor-pointer items-center justify-center border-0 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: 'var(--java-muted)', borderBottom: '1px solid var(--line)' }}
        onClick={() => zoomOut()}
        title="Zoom Out (-)"
      >
        <ZoomOut className="size-4" />
      </button>
      <button
        className="flex h-8 w-8 cursor-pointer items-center justify-center border-0 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: 'var(--java-muted)' }}
        onClick={() => fitView({ padding: 0.2 })}
        title="Fit All Entities (Space)"
      >
        <Maximize2 className="size-3.5" />
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
    <div className="h-full w-full relative min-h-0 min-w-0" style={{ width: '100%', height: '100%' }}>
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
        style={{ width: '100%', height: '100%' }}
        className="bg-(--bg-base) h-full w-full"
      >
        <Background gap={20} size={1} style={{ backgroundColor: 'var(--bg-base)', color: 'var(--line)' }} />
        <ZoomControls />
      </ReactFlow>
    </div>
  )
}
