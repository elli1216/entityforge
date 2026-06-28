export const FIELD_TYPES = [
  'VARCHAR',
  'INT',
  'BIGINT',
  'SMALLINT',
  'BOOLEAN',
  'UUID',
  'TEXT',
  'DATE',
  'TIMESTAMP',
  'DECIMAL',
  'FLOAT',
  'DOUBLE',
  'ENUM',
  'CLOB',
  'BLOB',
  'BYTEA',
  'JSON',
  'JSONB',
] as const

export type FieldType = (typeof FIELD_TYPES)[number]
