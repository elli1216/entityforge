import { toast } from 'sonner'

export function handleError(error: unknown, context?: string): void {
  const message = error instanceof Error ? error.message : String(error)
  const prefix = context ? `${context}: ` : ''
  toast.error(`${prefix}${message}`)
}
