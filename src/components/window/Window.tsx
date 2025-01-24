import React, { useEffect, useRef } from 'react'
import { Window as WindowType } from '@/store/windows'
import { useAppsStore } from '@/store/apps'
import { cn } from '@/lib/utils'
import { WindowHeader } from './WindowHeader'
import { useWindowResize } from '@/hooks/use-window-resize'
import { motion, useAnimate, AnimatePresence } from 'motion/react'
import { useWindowsStore } from '@/store/windows'

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
  const contentRef = useRef<HTMLDivElement>(null)
  const { getAppModule } = useAppsStore()
  const [scope, animate] = useAnimate()
  const { removeWindow, setClosing } = useWindowsStore()

  // Store current position and size in refs to avoid unnecessary rerenders
  const positionRef = useRef(window.position)
  const sizeRef = useRef(window.size)
  const prevMaximized = useRef(window.isMaximized)
  const prevMinimized = useRef(window.isMinimized)

  const handleClose = async () => {
    setClosing(window.id, true)
  }

  const handleExitComplete = () => {
    if (window.isClosing) {
      removeWindow(window.id)
    }
  }

  // Handle position and size updates using animate
  const handleSetSize = (newSize: Size) => {
    if (scope.current) {
      animate(scope.current, {
        width: newSize.width,
        height: newSize.height,
      }, { duration: 0 })
      sizeRef.current = newSize
    }
  }

  const handleSetPosition = (newPosition: Position) => {
    if (scope.current) {
      animate(scope.current, {
        top: newPosition.y,
        left: newPosition.x,
      }, { duration: 0 })
      positionRef.current = newPosition
    }
  }

  useWindowResize(window.id, scope, {
    size: sizeRef.current,
    setSize: handleSetSize,
    position: positionRef.current,
    setPosition: handleSetPosition,
    minSize: { width: 200, height: 150 }
  })

  // Handle maximize/restore animation
  useEffect(() => {
    if (!scope.current || prevMaximized.current === window.isMaximized) return

    if (window.isMaximized) {
      animate(scope.current, {
        top: 0,
        left: 0,
        width: globalThis.window.innerWidth,
        height: globalThis.window.innerHeight - 48,
        scale: 1,
      }, {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      })
    } else {
      const targetTop = window.originalState?.position.y ?? positionRef.current.y
      const targetLeft = window.originalState?.position.x ?? positionRef.current.x
      const targetWidth = window.originalState?.size.width ?? sizeRef.current.width
      const targetHeight = window.originalState?.size.height ?? sizeRef.current.height

      animate(scope.current, {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        scale: 1,
      }, {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      })
    }

    prevMaximized.current = window.isMaximized
  }, [window.isMaximized, animate, window.originalState])

  // Handle minimize/restore animation
  useEffect(() => {
    const taskbarIcon = document.querySelector(`[data-window-id="${window.id}"] img`)
    if (!taskbarIcon || !scope.current) return

    const iconRect = taskbarIcon.getBoundingClientRect()
    const windowRect = scope.current.getBoundingClientRect()

    if (window.isMinimized) {
      const windowCenterX = windowRect.left + windowRect.width / 2
      const windowCenterY = windowRect.top + windowRect.height / 2
      const iconCenterX = iconRect.left + iconRect.width / 2
      const iconCenterY = iconRect.top + iconRect.height / 2

      animate(scope.current, {
        x: iconCenterX - windowCenterX,
        y: iconCenterY - windowCenterY,
        scale: iconRect.width / windowRect.width,
        opacity: 0,
      }, {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      })
    } else if (prevMinimized.current) {
      animate(scope.current, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      }, {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      })
    }

    prevMinimized.current = window.isMinimized
  }, [window.isMinimized, animate, window.id])

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
      position: 'absolute',
      width: '100vw',
      height: 'calc(100vh - 48px)',
    }
    : {
      position: 'absolute',
      top: positionRef.current.y,
      left: positionRef.current.x,
      width: sizeRef.current.width,
      height: sizeRef.current.height,
    }

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {!window.isClosing && (
        <motion.div
          ref={scope}
          className={cn(
            'absolute flex flex-col rounded-lg border bg-background shadow-lg',
            window.isActive && 'ring-1 ring-primary',
            window.isMinimized && 'pointer-events-none'
          )}
          style={{
            ...style,
            zIndex: window.zIndex,
          }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 30
            }
          }}
          exit={{
            scale: 0.8,
            opacity: 0,
            y: 20,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 30
            }
          }}
        >
          <WindowHeader
            window={window}
            position={positionRef.current}
            setPosition={handleSetPosition}
            onClose={handleClose}
          />
          <div ref={contentRef} className="flex-1 overflow-hidden" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
