import type { EntityNode, RelationshipEdge } from './schema'
import { getJavaTypeInfo, toPascalCase, singularize } from './java-types'
import { parseRelationships } from './relationship-parser'
import type { RelationshipField } from './relationship-parser'

export type GeneratedEntity = {
  className: string
  packageName: string
  code: string
}

const DEFAULT_PACKAGE = 'com.entityforge.domain'

type Line = { content: string; sortKey: number }

export function generateJpaEntity(
  node: EntityNode,
  allNodes: EntityNode[],
  edges: RelationshipEdge[],
  packageName: string = DEFAULT_PACKAGE,
): GeneratedEntity {
  const { owning, inverse } = parseRelationships(node.id, allNodes, edges)
  const className = toPascalCase(singularize(node.data.tableName))
  const tableName = node.data.tableName

  const imports = collectImports(node, owning, inverse)
  const fieldLines = buildFieldLines(node, owning, inverse)

  return {
    className,
    packageName,
    code: generateClass(packageName, imports, className, tableName, fieldLines),
  }
}

function collectImports(
  node: EntityNode,
  owning: RelationshipField[],
  inverse: RelationshipField[],
): Set<string> {
  const imports = new Set<string>()

  imports.add('jakarta.persistence.Entity')
  imports.add('jakarta.persistence.Table')
  imports.add('jakarta.persistence.Id')
  imports.add('jakarta.persistence.GeneratedValue')
  imports.add('jakarta.persistence.GenerationType')
  imports.add('jakarta.persistence.Column')

  for (const field of node.data.fields) {
    const info = getJavaTypeInfo(field.type)
    for (const imp of info.imports) {
      if (!imp.startsWith('java.lang.')) imports.add(imp)
    }
  }

  for (const rel of [...owning, ...inverse]) {
    for (const imp of rel.imports) {
      imports.add(imp)
    }
  }

  return imports
}

function buildFieldLines(
  node: EntityNode,
  owning: RelationshipField[],
  inverse: RelationshipField[],
): Line[] {
  const lines: Line[] = []
  let sortKey = 0

  for (const field of node.data.fields) {
    const info = getJavaTypeInfo(field.type)
    const colName = field.name || field.id

    if (field.isPrimaryKey) {
      lines.push({ content: '', sortKey: sortKey++ })
      lines.push({ content: '    @Id', sortKey: sortKey++ })
      lines.push({ content: '    @GeneratedValue(strategy = GenerationType.UUID)', sortKey: sortKey++ })
      lines.push({ content: `    @Column(name = "${colName}", nullable = false, unique = true)`, sortKey: sortKey++ })
    } else {
      const parts: string[] = []
      if (!field.isNullable) parts.push('nullable = false')
      if (field.isUnique) parts.push('unique = true')
      if (field.length != null) {
        parts.push(`length = ${field.length}`)
      } else if (info.sqlType.startsWith('VARCHAR')) {
        parts.push('length = 255')
      }
      if (field.precision != null) {
        const sc = field.scale != null ? `, scale = ${field.scale}` : ''
        parts.push(`precision = ${field.precision}${sc}`)
      }
      const attrs = parts.length > 0 ? `, ${parts.join(', ')}` : ''
      lines.push({ content: '', sortKey: sortKey++ })
      lines.push({ content: `    @Column(name = "${colName}"${attrs})`, sortKey: sortKey++ })
    }

    lines.push({ content: `    private ${info.javaType} ${field.name || 'unnamed'};`, sortKey: sortKey++ })
  }

  for (const rel of owning) {
    lines.push({ content: '', sortKey: sortKey++ })
    lines.push({ content: rel.annotation, sortKey: sortKey++ })
    lines.push({ content: rel.fieldDeclaration, sortKey: sortKey++ })
  }

  for (const rel of inverse) {
    lines.push({ content: '', sortKey: sortKey++ })
    lines.push({ content: rel.annotation, sortKey: sortKey++ })
    lines.push({ content: rel.fieldDeclaration, sortKey: sortKey++ })
  }

  return lines
}

function generateClass(
  packageName: string,
  imports: Set<string>,
  className: string,
  tableName: string,
  fieldLines: Line[],
): string {
  const sortedImports = [...imports].sort()
  const importBlock = sortedImports.length > 0 ? '\n' + sortedImports.map((i) => `import ${i};`).join('\n') : ''

  const fieldsCode = fieldLines.map((l) => l.content).join('\n')

  const gettersSetters = buildGetterSetters(fieldLines)

  return `package ${packageName};${importBlock}

@Entity
@Table(name = "${tableName}")
public class ${className} {
${fieldsCode}

    public ${className}() {
    }
${gettersSetters}
}
`
}

function fieldNameFromDecl(decl: string): string | null {
  const clean = decl.replace('new ArrayList<>();', '').trim()
  const match = clean.match(/private\s+\S+\s+(\w+);?$/)
  return match ? match[1] : null
}

function javaTypeFromDecl(decl: string): string {
  const match = decl.match(/private\s+(.+?)\s+\w+\s*[=;]/)
  return match ? match[1] : 'String'
}

function buildGetterSetters(fieldLines: Line[]): string {
  const result: string[] = []
  const seen = new Set<string>()

  for (const line of fieldLines) {
    const decl = line.content.trim()
    if (!decl.startsWith('private ')) continue

    const name = fieldNameFromDecl(decl)
    if (!name || seen.has(name)) continue
    seen.add(name)

    const javaType = javaTypeFromDecl(decl)
    const pascalName = toPascalCase(name)

    result.push('')
    result.push(`    public ${javaType} get${pascalName}() {`)
    result.push(`        return this.${name};`)
    result.push('    }')
    result.push('')
    result.push(`    public void set${pascalName}(${javaType} ${name}) {`)
    result.push(`        this.${name} = ${name};`)
    result.push('    }')
  }

  return result.join('\n')
}
