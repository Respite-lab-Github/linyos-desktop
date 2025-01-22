import { useRef } from 'react'
import { Window } from '@/store/windows'
import { useWindowsStore } from '@/store/windows'
import { useWindowDrag } from '@/hooks/use-window-drag'
import { cn } from '@/lib/utils'
import { Minus, Square, X, Minimize2 } from 'lucide-react'

interface Position {
  x: number
  y: number
}

interface WindowHeaderProps {
  window: Window
  position: Position
  setPosition: (position: Position) => void
}

export function WindowHeader({ window, position, setPosition }: WindowHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const { activateWindow, minimizeWindow, maximizeWindow, restoreWindow, removeWindow } = useWindowsStore()

  useWindowDrag(window.id, headerRef, {
    position,
    setPosition,
  })

  const handleMaximizeClick = () => {
    if (window.isMaximized) {
      restoreWindow(window.id)
    } else {
      maximizeWindow(window.id)
    }
  }

  return (
    <div
      ref={headerRef}
      className={cn(
        'flex h-10 items-center justify-between border-b px-4',
        'cursor-move select-none'
      )}
      onMouseDown={() => activateWindow(window.id)}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{window.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => minimizeWindow(window.id)}
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={handleMaximizeClick}
        >
          {window.isMaximized ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
        <button
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => removeWindow(window.id)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
