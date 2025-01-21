import { useRef, useEffect } from 'react'
import { useWindowsStore } from '@/store/windows'

const RESIZE_HANDLE_SIZE = 6

interface Size {
  width: number
  height: number
}

interface Position {
  x: number
  y: number
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

export function useWindowResize(
  windowId: string,
  windowRef: React.RefObject<HTMLDivElement | null>,
  minSize: Size = { width: 200, height: 150 }
) {
  const isResizing = useRef(false)
  const resizeDirection = useRef<ResizeDirection>(null)
  const startPos = useRef<Position>({ x: 0, y: 0 })
  const startSize = useRef<Size>({ width: 0, height: 0 })
  const startWindowPos = useRef<Position>({ x: 0, y: 0 })

  useEffect(() => {
    const windowElement = windowRef.current
    if (!windowElement) return

    const getResizeDirection = (e: MouseEvent): ResizeDirection => {
      const rect = windowElement.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const isTop = y <= RESIZE_HANDLE_SIZE
      const isBottom = y >= rect.height - RESIZE_HANDLE_SIZE
      const isLeft = x <= RESIZE_HANDLE_SIZE
      const isRight = x >= rect.width - RESIZE_HANDLE_SIZE

      if (isTop && isLeft) return 'nw'
      if (isTop && isRight) return 'ne'
      if (isBottom && isLeft) return 'sw'
      if (isBottom && isRight) return 'se'
      if (isTop) return 'n'
      if (isBottom) return 's'
      if (isLeft) return 'w'
      if (isRight) return 'e'
      return null
    }

    const updateCursor = (direction: ResizeDirection) => {
      const cursorMap: Record<NonNullable<ResizeDirection>, string> = {
        n: 'ns-resize',
        s: 'ns-resize',
        e: 'ew-resize',
        w: 'ew-resize',
        ne: 'nesw-resize',
        nw: 'nwse-resize',
        se: 'nwse-resize',
        sw: 'nesw-resize',
      }
      windowElement.style.cursor = direction ? cursorMap[direction] : ''
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        const deltaX = e.clientX - startPos.current.x
        const deltaY = e.clientY - startPos.current.y
        const direction = resizeDirection.current
        if (!direction) return

        let newWidth = startSize.current.width
        let newHeight = startSize.current.height
        let newX = startWindowPos.current.x
        let newY = startWindowPos.current.y

        // Handle horizontal resizing
        if (direction.includes('e')) {
          newWidth = Math.max(startSize.current.width + deltaX, minSize.width)
        } else if (direction.includes('w')) {
          const width = Math.max(startSize.current.width - deltaX, minSize.width)
          newX = startWindowPos.current.x + (startSize.current.width - width)
          newWidth = width
        }

        // Handle vertical resizing
        if (direction.includes('s')) {
          newHeight = Math.max(startSize.current.height + deltaY, minSize.height)
        } else if (direction.includes('n')) {
          const height = Math.max(startSize.current.height - deltaY, minSize.height)
          newY = startWindowPos.current.y + (startSize.current.height - height)
          newHeight = height
        }

        useWindowsStore.getState().resizeWindow(windowId, {
          width: newWidth,
          height: newHeight,
        })
        useWindowsStore.getState().moveWindow(windowId, {
          x: newX,
          y: newY,
        })
      } else {
        const direction = getResizeDirection(e)
        updateCursor(direction)
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const direction = getResizeDirection(e)
      if (!direction) return

      const window = useWindowsStore.getState().windows.find(w => w.id === windowId)
      if (!window) return

      isResizing.current = true
      resizeDirection.current = direction
      startPos.current = { x: e.clientX, y: e.clientY }
      startSize.current = window.size
      startWindowPos.current = window.position

      useWindowsStore.getState().activateWindow(windowId)
    }

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false
        resizeDirection.current = null
        updateCursor(null)
      }
    }

    windowElement.addEventListener('mousemove', handleMouseMove)
    windowElement.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      windowElement.removeEventListener('mousemove', handleMouseMove)
      windowElement.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [windowId, windowRef, minSize])
}
