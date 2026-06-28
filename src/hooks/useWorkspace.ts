import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Route } from '#/routes/workspace'
import { WorkspaceSchema } from '#/lib/schema'
import type { Workspace, Field } from '#/lib/schema'

const STORAGE_KEY = 'current_draft'

export function useWorkspace() {
  const navigate = useNavigate()
  const { draft } = useSearch({ from: Route.id })
  const isInitialLoad = useRef(true)

  const workspace = useMemo((): Workspace => {
    if (draft) {
      try {
        return WorkspaceSchema.parse(JSON.parse(draft))
      } catch {
        // invalid draft, fall through
      }
    }
    return { nodes: [], edges: [] }
  }, [draft])

  const updateWorkspace = useCallback(
    (next: Workspace | ((prev: Workspace) => Workspace)) => {
      const newWorkspace =
        typeof next === 'function' ? next(workspace) : next
      const serialized = JSON.stringify(newWorkspace)
      try {
        localStorage.setItem(STORAGE_KEY, serialized)
      } catch {
        // localStorage unavailable
      }
      navigate({
        to: '/workspace',
        search: { draft: serialized },
        replace: true,
      })
    },
    [navigate, workspace],
  )

  const addEntity = useCallback(() => {
    const offset = workspace.nodes.length * 40
    const newEntity = {
      id: crypto.randomUUID(),
      type: 'entity' as const,
      position: { x: 100 + offset, y: 100 + offset },
      data: {
        tableName: '',
        fields: [] as Field[],
      },
    }
    updateWorkspace((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newEntity],
    }))
  }, [workspace.nodes.length, updateWorkspace])

  useEffect(() => {
    if (!isInitialLoad.current) return
    isInitialLoad.current = false

    if (draft) return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = WorkspaceSchema.safeParse(JSON.parse(saved))
        if (parsed.success) {
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

  return { workspace, updateWorkspace, addEntity }
}
