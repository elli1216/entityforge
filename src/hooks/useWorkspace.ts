import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Route } from '#/routes/workspace'
import { WorkspaceSchema } from '#/lib/schema'
import type { Workspace, Field } from '#/lib/schema'

const STORAGE_KEY = 'current_draft'
const MAX_HISTORY = 50

function parseWorkspace(draft: string | undefined): Workspace {
  if (draft) {
    try {
      return WorkspaceSchema.parse(JSON.parse(draft))
    } catch {
      // invalid draft, fall through
    }
  }
  return { nodes: [], edges: [] }
}

export function useWorkspace() {
  const navigate = useNavigate()
  const { draft } = useSearch({ from: Route.id })
  const isInitialLoad = useRef(true)

  const [workspace, setWorkspace] = useState<Workspace>(() =>
    parseWorkspace(draft),
  )

  const workspaceRef = useRef(workspace)
  workspaceRef.current = workspace

  const persistTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const past = useRef<Workspace[]>([])
  const future = useRef<Workspace[]>([])
  const [, setHistoryTick] = useState(0)
  const bump = useCallback(() => setHistoryTick((n) => n + 1), [])

  const persist = useCallback(
    (ws: Workspace) => {
      const serialized = JSON.stringify(ws)
      try {
        localStorage.setItem(STORAGE_KEY, serialized)
      } catch {
        // localStorage unavailable
      }

      clearTimeout(persistTimer.current)
      persistTimer.current = setTimeout(() => {
        navigate({
          to: '/workspace',
          search: { draft: serialized },
          replace: true,
        })
      }, 300)
    },
    [navigate],
  )

  const updateWorkspace = useCallback(
    (next: Workspace | ((prev: Workspace) => Workspace)) => {
      setWorkspace((prev) => {
        const nextWs = typeof next === 'function' ? next(prev) : next
        past.current.push(prev)
        if (past.current.length > MAX_HISTORY) past.current.shift()
        future.current = []
        bump()
        persist(nextWs)
        return nextWs
      })
    },
    [persist],
  )

  const undo = useCallback(() => {
    const prev = past.current.pop()
    if (!prev) return
    bump()
    setWorkspace((current) => {
      future.current.push(current)
      persist(prev)
      return prev
    })
  }, [persist, bump])

  const redo = useCallback(() => {
    const next = future.current.pop()
    if (!next) return
    bump()
    setWorkspace((current) => {
      past.current.push(current)
      persist(next)
      return next
    })
  }, [persist, bump])

  const addEntity = useCallback(() => {
    updateWorkspace((prev) => {
      const offset = prev.nodes.length * 40
      const newEntity = {
        id: crypto.randomUUID(),
        type: 'entity' as const,
        position: { x: 100 + offset, y: 100 + offset },
        data: {
          tableName: '',
          fields: [] as Field[],
        },
      }
      return { ...prev, nodes: [...prev.nodes, newEntity] }
    })
  }, [updateWorkspace])

  useEffect(() => {
    if (!isInitialLoad.current) return
    isInitialLoad.current = false

    if (draft) return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = WorkspaceSchema.safeParse(JSON.parse(saved))
        if (parsed.success) {
          setWorkspace(parsed.data)
          navigate({
            to: '/workspace',
            search: { draft: saved },
            replace: true,
          })
        }
      }
    } catch {
      // localStorage unavailable or invalid data
    }
  }, [draft, navigate])

  const cloneEntity = useCallback((nodeId: string) => {
    updateWorkspace((prev) => {
      const source = prev.nodes.find((n) => n.id === nodeId)
      if (!source) return prev
      const cloned = {
        ...source,
        id: crypto.randomUUID(),
        position: { x: source.position.x + 30, y: source.position.y + 30 },
        data: {
          ...source.data,
          tableName: source.data.tableName ? `${source.data.tableName} (copy)` : '',
          fields: source.data.fields.map((f) => ({ ...f, id: crypto.randomUUID() })),
        },
      }
      return { ...prev, nodes: [...prev.nodes, cloned] }
    })
  }, [updateWorkspace])

  const resetWorkspace = useCallback(() => {
    updateWorkspace({ nodes: [], edges: [] })
  }, [updateWorkspace])

  const canUndo = past.current.length > 0
  const canRedo = future.current.length > 0

  return {
    workspace,
    updateWorkspace,
    addEntity,
    cloneEntity,
    resetWorkspace,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
