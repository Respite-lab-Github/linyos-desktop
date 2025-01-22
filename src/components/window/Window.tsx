import React, { useEffect, useRef, useState } from 'react'
import { Window as WindowType } from '@/store/windows'
import { useAppsStore } from '@/store/apps'
import { cn } from '@/lib/utils'
import { WindowHeader } from './WindowHeader'
import { useWindowResize } from '@/hooks/use-window-resize'
import { motion, useAnimate, AnimatePresence } from 'motion/react'

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
  const [position, setPosition] = useState<Position>(window.position)
  const [size, setSize] = useState<Size>(window.size)
  const prevMaximized = useRef(window.isMaximized)
  const prevMinimized = useRef(window.isMinimized)
  const [scope, animate] = useAnimate()

  // Store current position and size in refs to avoid dependency issues
  const positionRef = useRef(position)
  const sizeRef = useRef(size)

  useEffect(() => {
    positionRef.current = position
    sizeRef.current = size
  }, [position, size])

  // Custom setSize and setPosition functions that use animate
  const handleSetSize = (newSize: Size) => {
    if (scope.current) {
      animate(scope.current, {
        width: newSize.width,
        height: newSize.height,
      }, { duration: 0 })
    }
    setSize(newSize)
  }

  const handleSetPosition = (newPosition: Position) => {
    if (scope.current) {
      animate(scope.current, {
        top: newPosition.y,
        left: newPosition.x,
      }, { duration: 0 })
    }
    setPosition(newPosition)
  }

  useWindowResize(window.id, scope, {
    size,
    setSize: handleSetSize,
    position,
    setPosition: handleSetPosition,
    minSize: { width: 200, height: 150 }
  })

  // Handle maximize/restore animation
  useEffect(() => {
    if (!scope.current || prevMaximized.current === window.isMaximized) return

    const windowRect = scope.current.getBoundingClientRect()

    if (window.isMaximized) {
      // Store current dimensions before maximizing
      scope.current.style.width = `${windowRect.width}px`
      scope.current.style.height = `${windowRect.height}px`
      scope.current.style.top = `${windowRect.top}px`
      scope.current.style.left = `${windowRect.left}px`

      // Force a reflow to ensure the previous values are applied
      void scope.current.offsetHeight

      // Animate to maximized state
      animate(scope.current, {
        top: 0,
        left: 0,
        width: globalThis.window.innerWidth,
        height: globalThis.window.innerHeight - 48,
      }, {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      })
    } else {
      // Get current dimensions
      const currentRect = scope.current.getBoundingClientRect()

      // Set current dimensions explicitly
      scope.current.style.width = `${currentRect.width}px`
      scope.current.style.height = `${currentRect.height}px`
      scope.current.style.top = `${currentRect.top}px`
      scope.current.style.left = `${currentRect.left}px`

      // Force a reflow
      void scope.current.offsetHeight

      // Get target dimensions
      const targetTop = window.originalState?.position.y ?? positionRef.current.y
      const targetLeft = window.originalState?.position.x ?? positionRef.current.x
      const targetWidth = window.originalState?.size.width ?? sizeRef.current.width
      const targetHeight = window.originalState?.size.height ?? sizeRef.current.height

      // Animate to restored state
      animate(scope.current, {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
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
      // Calculate the center point of the window and icon
      const windowCenterX = windowRect.left + windowRect.width / 2
      const windowCenterY = windowRect.top + windowRect.height / 2
      const iconCenterX = iconRect.left + iconRect.width / 2
      const iconCenterY = iconRect.top + iconRect.height / 2

      // Calculate the translation needed to move the window center to the icon center
      const translateX = iconCenterX - windowCenterX
      const translateY = iconCenterY - windowCenterY

      // Animate to taskbar icon
      animate(scope.current, {
        x: translateX,
        y: translateY,
        scale: iconRect.width / windowRect.width,
        opacity: 0,
      }, {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      })
    } else if (prevMinimized.current) {
      // Set initial position for restore animation
      const windowCenterX = windowRect.left + windowRect.width / 2
      const windowCenterY = windowRect.top + windowRect.height / 2
      const iconCenterX = iconRect.left + iconRect.width / 2
      const iconCenterY = iconRect.top + iconRect.height / 2
      const translateX = iconCenterX - windowCenterX
      const translateY = iconCenterY - windowCenterY

      // Immediately set the starting position
      scope.current.style.transform = `translate(${translateX}px, ${translateY}px) scale(${iconRect.width / windowRect.width})`
      scope.current.style.opacity = '0'

      // Animate to normal position
      animate(scope.current, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      }, {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      })
    } else {
      // Reset transform and opacity for non-minimized windows
      animate(scope.current, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      }, {
        duration: 0,
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
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
      }

  return (
    <AnimatePresence>
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
      >
        <WindowHeader window={window} position={position} setPosition={handleSetPosition} />
        <div ref={contentRef} className="flex-1 overflow-hidden" />
      </motion.div>
    </AnimatePresence>
  )
}
