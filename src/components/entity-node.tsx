import { useCallback, useMemo, useRef, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { FIELD_TYPES } from '../lib/field-types'
import type { Field, EntityNodeData, IndexConfig } from '#/lib/schema'
import { toPascalCase, singularize } from '#/lib/java-types'
import { Copy, X, Key, ChevronUp, ChevronDown, Plus, Layers, Database } from 'lucide-react'
import HoverContent from './hover-content'

export type EntityNodeCallbacks = {
  onUpdateNode: (nodeId: string, data: Partial<EntityNodeData>) => void
  onDeleteNode: (nodeId: string) => void
  onCloneNode: (nodeId: string) => void
}

const STRING_TYPES = new Set(['VARCHAR', 'CHAR'])
const DECIMAL_TYPES = new Set(['DECIMAL', 'NUMERIC'])

function Badge({
  label,
  active,
  activeColor,
  activeBg,
  onClick,
}: {
  label: string
  active: boolean
  activeColor: string
  activeBg?: string
  onClick: () => void
}) {
  return (
    <button
      className="flex h-5 shrink-0 cursor-pointer items-center rounded px-1.5 font-mono text-[9px] font-bold tracking-wider transition-all"
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{
        backgroundColor: active ? (activeBg || activeColor) : 'transparent',
        color: active ? 'white' : 'var(--java-muted)',
        border: active ? 'none' : '1px solid var(--line)',
      }}
    >
      {label}
    </button>
  )
}

