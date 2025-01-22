import { useSystemStore } from '@/store/system'
import { useAppsStore } from '@/store/apps'
import { useWindowsStore } from '@/store/windows'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'

export function StartMenu() {
  const { isStartMenuOpen, toggleStartMenu } = useSystemStore()
  const { apps } = useAppsStore()
  const { addWindow } = useWindowsStore()

  const handleAppClick = (app: typeof apps[number]) => {
    addWindow({
      title: app.name,
      appId: app.id,
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: Math.random() * (window.innerWidth - 600),
        y: Math.random() * (window.innerHeight - 400),
      },
      size: {
        width: 600,
        height: 400,
      },
    })
    toggleStartMenu()
  }

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <motion.div
          className="fixed bottom-14 left-2 z-50 w-80 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60"
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.9,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {apps.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <Button
                  variant="ghost"
                  className="h-20 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
                  onClick={() => handleAppClick(app)}
                >
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="h-8 w-8 object-contain"
                    draggable={false}
                  />
                  <span className="text-xs font-medium">{app.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">User</span>
                <span className="text-xs text-muted-foreground">user@linyos.com</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
