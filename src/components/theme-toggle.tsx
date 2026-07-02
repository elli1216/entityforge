import { useTheme } from '#/hooks/useTheme'
import { MoonIcon, SunIcon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm transition-colors"
      onClick={toggleTheme}
      style={{ color: 'var(--java-muted)' }}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <MoonIcon className='size-4' />
      ) : (
        <SunIcon className='size-4' />
      )}
    </button>
  )
}