function FieldRow({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  field: Field
  index: number
  total: number
  onChange: (id: string, updates: Partial<Field>) => void
  onDelete: (id: string) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
}) {
  const [name, setName] = useState(field.name)
  const [type, setType] = useState(field.type)
  const [lengthVal, setLengthVal] = useState(String(field.length ?? ''))
  const [precisionVal, setPrecisionVal] = useState(String(field.precision ?? ''))
  const [scaleVal, setScaleVal] = useState(String(field.scale ?? ''))
  const [enumValuesStr, setEnumValuesStr] = useState((field.enumValues ?? []).join(', '))
  const enumValuesRef = useRef(enumValuesStr)
  if (enumValuesStr !== enumValuesRef.current) {
    enumValuesRef.current = enumValuesStr
  }
  const [defaultValue, setDefaultValue] = useState(field.defaultValue ?? '')
  const defaultRef = useRef(defaultValue)
  if (defaultValue !== defaultRef.current) {
    defaultRef.current = defaultValue
  }

  const flush = useCallback(() => {
    const updates: Partial<Field> = { name, type }
    if (type === 'ENUM') {
      updates.length = undefined
      updates.precision = undefined
      updates.scale = undefined
      const values = enumValuesStr.split(',').map((v) => v.trim()).filter(Boolean)
      updates.enumValues = values.length > 0 ? values : undefined
    } else {
      updates.enumValues = undefined
      if (STRING_TYPES.has(type)) {
        const n = lengthVal === '' ? undefined : Number(lengthVal)
        updates.length = (n && n > 0) ? n : undefined
        updates.precision = undefined
        updates.scale = undefined
      }
      if (DECIMAL_TYPES.has(type)) {
        updates.length = undefined
        const p = precisionVal === '' ? undefined : Number(precisionVal)
        const s = scaleVal === '' ? undefined : Number(scaleVal)
        updates.precision = (p && p > 0) ? p : undefined
        updates.scale = (s != null && s >= 0) ? s : undefined
      }
      if (!STRING_TYPES.has(type) && !DECIMAL_TYPES.has(type) && type !== 'ENUM') {
        updates.length = undefined
        updates.precision = undefined
        updates.scale = undefined
      }
    }
    updates.defaultValue = defaultValue || undefined
    onChange(field.id, updates)
  }, [field.id, name, type, lengthVal, precisionVal, scaleVal, enumValuesStr, defaultValue, onChange])

  const isString = STRING_TYPES.has(type)
  const isDecimal = DECIMAL_TYPES.has(type)

  return (
    <div
      className="group flex flex-wrap items-center gap-1.5 border-b px-2.5 py-1.5 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      style={{ borderColor: 'var(--line)' }}
    >
      {/* UML private access modifier symbol '-' */}
      <span className="font-mono text-xs font-bold text-rose-500 select-none" title="private visibility">
        -
      </span>

      {/* Field Name */}
      <input
        className="min-w-0 flex-1 bg-transparent px-1 py-0.5 font-mono text-xs font-semibold outline-none"
        placeholder="field_name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={flush}
        style={{ color: 'var(--java-dark)' }}
      />

      {/* Java Data Type Selector */}
      <select
        className="rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold outline-none transition-colors"
        value={type}
        onChange={(e) => { setType(e.target.value); setLengthVal(''); setPrecisionVal(''); setScaleVal('') }}
        onBlur={flush}
        title="Field Java & SQL Type"
        style={{
          backgroundColor: 'var(--chip-bg)',
          borderColor: 'var(--chip-line)',
          color: 'var(--java-blue)',
          border: '1px solid',
        }}
      >
        {FIELD_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Type-Specific Options (String Length) */}
      {isString && (
        <input
          className="w-11 rounded px-1 py-0.5 font-mono text-[10px] outline-none"
          placeholder="255"
          value={lengthVal}
          onChange={(e) => setLengthVal(e.target.value)}
          onBlur={flush}
          title="Column length in VARCHAR(n)"
          style={{
            backgroundColor: 'var(--chip-bg)',
            borderColor: 'var(--chip-line)',
            color: 'var(--java-muted)',
            border: '1px solid',
          }}
        />
      )}

      {/* Decimal (Precision, Scale) */}
      {isDecimal && (
        <span className="flex items-center gap-0.5 font-mono text-[10px]" style={{ color: 'var(--java-muted)' }}>
          (
          <input
            className="w-7 rounded px-1 py-0.5 font-mono text-[10px] outline-none"
            placeholder="19"
            value={precisionVal}
            onChange={(e) => setPrecisionVal(e.target.value)}
            onBlur={flush}
            title="Precision (total digits)"
            style={{
              backgroundColor: 'var(--chip-bg)',
              borderColor: 'var(--chip-line)',
              color: 'var(--java-muted)',
              border: '1px solid',
            }}
          />
          ,
          <input
            className="w-7 rounded px-1 py-0.5 font-mono text-[10px] outline-none"
            placeholder="2"
            value={scaleVal}
            onChange={(e) => setScaleVal(e.target.value)}
            onBlur={flush}
            title="Scale (decimal places)"
            style={{
              backgroundColor: 'var(--chip-bg)',
              borderColor: 'var(--chip-line)',
              color: 'var(--java-muted)',
              border: '1px solid',
            }}
          />
          )
        </span>
      )}

      {/* Enum Values */}
      {type === 'ENUM' && (
        <input
          className="min-w-0 flex-1 rounded px-1 py-0.5 font-mono text-[10px] outline-none"
          placeholder="ACTIVE, INACTIVE, PENDING"
          value={enumValuesStr}
          onChange={(e) => setEnumValuesStr(e.target.value)}
          onBlur={flush}
          title="Comma-separated Enum constants"
          style={{
            backgroundColor: 'var(--chip-bg)',
            borderColor: 'var(--chip-line)',
            color: 'var(--java-orange-deep)',
            border: '1px solid',
          }}
        />
      )}

      {/* Default SQL Expression */}
      {type !== 'ENUM' && type !== 'BOOLEAN' && (
        <input
          className="w-14 rounded px-1 py-0.5 font-mono text-[10px] outline-none"
          placeholder="DEFAULT"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          onBlur={flush}
          title="Default Column Value"
          style={{
            backgroundColor: 'var(--chip-bg)',
            borderColor: 'var(--chip-line)',
            color: 'var(--java-muted)',
            border: '1px solid',
          }}
        />
      )}

      {/* Constraint Badges */}
      <div className="flex items-center gap-1">
        <HoverContent content="Primary Key (@Id)">
          <Badge
            label="PK"
            active={field.isPrimaryKey}
            activeColor="var(--java-orange)"
            onClick={() => onChange(field.id, { isPrimaryKey: !field.isPrimaryKey })}
          />
        </HoverContent>

        <HoverContent content="Not Null (@Column nullable=false)">
          <Badge
            label="NN"
            active={!field.isNullable}
            activeColor="var(--java-blue)"
            onClick={() => onChange(field.id, { isNullable: !field.isNullable })}
          />
        </HoverContent>

        <HoverContent content="Unique Constraint (@Column unique=true)">
          <Badge
            label="UN"
            active={field.isUnique}
            activeColor="var(--java-orange-glow)"
            onClick={() => onChange(field.id, { isUnique: !field.isUnique })}
          />
        </HoverContent>
      </div>

      {/* Row Order & Delete Actions */}
      <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          className="flex h-5 w-4 cursor-pointer items-center justify-center rounded text-[10px] disabled:opacity-20 hover:text-(--java-orange)"
          onClick={(e) => { e.stopPropagation(); onMoveUp(index) }}
          disabled={index === 0}
          title="Move property up"
        >
          <ChevronUp className="size-3" />
        </button>
        <button
          className="flex h-5 w-4 cursor-pointer items-center justify-center rounded text-[10px] disabled:opacity-20 hover:text-(--java-orange)"
          onClick={(e) => { e.stopPropagation(); onMoveDown(index) }}
          disabled={index === total - 1}
          title="Move property down"
        >
          <ChevronDown className="size-3" />
        </button>
        <button
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-xs hover:text-red-500"
          onClick={(e) => { e.stopPropagation(); onDelete(field.id) }}
          title="Delete property"
        >
          <X className="size-3" />
        </button>
      </div>
    </div>
  )
}

