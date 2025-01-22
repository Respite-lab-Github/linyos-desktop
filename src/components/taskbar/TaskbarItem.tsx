import { Window } from '@/store/windows'
import { useWindowsStore } from '@/store/windows'
import { useAppsStore } from '@/store/apps'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'

interface TaskbarItemProps {
  window: Window
}

export function TaskbarItem({ window }: TaskbarItemProps) {
  const { restoreWindow, activateWindow } = useWindowsStore()
  const { apps } = useAppsStore()
  const app = apps.find(app => app.id === window.appId)

  const handleClick = () => {
    if (window.isMinimized) {
      restoreWindow(window.id)
    } else if (window.isActive) {
      useWindowsStore.getState().minimizeWindow(window.id)
    } else {
      activateWindow(window.id)
    }
  }

  if (!app) return null

  return (
    <motion.div
      layout="position"
      initial={false}
      animate={{
        scale: window.isMinimized ? 0.9 : 1,
        opacity: window.isMinimized ? 0.6 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'relative h-12 w-12 rounded-none border-b-2 border-transparent p-0',
          window.isActive && !window.isMinimized && 'border-primary bg-muted',
          'hover:bg-muted transition-colors duration-200'
        )}
        onClick={handleClick}
        data-window-id={window.id}
      >
        <motion.div
          initial={false}
          animate={{
            scale: window.isActive && !window.isMinimized ? 1.1 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
          data-window-id={window.id}
        >
          <img
            src={app.icon}
            alt={app.name}
            className="h-6 w-6 object-contain"
            draggable={false}
          />
        </motion.div>
        <span className="sr-only">{window.title}</span>
      </Button>
    </motion.div>
  )
}
