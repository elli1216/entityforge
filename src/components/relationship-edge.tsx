import { useCallback } from 'react'
import {
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import { RELATIONSHIP_TYPES } from '#/lib/relationship-types'
import type { RelationshipEdgeData } from '#/lib/schema'

const OPTIONS: { value: string; label: string }[] = [
  { value: RELATIONSHIP_TYPES.MANY_TO_ONE, label: 'M:1' },
  { value: RELATIONSHIP_TYPES.ONE_TO_MANY, label: '1:M' },
  { value: RELATIONSHIP_TYPES.ONE_TO_ONE, label: '1:1' },
  { value: RELATIONSHIP_TYPES.MANY_TO_MANY, label: 'M:M' },
]

export function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps & { data: RelationshipEdgeData }) {
  const { deleteElements, updateEdgeData } = useReactFlow()

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      deleteElements({ edges: [{ id }] })
    },
    [id, deleteElements],
  )

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation()
      updateEdgeData(id, { relationshipType: e.target.value })
    },
    [id, updateEdgeData],
  )

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? 'var(--java-orange)' : 'var(--java-blue)',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold leading-none"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            backgroundColor: selected ? 'var(--java-orange)' : 'var(--java-blue)',
            color: '#fff',
            pointerEvents: 'all',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <select
            className="cursor-pointer appearance-none bg-transparent text-center text-[10px] font-semibold text-white outline-none"
            value={data?.relationshipType ?? RELATIONSHIP_TYPES.MANY_TO_ONE}
            onChange={handleTypeChange}
            onClick={(e) => e.stopPropagation()}
          >
            {OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-(--java-blue) text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <button
            className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded text-[10px] leading-none text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            onClick={handleDelete}
            title="Delete relationship"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
