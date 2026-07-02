import dagre from '@dagrejs/dagre'
import type { Workspace } from './schema'

function estimateNodeHeight(fieldCount: number): number {
  return 42 + fieldCount * 32 + 36
}

export function autoLayout(workspace: Workspace): Workspace {
  if (workspace.nodes.length === 0) return workspace

  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', ranksep: 120, nodesep: 80 })

  for (const node of workspace.nodes) {
    const h = estimateNodeHeight(node.data.fields.length)
    g.setNode(node.id, { width: 560, height: h })
  }

  for (const edge of workspace.edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  const nodes = workspace.nodes.map((node) => {
    const dagreNode = g.node(node.id)
    if (!dagreNode) return node
    const h = estimateNodeHeight(node.data.fields.length)
    return {
      ...node,
      position: {
        x: dagreNode.x - 130,
        y: dagreNode.y - h / 2,
      },
    }
  })

  return { ...workspace, nodes }
}
