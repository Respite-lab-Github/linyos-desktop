import { useRef, useEffect } from 'react'
import { useWindowsStore } from '@/store/windows'

interface Position {
  x: number
  y: number
}

interface WindowDragOptions {
  position: Position
  setPosition: (position: Position) => void
}

export function useWindowDrag(
  windowId: string,
  titleBarRef: React.RefObject<HTMLDivElement | null>,
  options: WindowDragOptions
) {
  const { position, setPosition } = options
  const isDragging = useRef(false)
  const startPos = useRef<Position>({ x: 0, y: 0 })
  const windowPos = useRef<Position>({ x: 0, y: 0 })

  useEffect(() => {
    const titleBar = titleBarRef.current
    if (!titleBar) return

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Prevent dragging when clicking buttons
      if (target.closest('button')) return

      isDragging.current = true
      startPos.current = { x: e.clientX, y: e.clientY }
      windowPos.current = position

      // Activate window on drag
      useWindowsStore.getState().activateWindow(windowId)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      const newX = windowPos.current.x + deltaX
      const newY = windowPos.current.y + deltaY

      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false
        windowPos.current = position
      }
    }

    titleBar.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      titleBar.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [windowId, titleBarRef, position, setPosition])
}
