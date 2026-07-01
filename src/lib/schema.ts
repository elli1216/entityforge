import { z } from 'zod'
import { RELATIONSHIP_TYPE_VALUES, RELATIONSHIP_TYPES } from './relationship-types'

export const FieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  isPrimaryKey: z.boolean().default(false),
  isNullable: z.boolean().default(true),
  isUnique: z.boolean().default(false),
  length: z.number().positive().optional(),
  precision: z.number().positive().optional(),
  scale: z.number().nonnegative().optional(),
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
    .enum(RELATIONSHIP_TYPE_VALUES)
    .default(RELATIONSHIP_TYPES.MANY_TO_ONE),
})

export const RelationshipEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  type: z.string().default('default'),
  data: RelationshipEdgeDataSchema.default({ relationshipType: RELATIONSHIP_TYPES.MANY_TO_ONE }),
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
