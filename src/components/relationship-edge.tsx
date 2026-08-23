import { useCallback } from 'react'
import {
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'
import { RELATIONSHIP_TYPES } from '#/lib/relationship-types'
import type { RelationshipEdgeData } from '#/lib/schema'
import { X, ChevronDown } from 'lucide-react'

const OPTIONS: { value: string; label: string; jpaLabel: string }[] = [
  { value: RELATIONSHIP_TYPES.MANY_TO_ONE, label: 'N:1', jpaLabel: '@ManyToOne' },
  { value: RELATIONSHIP_TYPES.ONE_TO_MANY, label: '1:N', jpaLabel: '@OneToMany' },
  { value: RELATIONSHIP_TYPES.ONE_TO_ONE, label: '1:1', jpaLabel: '@OneToOne' },
  { value: RELATIONSHIP_TYPES.MANY_TO_MANY, label: 'N:M', jpaLabel: '@ManyToMany' },
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

  const currentOption = OPTIONS.find((o) => o.value === data.relationshipType) || OPTIONS[0]

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? 'var(--java-orange)' : 'var(--java-blue)',
          strokeWidth: selected ? 3.5 : 2.5,
          strokeDasharray: data.relationshipType === RELATIONSHIP_TYPES.MANY_TO_MANY ? '5,5' : undefined,
          filter: selected ? 'drop-shadow(0 0 6px rgba(237, 139, 0, 0.4))' : undefined,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-[10px] font-bold leading-none shadow-md backdrop-blur-md transition-all duration-150"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            backgroundColor: selected ? 'var(--java-orange)' : 'var(--duke-blue)',
            color: '#fff',
            pointerEvents: 'all',
            border: selected ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[9px] text-amber-200">{currentOption.jpaLabel}</span>
          <div className="relative flex items-center">
            <select
              className="cursor-pointer appearance-none bg-black/20 rounded px-1.5 py-0.5 pr-4 text-[10px] font-mono font-bold text-white outline-none"
              value={data.relationshipType}
              onChange={handleTypeChange}
              onClick={(e) => e.stopPropagation()}
              title="Change JPA Relationship Type"
            >
              {OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-(--duke-blue) text-white font-mono"
                >
                  {opt.label} ({opt.jpaLabel})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 size-2.5 text-white/70" />
          </div>
          <button
            className="flex h-4 w-4 cursor-pointer items-center justify-center rounded text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            onClick={handleDelete}
            title="Delete relationship"
          >
            <X className="size-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