function IndexRow({
  idx,
  onChange,
  onDelete,
}: {
  idx: IndexConfig
  onChange: (id: string, updates: Partial<IndexConfig>) => void
  onDelete: (id: string) => void
}) {
  const [name, setName] = useState(idx.name)
  const [columnsStr, setColumnsStr] = useState(idx.columns.join(', '))

  const nameRef = useRef(name)
  if (idx.name !== nameRef.current) {
    nameRef.current = idx.name
    setName(idx.name)
  }
  const colsRef = useRef(columnsStr)
  const incomingColsStr = idx.columns.join(', ')
  if (incomingColsStr !== colsRef.current) {
    colsRef.current = incomingColsStr
    setColumnsStr(incomingColsStr)
  }

  const flush = useCallback(() => {
    const cols = columnsStr.split(',').map(c => c.trim()).filter(Boolean)
    onChange(idx.id, { name, columns: cols })
  }, [idx.id, name, columnsStr, onChange])

  return (
    <div className="group flex flex-wrap items-center gap-1.5 border-b px-2.5 py-1.5 text-xs" style={{ borderColor: 'var(--line)' }}>
      <span className="font-mono text-[10px] font-bold text-amber-500">@Index</span>
      <input
        className="min-w-0 flex-1 bg-transparent px-1 py-0.5 text-[10px] outline-none font-mono font-semibold"
        placeholder="idx_name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={flush}
        style={{ color: 'var(--java-dark)' }}
      />
      <input
        className="min-w-0 flex-1 px-1.5 py-0.5 text-[10px] outline-none font-mono rounded"
        placeholder="col1, col2"
        value={columnsStr}
        onChange={(e) => setColumnsStr(e.target.value)}
        onBlur={flush}
        style={{ color: 'var(--java-muted)', border: '1px solid var(--chip-line)', backgroundColor: 'var(--chip-bg)' }}
      />
      <HoverContent content="Unique Index">
        <Badge
          label="UN"
          active={idx.isUnique}
          activeColor="var(--java-orange-glow)"
          onClick={() => onChange(idx.id, { isUnique: !idx.isUnique })}
        />
      </HoverContent>
      <button
        className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-xs text-(--java-muted) hover:text-red-500"
        onClick={(e) => { e.stopPropagation(); onDelete(idx.id) }}
        title="Delete index"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}

export function EntityNode({
  id,
  data,
  selected,
}: NodeProps & {
  data: EntityNodeData & EntityNodeCallbacks
}) {
  const { tableName, fields, indexes = [], onUpdateNode, onDeleteNode, onCloneNode } = data
  const [localTableName, setLocalTableName] = useState(tableName)
  const tableRef = useRef(tableName)

  if (tableName !== tableRef.current) {
    tableRef.current = tableName
    setLocalTableName(tableName)
  }

  const classNamePreview = useMemo(() => {
    return toPascalCase(singularize(localTableName || 'Entity'))
  }, [localTableName])

  const handleTableNameBlur = useCallback(() => {
    if (localTableName !== tableName) {
      onUpdateNode(id, { tableName: localTableName })
    }
  }, [id, localTableName, tableName, onUpdateNode])

  const handleFieldChange = useCallback(
    (fieldId: string, updates: Partial<Field>) => {
      const enablingPk = updates.isPrimaryKey === true
      const newFields = fields.map((f) =>
        f.id === fieldId
          ? { ...f, ...updates }
          : enablingPk
            ? { ...f, isPrimaryKey: false }
            : f,
      )
      onUpdateNode(id, { fields: newFields })
    },
    [id, fields, onUpdateNode],
  )

  const handleDeleteField = useCallback(
    (fieldId: string) => {
      const newFields = fields.filter((f) => f.id !== fieldId)
      onUpdateNode(id, { fields: newFields })
    },
    [id, fields, onUpdateNode],
  )

  const handleAddField = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const newField: Field = {
        id: crypto.randomUUID(),
        name: '',
        type: 'VARCHAR',
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
        length: undefined,
        precision: undefined,
        scale: undefined,
        enumValues: undefined,
        defaultValue: undefined,
      }
      onUpdateNode(id, { fields: [...fields, newField] })
    },
    [id, fields, onUpdateNode],
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDeleteNode(id)
    },
    [id, onDeleteNode],
  )

  const handleClone = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onCloneNode(id)
    },
    [id, onCloneNode],
  )

  const handleMoveField = useCallback(
    (fieldIndex: number, direction: -1 | 1) => {
      const target = fieldIndex + direction
      if (target < 0 || target >= fields.length) return
      const newFields = [...fields]
        ;[newFields[fieldIndex], newFields[target]] = [newFields[target], newFields[fieldIndex]]
      onUpdateNode(id, { fields: newFields })
    },
    [id, fields, onUpdateNode],
  )

  const handleIndexChange = useCallback(
    (idxId: string, updates: Partial<IndexConfig>) => {
      const newIndexes = indexes.map((i) =>
        i.id === idxId ? { ...i, ...updates } : i,
      )
      onUpdateNode(id, { indexes: newIndexes })
    },
    [id, indexes, onUpdateNode],
  )

  const handleDeleteIndex = useCallback(
    (idxId: string) => {
      const newIndexes = indexes.filter((i) => i.id !== idxId)
      onUpdateNode(id, { indexes: newIndexes })
    },
    [id, indexes, onUpdateNode],
  )

  const handleAddIndex = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const newIndex: IndexConfig = {
        id: crypto.randomUUID(),
        name: `idx_${(tableName || 'table').toLowerCase()}`,
        columns: [],
        isUnique: false,
      }
      onUpdateNode(id, { indexes: [...indexes, newIndex] })
    },
    [id, tableName, indexes, onUpdateNode],
  )

  return (
    <div
      className="min-w-64 rounded-xl border-2 shadow-xl transition-all duration-150 backdrop-blur-sm"
      style={{
        borderColor: selected ? 'var(--java-orange)' : 'var(--line)',
        backgroundColor: 'var(--java-cream)',
        boxShadow: selected
          ? '0 0 0 2px var(--java-orange), 0 12px 30px rgba(237, 139, 0, 0.25)'
          : '0 8px 24px rgba(0,0,0,0.08)',
      }}
    >
      {/* Target Handle (Left: Inbound / Many-to-One Target) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'var(--java-blue)',
          width: 12,
          height: 12,
          border: '2px solid var(--java-cream)',
          left: -7,
        }}
        title="Target Handle (Inbound Association)"
      />

      {/* Java Class Header */}
      <div
        className="rounded-t-[10px] px-3.5 py-2.5 text-white"
        style={{
          background: 'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
        }}
      >
        <div className="flex items-center justify-between gap-1.5 mb-1 text-[10px] font-mono text-white/80">
          <div className="flex items-center gap-1">
            <span className="font-bold">@Entity</span>
            <span>@Table(name = "{localTableName || '...'}")</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              onClick={handleClone}
              title="Duplicate / Clone Class"
            >
              <Copy className="size-3.5" />
            </button>
            <button
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              onClick={handleDelete}
              title="Delete Class"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-extrabold text-(--java-orange) shadow-xs">
            C
          </div>
          <div className="flex-1 flex flex-col">
            <input
              className="w-full bg-transparent font-mono text-sm font-bold text-white outline-none placeholder-white/50"
              placeholder="table_name"
              value={localTableName}
              onChange={(e) => setLocalTableName(e.target.value)}
              onBlur={handleTableNameBlur}
            />
          </div>
          <span className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white/90">
            {classNamePreview}.java
          </span>
        </div>
      </div>

      {/* Fields List (Class Attributes Compartment) */}
      <div className="max-h-60 overflow-y-auto divide-y divide-line">
        {fields.length === 0 ? (
          <div className="p-3 text-center text-xs font-mono text-(--java-muted)">
            // No properties declared
          </div>
        ) : (
          fields.map((field, i) => (
            <FieldRow
              key={field.id}
              field={field}
              index={i}
              total={fields.length}
              onChange={handleFieldChange}
              onDelete={handleDeleteField}
              onMoveUp={(idx) => handleMoveField(idx, -1)}
              onMoveDown={(idx) => handleMoveField(idx, 1)}
            />
          ))
        )}
      </div>

      {/* Indexes Compartment */}
      {indexes.length > 0 && (
        <div className="border-t divide-y divide-line" style={{ borderColor: 'var(--line)' }}>
          <div className="bg-black/5 dark:bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-(--java-muted)">
            // @Table Indexes ({indexes.length})
          </div>
          <div className="max-h-32 overflow-y-auto">
            {indexes.map((idx) => (
              <IndexRow
                key={idx.id}
                idx={idx}
                onChange={handleIndexChange}
                onDelete={handleDeleteIndex}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex border-t" style={{ borderColor: 'var(--line)' }}>
        <button
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-bl-[10px] px-3 py-2 text-xs font-mono font-bold transition-colors"
          onClick={handleAddField}
          style={{
            color: 'var(--java-orange)',
            borderRight: '1px solid var(--line)',
            backgroundColor: 'rgba(237, 139, 0, 0.04)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(237, 139, 0, 0.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(237, 139, 0, 0.04)' }}
        >
          <Plus className="size-3.5" />
          <span>Property</span>
        </button>
        <button
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-br-[10px] px-3 py-2 text-xs font-mono font-bold transition-colors"
          onClick={handleAddIndex}
          style={{
            color: 'var(--java-blue)',
            backgroundColor: 'rgba(0, 115, 150, 0.04)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 115, 150, 0.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 115, 150, 0.04)' }}
        >
          <Plus className="size-3.5" />
          <span>@Index</span>
        </button>
      </div>

      {/* Source Handle (Right: Outbound / Owning Association Source) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'var(--java-orange)',
          width: 12,
          height: 12,
          border: '2px solid var(--java-cream)',
          right: -7,
        }}
        title="Source Handle (Outbound Association)"
      />
    </div>
  )
}

