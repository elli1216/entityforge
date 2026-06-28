import { z } from 'zod'

export const FieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  isPrimaryKey: z.boolean().default(false),
  isNullable: z.boolean().default(true),
  isUnique: z.boolean().default(false),
})

export const EntityNodeSchema = z.object({
  id: z.string(),
  type: z.literal('entity').default('entity'),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.object({
    tableName: z.string(),
    fields: z.array(FieldSchema),
  }),
})

export const RelationshipEdgeDataSchema = z.object({
  relationshipType: z
    .enum(['one-to-many', 'many-to-one', 'one-to-one', 'many-to-many'])
    .default('many-to-one'),
})

export const RelationshipEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  type: z.string().default('default'),
  data: RelationshipEdgeDataSchema.default({ relationshipType: 'many-to-one' }),
})

export const WorkspaceSchema = z.object({
  nodes: z.array(EntityNodeSchema).default([]),
  edges: z.array(RelationshipEdgeSchema).default([]),
})

export type Field = z.infer<typeof FieldSchema>
export type EntityNodeData = z.infer<typeof EntityNodeSchema>['data']
export type EntityNode = z.infer<typeof EntityNodeSchema>
export type RelationshipEdgeData = z.infer<typeof RelationshipEdgeDataSchema>
export type RelationshipEdge = z.infer<typeof RelationshipEdgeSchema>
export type Workspace = z.infer<typeof WorkspaceSchema>
