import { useCallback, useRef, useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FIELD_TYPES } from './field-types'
import type { Field, EntityNodeData } from '#/lib/schema'

export type EntityNodeCallbacks = {
  onUpdateNode: (nodeId: string, data: Partial<EntityNodeData>) => void
  onDeleteNode: (nodeId: string) => void
}

const STRING_TYPES = new Set(['VARCHAR', 'ENUM', 'CHAR'])
const DECIMAL_TYPES = new Set(['DECIMAL', 'NUMERIC'])

function Badge({
  label,
  active,
  activeColor,
  onClick,
}: {
  label: string
  active: boolean
  activeColor: string
  onClick: () => void
}) {
  return (
    <button
      className="flex h-5 shrink-0 cursor-pointer items-center rounded px-1 text-[9px] font-semibold uppercase tracking-wider transition-colors"
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{
        backgroundColor: active ? activeColor : 'transparent',
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
  onChange,
  onDelete,
}: {
  field: Field
  onChange: (id: string, updates: Partial<Field>) => void
  onDelete: (id: string) => void
}) {
  const [name, setName] = useState(field.name)
  const [type, setType] = useState(field.type)
  const [lengthVal, setLengthVal] = useState(String(field.length ?? ''))
  const [precisionVal, setPrecisionVal] = useState(String(field.precision ?? ''))
  const [scaleVal, setScaleVal] = useState(String(field.scale ?? ''))

  const flush = useCallback(() => {
    const updates: Partial<Field> = { name, type }
    if (STRING_TYPES.has(type)) {
      const n = lengthVal === '' ? undefined : Number(lengthVal)
      updates.length = (n && n > 0) ? n : undefined
    }
    if (DECIMAL_TYPES.has(type)) {
      const p = precisionVal === '' ? undefined : Number(precisionVal)
      const s = scaleVal === '' ? undefined : Number(scaleVal)
      updates.precision = (p && p > 0) ? p : undefined
      updates.scale = (s != null && s >= 0) ? s : undefined
    }
    onChange(field.id, updates)
  }, [field.id, name, type, lengthVal, precisionVal, scaleVal, onChange])

  const isString = STRING_TYPES.has(type)
  const isDecimal = DECIMAL_TYPES.has(type)

  return (
    <div className="group flex flex-wrap items-center gap-1 border-b px-2 py-1.5 text-sm" style={{ borderColor: 'var(--line)' }}>
      <input
        className="min-w-0 flex-1 bg-transparent px-1 py-0.5 text-xs outline-none"
        placeholder="field_name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={flush}
        style={{ color: 'var(--java-dark)' }}
      />
      <select
        className="w-20 rounded px-1 py-0.5 text-xs outline-none"
        value={type}
        onChange={(e) => { setType(e.target.value); setLengthVal(''); setPrecisionVal(''); setScaleVal('') }}
        onBlur={flush}
        style={{
          backgroundColor: 'var(--chip-bg)',
          borderColor: 'var(--chip-line)',
          color: 'var(--java-muted)',
          border: '1px solid',
        }}
      >
        {FIELD_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {isString && (
        <input
          className="w-12 rounded px-1 py-0.5 text-[10px] outline-none"
          placeholder="255"
          value={lengthVal}
          onChange={(e) => setLengthVal(e.target.value)}
          onBlur={flush}
          title="Length"
          style={{
            backgroundColor: 'var(--chip-bg)',
            borderColor: 'var(--chip-line)',
            color: 'var(--java-muted)',
            border: '1px solid',
          }}
        />
      )}

      {isDecimal && (
        <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'var(--java-muted)' }}>
          (
          <input
            className="w-8 rounded px-1 py-0.5 text-[10px] outline-none"
            placeholder="19"
            value={precisionVal}
            onChange={(e) => setPrecisionVal(e.target.value)}
            onBlur={flush}
            title="Precision"
            style={{
              backgroundColor: 'var(--chip-bg)',
              borderColor: 'var(--chip-line)',
              color: 'var(--java-muted)',
              border: '1px solid',
            }}
          />
          ,
          <input
            className="w-8 rounded px-1 py-0.5 text-[10px] outline-none"
            placeholder="2"
            value={scaleVal}
            onChange={(e) => setScaleVal(e.target.value)}
            onBlur={flush}
            title="Scale"
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

      <div className="flex items-center gap-0.5">
        <Badge
          label="PK"
          active={field.isPrimaryKey}
          activeColor="var(--java-orange)"
          onClick={() => onChange(field.id, { isPrimaryKey: !field.isPrimaryKey })}
        />
        <Badge
          label="NL"
          active={!field.isNullable}
          activeColor="var(--java-blue)"
          onClick={() => onChange(field.id, { isNullable: !field.isNullable })}
        />
        <Badge
          label="UN"
          active={field.isUnique}
          activeColor="var(--java-orange-glow)"
          onClick={() => onChange(field.id, { isUnique: !field.isUnique })}
        />
      </div>

      <button
        className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-xs transition-opacity hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); onDelete(field.id) }}
        style={{ color: 'var(--java-muted)', opacity: 0.4 }}
        title="Delete field"
      >
        ×
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
  const { tableName, fields, onUpdateNode, onDeleteNode } = data
  const [localTableName, setLocalTableName] = useState(tableName)
  const tableRef = useRef(tableName)

  if (tableName !== tableRef.current) {
    tableRef.current = tableName
    setLocalTableName(tableName)
  }

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

  return (
    <div
      className="min-w-56 rounded-xl border-2 shadow-lg transition-shadow"
      style={{
        borderColor: selected ? 'var(--java-orange)' : 'var(--line)',
        backgroundColor: 'var(--java-cream)',
        boxShadow: selected
          ? '0 0 0 1px var(--java-orange), 0 8px 24px rgba(0,0,0,0.12)'
          : '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'var(--java-blue)', width: 10, height: 10, border: '2px solid var(--java-cream)' }}
      />

      <div
        className="flex items-center gap-2 rounded-t-xl px-3 py-2"
        style={{
          background: 'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
        }}
      >
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder-white/60"
          placeholder="TableName"
          value={localTableName}
          onChange={(e) => setLocalTableName(e.target.value)}
          onBlur={handleTableNameBlur}
        />
        <button
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-xs text-white/60 transition-colors hover:text-white"
          onClick={handleDelete}
          title="Delete entity"
        >
          ×
        </button>
      </div>

      <div className="max-h-56 overflow-y-auto">
        {fields.map((field) => (
          <FieldRow
            key={field.id}
            field={field}
            onChange={handleFieldChange}
            onDelete={handleDeleteField}
          />
        ))}
      </div>

      <button
        className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-b-xl px-3 py-2 text-xs font-semibold transition-colors"
        onClick={handleAddField}
        style={{
          color: 'var(--java-muted)',
          borderTop: '1px solid var(--line)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(237, 139, 0, 0.08)'; e.currentTarget.style.color = 'var(--java-orange)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--java-muted)' }}
      >
        + Add Field
      </button>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'var(--java-orange)', width: 10, height: 10, border: '2px solid var(--java-cream)' }}
      />
    </div>
  )
}
