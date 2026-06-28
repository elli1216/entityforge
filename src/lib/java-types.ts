export type JavaTypeInfo = {
  javaType: string
  jdbcType: string
  sqlType: string
  imports: string[]
}

const JAVA_TYPE_MAP: Record<string, JavaTypeInfo> = {
  VARCHAR: { javaType: 'String', jdbcType: 'VARCHAR', sqlType: 'VARCHAR(255)', imports: [] },
  INT: { javaType: 'Integer', jdbcType: 'INTEGER', sqlType: 'INTEGER', imports: [] },
  BIGINT: { javaType: 'Long', jdbcType: 'BIGINT', sqlType: 'BIGINT', imports: [] },
  SMALLINT: { javaType: 'Short', jdbcType: 'SMALLINT', sqlType: 'SMALLINT', imports: [] },
  BOOLEAN: { javaType: 'Boolean', jdbcType: 'BOOLEAN', sqlType: 'BOOLEAN', imports: [] },
  UUID: { javaType: 'UUID', jdbcType: 'OTHER', sqlType: 'UUID', imports: ['java.util.UUID'] },
  TEXT: { javaType: 'String', jdbcType: 'VARCHAR', sqlType: 'TEXT', imports: [] },
  DATE: { javaType: 'LocalDate', jdbcType: 'DATE', sqlType: 'DATE', imports: ['java.time.LocalDate'] },
  TIMESTAMP: { javaType: 'LocalDateTime', jdbcType: 'TIMESTAMP', sqlType: 'TIMESTAMP', imports: ['java.time.LocalDateTime'] },
  DECIMAL: { javaType: 'BigDecimal', jdbcType: 'DECIMAL', sqlType: 'DECIMAL(19,2)', imports: ['java.math.BigDecimal'] },
  FLOAT: { javaType: 'Float', jdbcType: 'REAL', sqlType: 'FLOAT', imports: [] },
  DOUBLE: { javaType: 'Double', jdbcType: 'DOUBLE', sqlType: 'DOUBLE PRECISION', imports: [] },
  ENUM: { javaType: 'String', jdbcType: 'VARCHAR', sqlType: 'VARCHAR(50)', imports: [] },
  CLOB: { javaType: 'String', jdbcType: 'CLOB', sqlType: 'CLOB', imports: [] },
  BLOB: { javaType: 'byte[]', jdbcType: 'BLOB', sqlType: 'BLOB', imports: [] },
  BYTEA: { javaType: 'byte[]', jdbcType: 'BINARY', sqlType: 'BYTEA', imports: [] },
  JSON: { javaType: 'String', jdbcType: 'VARCHAR', sqlType: 'JSON', imports: [] },
  JSONB: { javaType: 'String', jdbcType: 'VARCHAR', sqlType: 'JSONB', imports: [] },
}

export function getJavaTypeInfo(schemaType: string): JavaTypeInfo {
  return JAVA_TYPE_MAP[schemaType.toUpperCase()] ?? { javaType: 'String', jdbcType: 'VARCHAR', sqlType: 'VARCHAR(255)', imports: [] }
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase())
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[-_\s]+/g, '_')
}

export function singularize(str: string): string {
  if (str.endsWith('ies')) return str.slice(0, -3) + 'y'
  if (str.endsWith('ses')) return str.slice(0, -2)
  if (str.endsWith('s') && !str.endsWith('ss')) return str.slice(0, -1)
  return str
}
