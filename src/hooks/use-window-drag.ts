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
      if (target.closest('button')) return

      isDragging.current = true
      startPos.current = { x: e.clientX, y: e.clientY }
      windowPos.current = position

      useWindowsStore.getState().activateWindow(windowId)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      setPosition({
        x: windowPos.current.x + deltaX,
        y: windowPos.current.y + deltaY
      })
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    titleBar.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      titleBar.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [windowId, position, setPosition])
}
