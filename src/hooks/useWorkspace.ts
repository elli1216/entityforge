import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Route } from '#/routes/workspace'
import { WorkspaceSchema } from '#/lib/schema'
import type { Workspace, Field } from '#/lib/schema'

const STORAGE_KEY = 'current_draft'

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
        persist(nextWs)
        return nextWs
      })
    },
    [persist],
  )

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

  const resetWorkspace = useCallback(() => {
    updateWorkspace({ nodes: [], edges: [] })
  }, [updateWorkspace])

  return { workspace, updateWorkspace, addEntity, resetWorkspace }
}
