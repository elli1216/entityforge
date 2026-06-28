import type { EntityNode, RelationshipEdge } from './schema'
import { toCamelCase, toPascalCase, singularize } from './java-types'
import { RELATIONSHIP_TYPES } from './relationship-types'
import type { RelationshipType } from './relationship-types'

export type RelationshipField = {
  annotation: string
  fieldDeclaration: string
  imports: string[]
}

function pluralize(name: string): string {
  const s = singularize(name)
  if (s.endsWith('y')) return s.slice(0, -1) + 'ies'
  if (s.endsWith('s') || s.endsWith('x') || s.endsWith('z')) return s + 'es'
  return s + 's'
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[-_\s]+/g, '_')
}

function classNameOf(node: EntityNode): string {
  return toPascalCase(singularize(node.data.tableName))
}

function fkFieldName(node: EntityNode): string {
  return toCamelCase(singularize(node.data.tableName))
}

function joinColName(node: EntityNode): string {
  return toSnakeCase(singularize(node.data.tableName)) + '_id'
}

function snakeSingular(node: EntityNode): string {
  return toSnakeCase(singularize(node.data.tableName))
}

type NodeMap = Map<string, EntityNode>

function buildNodeMap(nodes: EntityNode[]): NodeMap {
  const map: NodeMap = new Map()
  for (const node of nodes) {
    map.set(node.id, node)
  }
  return map
}

export type RelationshipResult = {
  owning: RelationshipField[]
  inverse: RelationshipField[]
}

export function parseRelationships(
  nodeId: string,
  nodes: EntityNode[],
  edges: RelationshipEdge[],
): RelationshipResult {
  const nodeMap = buildNodeMap(nodes)
  const owning: RelationshipField[] = []
  const inverse: RelationshipField[] = []

  for (const edge of edges) {
    const src = nodeMap.get(edge.source)
    const tgt = nodeMap.get(edge.target)
    if (!src || !tgt) continue

    const t: RelationshipType = edge.data.relationshipType

    if (edge.source === nodeId) {
      if (t === RELATIONSHIP_TYPES.MANY_TO_ONE) owning.push(manyToOne(tgt))
      else if (t === RELATIONSHIP_TYPES.ONE_TO_MANY)
        inverse.push(oneToMany(tgt, src))
      else if (t === RELATIONSHIP_TYPES.ONE_TO_ONE)
        owning.push(oneToOneOwning(tgt))
      else
        owning.push(
          manyToManyOwning(tgt, snakeSingular(src), snakeSingular(tgt)),
        )
    }

    if (edge.target === nodeId) {
      if (t === RELATIONSHIP_TYPES.ONE_TO_MANY)
        inverse.push(oneToMany(src, tgt))
      else if (t === RELATIONSHIP_TYPES.MANY_TO_ONE) owning.push(manyToOne(src))
      else if (t === RELATIONSHIP_TYPES.ONE_TO_ONE)
        inverse.push(oneToOneInverse(src, tgt))
      else inverse.push(manyToManyInverse(src, tgt))
    }
  }

  return { owning, inverse }
}

function manyToOne(refNode: EntityNode): RelationshipField {
  const cls = classNameOf(refNode)
  const field = fkFieldName(refNode)
  const col = joinColName(refNode)
  return {
    annotation: `    @ManyToOne(fetch = FetchType.LAZY)\n    @JoinColumn(name = "${col}")`,
    fieldDeclaration: `    private ${cls} ${field};`,
    imports: [
      'jakarta.persistence.ManyToOne',
      'jakarta.persistence.JoinColumn',
      'jakarta.persistence.FetchType',
    ],
  }
}

function oneToMany(
  manySide: EntityNode,
  oneSide: EntityNode,
): RelationshipField {
  const cls = classNameOf(manySide)
  const field = toCamelCase(pluralize(manySide.data.tableName))
  const mappedBy = fkFieldName(oneSide)
  return {
    annotation: `    @OneToMany(mappedBy = "${mappedBy}", fetch = FetchType.LAZY, cascade = CascadeType.ALL)`,
    fieldDeclaration: `    private List<${cls}> ${field} = new ArrayList<>();`,
    imports: [
      'jakarta.persistence.OneToMany',
      'jakarta.persistence.FetchType',
      'jakarta.persistence.CascadeType',
      'java.util.List',
      'java.util.ArrayList',
    ],
  }
}

function oneToOneOwning(refNode: EntityNode): RelationshipField {
  const cls = classNameOf(refNode)
  const field = fkFieldName(refNode)
  const col = joinColName(refNode)
  return {
    annotation: `    @OneToOne(fetch = FetchType.LAZY)\n    @JoinColumn(name = "${col}")`,
    fieldDeclaration: `    private ${cls} ${field};`,
    imports: [
      'jakarta.persistence.OneToOne',
      'jakarta.persistence.JoinColumn',
      'jakarta.persistence.FetchType',
    ],
  }
}

function oneToOneInverse(
  srcNode: EntityNode,
  tgtNode: EntityNode,
): RelationshipField {
  const cls = classNameOf(srcNode)
  const field = toCamelCase(singularize(srcNode.data.tableName))
  const mappedBy = fkFieldName(tgtNode)
  return {
    annotation: `    @OneToOne(mappedBy = "${mappedBy}", fetch = FetchType.LAZY)`,
    fieldDeclaration: `    private ${cls} ${field};`,
    imports: ['jakarta.persistence.OneToOne', 'jakarta.persistence.FetchType'],
  }
}

function manyToManyOwning(
  tgtNode: EntityNode,
  srcSg: string,
  tgtSg: string,
): RelationshipField {
  const cls = classNameOf(tgtNode)
  const field = toCamelCase(pluralize(tgtNode.data.tableName))
  return {
    annotation: `    @ManyToMany\n    @JoinTable(name = "${srcSg}_${tgtSg}", joinColumns = @JoinColumn(name = "${srcSg}_id"), inverseJoinColumns = @JoinColumn(name = "${tgtSg}_id"))`,
    fieldDeclaration: `    private List<${cls}> ${field} = new ArrayList<>();`,
    imports: [
      'jakarta.persistence.ManyToMany',
      'jakarta.persistence.JoinTable',
      'jakarta.persistence.JoinColumn',
      'java.util.List',
      'java.util.ArrayList',
    ],
  }
}

function manyToManyInverse(
  srcNode: EntityNode,
  tgtNode: EntityNode,
): RelationshipField {
  const cls = classNameOf(srcNode)
  const field = toCamelCase(pluralize(srcNode.data.tableName))
  const mappedBy = toCamelCase(pluralize(tgtNode.data.tableName))
  return {
    annotation: `    @ManyToMany(mappedBy = "${mappedBy}")`,
    fieldDeclaration: `    private List<${cls}> ${field} = new ArrayList<>();`,
    imports: [
      'jakarta.persistence.ManyToMany',
      'java.util.List',
      'java.util.ArrayList',
    ],
  }
}
