import React, { useEffect, useRef, useState } from 'react'
import { Window as WindowType } from '@/store/windows'
import { useAppsStore } from '@/store/apps'
import { cn } from '@/lib/utils'
import { WindowHeader } from './WindowHeader'
import { useWindowResize } from '@/hooks/use-window-resize'

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

interface WindowProps {
  window: WindowType
}

export function Window({ window }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { getAppModule } = useAppsStore()
  const [position, setPosition] = useState<Position>(window.position)
  const [size, setSize] = useState<Size>(window.size)

  useWindowResize(window.id, windowRef, {
    size,
    setSize,
    position,
    setPosition,
    minSize: { width: 200, height: 150 }
  })

  useEffect(() => {
    const loadApp = async () => {
      if (!contentRef.current) return

      try {
        const module = await getAppModule(window.appId)
        module.render(contentRef.current)

        return () => {
          if (module.destroy) {
            module.destroy(contentRef.current!)
          }
        }
      } catch (error) {
        console.error(`Failed to load app ${window.appId}:`, error)
      }
    }

    loadApp()
  }, [window.appId, getAppModule])

  const style: React.CSSProperties = window.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)',
        transform: 'none',
      }
    : {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        transform: `translate(0, 0)`,
      }

  return (
    <div
      ref={windowRef}
      className={cn(
        'absolute flex flex-col rounded-lg border bg-background shadow-lg',
        window.isActive && 'ring-1 ring-primary',
        window.isMinimized && 'invisible pointer-events-none'
      )}
      style={{
        ...style,
        zIndex: window.zIndex,
      }}
    >
      <WindowHeader window={window} position={position} setPosition={setPosition} />
      <div ref={contentRef} className="flex-1 overflow-hidden" />
    </div>
  )
}
