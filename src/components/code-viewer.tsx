import { useCallback, useMemo, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import json from 'highlight.js/lib/languages/json'
import type { Workspace } from '#/lib/schema'
import { generateJpaEntity } from '#/lib/jpa-generator'
import { generateDdl } from '#/lib/ddl-generator'

hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('json', json)

type FileTab = {
  id: string
  label: string
  code: string
  lang: string
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
}

export function CodeViewer({ workspace }: Props) {
  const files = useMemo((): FileTab[] => {
    const result: FileTab[] = []

    for (const node of workspace.nodes) {
      const entity = generateJpaEntity(node, workspace.nodes, workspace.edges)
      result.push({ id: entity.className, label: `${entity.className}.java`, code: entity.code, lang: 'java' })
    }

    if (workspace.nodes.length > 0) {
      const ddl = generateDdl(workspace.nodes, workspace.edges)
      result.push({ id: 'schema.sql', label: 'schema.sql', code: ddl.sql, lang: 'sql' })
      result.push({ id: 'workspace.json', label: 'workspace.json', code: JSON.stringify(workspace, null, 2), lang: 'json' })
    }

    return result
  }, [workspace])

  const [activeId, setActiveId] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const activeFile = useMemo(() => {
    if (files.length === 0) return null
    const found = files.find((f) => f.id === activeId)
    if (found) return found
    return files[0]
  }, [files, activeId])

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
    } catch {
      // clipboard unavailable
    }
  }, [activeFile])

  return (
    <div
      className="flex h-full flex-col border-l"
      style={{ borderColor: 'var(--line)', backgroundColor: 'var(--bg-base)' }}
    >
      {files.length > 0 && (
        <div
          className="flex shrink-0 items-center border-b"
          style={{ borderColor: 'var(--line)', backgroundColor: 'var(--surface-weak)' }}
        >
          <div className="flex flex-1 items-center gap-0 overflow-x-auto">
            {files.map((file) => (
              <button
                key={file.id}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
                onClick={() => setActiveId(file.id)}
                style={{
                  color: activeId === file.id ? 'var(--java-orange)' : 'var(--java-muted)',
                  borderBottom: activeId === file.id ? '2px solid var(--java-orange)' : '2px solid transparent',
                  backgroundColor: activeId === file.id ? 'var(--bg-base)' : 'transparent',
                }}
              >
                {file.lang === 'java' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--java-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
                    <path d="M16 3h3a2 2 0 0 1 2 2v14c0 1.1-.9 2-2 2h-3" />
                    <path d="M12 21v-6" />
                    <path d="M12 9V3" />
                    <path d="M9 6h6" />
                    <path d="M9 12h6" />
                    <path d="M9 18h4" />
                  </svg>
                )}
                {file.lang === 'sql' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--java-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
                  </svg>
                )}
                {file.lang === 'json' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--java-orange-glow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                )}
                <span>{file.label}</span>
              </button>
            ))}
          </div>
          <button
            className="mr-2 flex shrink-0 cursor-pointer items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold transition-colors"
            onClick={handleCopy}
            style={{
              color: copied ? 'var(--java-orange)' : 'var(--java-muted)',
            }}
            title="Copy code"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      {activeFile ? (
        <div className="relative flex-1 overflow-auto">
          <pre className="absolute inset-0 m-0 overflow-auto p-4 text-xs leading-relaxed">
            <code
              className={`hljs language-${activeFile.lang}`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs" style={{ color: 'var(--java-muted)' }}>No entities yet</p>
        </div>
      )}
    </div>
  )
}
