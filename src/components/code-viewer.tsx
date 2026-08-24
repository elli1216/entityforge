import { useCallback, useMemo, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import json from 'highlight.js/lib/languages/json'
import type { Workspace } from '#/lib/schema'
import { generateJpaEntity, generateEnums } from '#/lib/jpa-generator'
import { generateDdl } from '#/lib/ddl-generator'
import { handleError } from '#/lib/error-handler'
import {
  Check,
  Copy,
  Database,
  Code2,
  FolderTree,
  Folder,
  FileJson,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('json', json)

export type FileTab = {
  id: string
  label: string
  code: string
  lang: string
  filePath: string
  kind: 'entity' | 'enum' | 'ddl' | 'json'
}

function highlight(code: string, lang: string): string {
  try {
    const result = hljs.highlight(code, { language: lang, ignoreIllegals: true })
    return result.value
  } catch {
    return code
  }
}

type Props = {
  workspace: Workspace
  onClose?: () => void
  onAddEntity?: () => void
}

export function CodeViewer({ workspace, onClose, onAddEntity }: Props) {
  const files = useMemo((): FileTab[] => {
    const result: FileTab[] = []

    for (const node of workspace.nodes) {
      const entity = generateJpaEntity(node, workspace.nodes, workspace.edges)
      result.push({
        id: entity.className,
        label: `${entity.className}.java`,
        code: entity.code,
        lang: 'java',
        filePath: `src/main/java/com/entityforge/domain/models/${entity.className}.java`,
        kind: 'entity',
      })
      const enums = generateEnums(node)
      for (const en of enums) {
        result.push({
          id: en.className,
          label: `${en.className}.java`,
          code: en.code,
          lang: 'java',
          filePath: `src/main/java/com/entityforge/domain/models/enum/${en.className}.java`,
          kind: 'enum',
        })
      }
    }

    if (workspace.nodes.length > 0) {
      const ddl = generateDdl(workspace.nodes, workspace.edges)
      result.push({
        id: 'schema.sql',
        label: 'V1__create_schema.sql',
        code: ddl.sql,
        lang: 'sql',
        filePath: `src/main/resources/db/migration/${ddl.migrationName}.sql`,
        kind: 'ddl',
      })
      result.push({
        id: 'workspace.json',
        label: 'workspace.json',
        code: JSON.stringify(workspace, null, 2),
        lang: 'json',
        filePath: 'draft/workspace.json',
        kind: 'json',
      })
    }

    return result
  }, [workspace])

  const [activeId, setActiveId] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const activeFile = useMemo(() => {
    if (files.length === 0) return null
    const found = files.find((f) => f.id === activeId)
    if (found) return found
    return files[0]
  }, [files, activeId])

  const lineCount = useMemo(() => {
    if (!activeFile) return 0
    return activeFile.code.split('\n').length
  }, [activeFile])

  const highlighted = useMemo(
    () => (activeFile ? highlight(activeFile.code, activeFile.lang) : ''),
    [activeFile],
  )

  const handleCopy = useCallback(async () => {
    if (!activeFile) return
    try {
      await navigator.clipboard.writeText(activeFile.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      handleError(e, 'Copy failed')
    }
  }, [activeFile])

  // Group files by category for project tree navigation
  const entities = useMemo(() => files.filter((f) => f.kind === 'entity'), [files])
  const enums = useMemo(() => files.filter((f) => f.kind === 'enum'), [files])
  const migrations = useMemo(() => files.filter((f) => f.kind === 'ddl'), [files])
  const schemas = useMemo(() => files.filter((f) => f.kind === 'json'), [files])

  return (
    <div
      className="flex h-full w-full flex-row overflow-hidden bg-(--bg-base)"
      style={{ borderColor: 'var(--line)' }}
    >
      {/* Side File Navigation Panel (Always Visible on the Side) */}
      {!sidebarCollapsed && (
        <aside
          className="w-48 sm:w-56 md:w-64 shrink-0 flex flex-col border-r border-line bg-(--surface-strong) transition-all"
        >
          {/* Navigation Panel Header */}
          <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-(--java-dark)">
              <FolderTree className="size-3.5 text-(--java-orange)" />
              <span>EXPLORER</span>
            </div>
            <span className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.2 font-mono text-[10px] text-(--java-muted)">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {/* Categorized File Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 font-mono text-xs">
            {/* Entity Classes */}
            <div>
              <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-(--java-muted)">
                <Folder className="size-3 text-amber-500" />
                <span>Entities ({entities.length})</span>
              </div>
              <div className="mt-0.5 space-y-0.5">
                {entities.length === 0 ? (
                  <div className="px-2 py-1.5 text-[11px] text-(--java-muted) italic">
                    No classes added yet
                  </div>
                ) : (
                  entities.map((file) => {
                    const isSelected = (activeFile && activeFile.id === file.id) || (!activeId && file === files[0])
                    return (
                      <button
                        key={file.id}
                        onClick={() => setActiveId(file.id)}
                        className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-(--java-orange) text-white font-bold shadow-xs'
                            : 'text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-xs text-[9px] font-extrabold ${
                            isSelected ? 'bg-white text-(--java-orange)' : 'bg-(--java-orange) text-white'
                          }`}
                        >
                          C
                        </div>
                        <span className="truncate">{file.label}</span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Enums */}
            {enums.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-(--java-muted)">
                  <Folder className="size-3 text-orange-400" />
                  <span>Enums ({enums.length})</span>
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {enums.map((file) => {
                    const isSelected = activeFile?.id === file.id
                    return (
                      <button
                        key={file.id}
                        onClick={() => setActiveId(file.id)}
                        className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-(--java-orange-glow) text-(--duke-blue) font-bold shadow-xs'
                            : 'text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-xs text-[9px] font-extrabold ${
                            isSelected ? 'bg-(--duke-blue) text-white' : 'bg-(--java-orange-glow) text-white'
                          }`}
                        >
                          E
                        </div>
                        <span className="truncate">{file.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Flyway SQL Migrations */}
            {migrations.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-(--java-muted)">
                  <Database className="size-3 text-(--java-blue)" />
                  <span>Flyway SQL</span>
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {migrations.map((file) => {
                    const isSelected = activeFile?.id === file.id
                    return (
                      <button
                        key={file.id}
                        onClick={() => setActiveId(file.id)}
                        className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-(--java-blue) text-white font-bold shadow-xs'
                            : 'text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Database className="size-3.5 shrink-0" />
                        <span className="truncate">{file.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* JSON Schema */}
            {schemas.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-(--java-muted)">
                  <FileJson className="size-3 text-purple-400" />
                  <span>Schema Draft</span>
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {schemas.map((file) => {
                    const isSelected = activeFile?.id === file.id
                    return (
                      <button
                        key={file.id}
                        onClick={() => setActiveId(file.id)}
                        className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white font-bold shadow-xs'
                            : 'text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Code2 className="size-3.5 shrink-0" />
                        <span className="truncate">{file.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Code Inspector Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header & Breadcrumb Bar */}
        <div
          className="flex shrink-0 items-center justify-between border-b border-line px-3 py-2 bg-(--surface)"
        >
          <div className="flex items-center gap-2 min-w-0">
            {/* Toggle File Tree Collapse */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center gap-1 rounded-md border border-line px-2 py-1 font-mono text-[11px] font-semibold text-(--java-orange) bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Show File Explorer' : 'Hide File Explorer'}
            >
              {sidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="size-3.5" />
                  <span className="hidden xs:inline">Files</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="size-3.5" />
                </>
              )}
            </button>

            {/* Breadcrumb Path */}
            {activeFile ? (
              <div className="flex items-center gap-1.5 truncate font-mono text-xs text-(--java-muted)">
                <span className="text-amber-500 font-bold hidden sm:inline">📁</span>
                <span className="truncate text-(--java-dark) font-semibold">{activeFile.filePath}</span>
              </div>
            ) : (
              <span className="font-mono text-xs text-(--java-muted)">Source Code Inspector</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeFile && (
              <span className="hidden md:inline font-mono text-[10px] text-(--java-muted)">
                {lineCount} lines • <strong className="uppercase text-(--java-orange)">{activeFile.lang}</strong>
              </span>
            )}

            {/* Copy Button */}
            {activeFile && (
              <button
                className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold transition-all hover:border-(--java-orange) hover:text-(--java-orange) cursor-pointer"
                onClick={handleCopy}
                style={{
                  color: copied ? 'var(--java-orange)' : 'var(--java-muted)',
                  backgroundColor: 'var(--chip-bg)',
                }}
                title="Copy code to clipboard"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span className="font-mono text-[11px]">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}

            {/* Close Inspector Panel Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Close Inspector"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Code Content */}
        {activeFile ? (
          <div className="relative flex-1 overflow-auto bg-[#161519] dark:bg-[#0e0d10]">
            <pre className="m-0 overflow-auto p-4 font-mono text-xs leading-relaxed text-gray-200 text-left">
              <code
                className={`hljs language-${activeFile.lang} text-left`}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </pre>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--java-orange)/10 text-(--java-orange)">
              <Code2 className="size-6" />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold text-(--java-dark)">
                No @Entity Classes Defined
              </p>
              <p className="mt-1 font-mono text-[11px] text-(--java-muted)">
                Add an entity to generate Java classes and Flyway migrations
              </p>
            </div>
            {onAddEntity && (
              <button
                onClick={onAddEntity}
                className="rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white bg-(--java-orange) hover:bg-(--java-orange-deep) transition-colors cursor-pointer"
              >
                + Add @Entity Class
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


