import React, { useEffect, useRef } from 'react'
import { Window as WindowType } from '@/store/windows'
import { useAppsStore } from '@/store/apps'
import { cn } from '@/lib/utils'
import { WindowHeader } from './WindowHeader'
import { useWindowResize } from '@/hooks/use-window-resize'

interface WindowProps {
  window: WindowType
}

export function Window({ window }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { getAppModule } = useAppsStore()

  useWindowResize(window.id, windowRef)

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

  if (window.isMinimized) return null

  const style: React.CSSProperties = window.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)',
        transform: 'none',
      }
    : {
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height,
        transform: `translate(0, 0)`,
      }

  return (
    <div
      ref={windowRef}
      className={cn(
        'absolute flex flex-col rounded-lg border bg-background shadow-lg',
        window.isActive && 'ring-1 ring-primary'
      )}
      style={{
        ...style,
        zIndex: window.zIndex,
      }}
    >
      <WindowHeader window={window} />
      <div ref={contentRef} className="flex-1 overflow-hidden" />
    </div>
  )
}
