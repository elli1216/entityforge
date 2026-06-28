const RELATIONSHIP_TYPE_VALUES = [
  'many-to-one',
  'one-to-many',
  'one-to-one',
  'many-to-many',
] as const

export const RELATIONSHIP_TYPES = {
  MANY_TO_ONE: RELATIONSHIP_TYPE_VALUES[0],
  ONE_TO_MANY: RELATIONSHIP_TYPE_VALUES[1],
  ONE_TO_ONE: RELATIONSHIP_TYPE_VALUES[2],
  MANY_TO_MANY: RELATIONSHIP_TYPE_VALUES[3],
} as const

export { RELATIONSHIP_TYPE_VALUES }

export type RelationshipType = typeof RELATIONSHIP_TYPES[keyof typeof RELATIONSHIP_TYPES]
