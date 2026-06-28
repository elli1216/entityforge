import type { EntityNode, RelationshipEdge } from './schema'
import { getJavaTypeInfo, toSnakeCase, singularize } from './java-types'
import type { RelationshipType } from './relationship-types'

export type GeneratedDdl = {
  migrationName: string
  sql: string
}

export function generateDdl(
  nodes: EntityNode[],
  edges: RelationshipEdge[],
  version: string = '1',
): GeneratedDdl {
  const createTables = nodes
    .map((node) => generateCreateTable(node))
    .join('\n\n')
  const foreignKeys = generateForeignKeys(nodes, edges)
  const content = [createTables, foreignKeys].filter(Boolean).join('\n\n')

  return {
    migrationName: `V${version}__create_initial_schema`,
    sql: content,
  }
}

function generateCreateTable(node: EntityNode): string {
  const tableName = node.data.tableName
  const pkFields = node.data.fields.filter((f) => f.isPrimaryKey)
  const columns: string[] = []

  for (const field of node.data.fields) {
    const info = getJavaTypeInfo(field.type)
    const colName = field.name || field.id
    const parts = [`    ${colName} ${info.sqlType}`]

    if (!field.isNullable) parts.push('NOT NULL')
    if (field.isUnique && !field.isPrimaryKey) parts.push('UNIQUE')

    columns.push(parts.join(' '))
  }

  if (pkFields.length > 0) {
    const pkNames = pkFields.map((f) => f.name || f.id).join(', ')
    columns.push(`    PRIMARY KEY (${pkNames})`)
  }

  return `CREATE TABLE ${tableName} (\n${columns.join(',\n')}\n);`
}

function generateForeignKeys(
  nodes: EntityNode[],
  edges: RelationshipEdge[],
): string {
  const nodeMap = new Map<string, EntityNode>()
  for (const node of nodes) {
    nodeMap.set(node.id, node)
  }

  const statements: string[] = []

  for (const edge of edges) {
    const t: RelationshipType = edge.data.relationshipType

    const srcNode = nodeMap.get(edge.source)
    const tgtNode = nodeMap.get(edge.target)
    if (!srcNode || !tgtNode) continue

    let childNode: EntityNode
    let parentNode: EntityNode

    if (t === 'many-to-one' || t === 'one-to-one') {
      childNode = srcNode
      parentNode = tgtNode
    } else if (t === 'one-to-many') {
      childNode = tgtNode
      parentNode = srcNode
    } else {
      continue
    }

    const childTable = childNode.data.tableName
    const parentTable = parentNode.data.tableName
    const fkCol = toSnakeCase(singularize(parentNode.data.tableName)) + '_id'
    const fkName = `fk_${childTable}_${parentTable}`

    const pkField = parentNode.data.fields.find((f) => f.isPrimaryKey)
    const parentPkCol = pkField ? pkField.name || 'id' : 'id'

    statements.push(
      `ALTER TABLE ${childTable}` +
        ` ADD CONSTRAINT ${fkName}` +
        ` FOREIGN KEY (${fkCol}) REFERENCES ${parentTable}(${parentPkCol});`,
    )
  }

  return statements.join('\n\n')
}
