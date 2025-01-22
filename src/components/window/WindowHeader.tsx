import { useRef } from 'react'
import { Window } from '@/store/windows'
import { useWindowsStore } from '@/store/windows'
import { useWindowDrag } from '@/hooks/use-window-drag'
import { cn } from '@/lib/utils'
import { Minus, Square, X, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'

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
    <motion.div
      ref={headerRef}
      className={cn(
        'flex h-10 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 rounded-lg',
        'cursor-move select-none'
      )}
      onMouseDown={() => activateWindow(window.id)}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{window.title}</span>
      </div>
      <div className="flex items-center gap-0.5">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none hover:bg-muted transition-colors duration-200"
            onClick={() => minimizeWindow(window.id)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Minimize</span>
            </motion.div>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none hover:bg-muted transition-colors duration-200"
            onClick={handleMaximizeClick}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={window.isMaximized ? 'restore' : 'maximize'}
                  initial={{ scale: 0, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.2 }}
                >
                  {window.isMaximized ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="sr-only">{window.isMaximized ? 'Restore' : 'Maximize'}</span>
            </motion.div>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none hover:bg-red-500 hover:text-white transition-colors duration-200"
            onClick={() => removeWindow(window.id)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
