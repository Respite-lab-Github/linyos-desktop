import { useWindowsStore } from '@/store/windows'
import { useSystemStore } from '@/store/system'
import { TaskbarItem } from './TaskbarItem'
import { SystemTray } from './SystemTray'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'motion/react'

export function Taskbar() {
  const windows = useWindowsStore((state) => state.windows)
  const { toggleStartMenu, toggleSystemTray } = useSystemStore()

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-t bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg rounded-b-none mx-5"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      <div className="flex w-full items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-muted transition-colors duration-200"
            onClick={toggleStartMenu}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </motion.div>
            <span className="sr-only">Start Menu</span>
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-1 items-center justify-center gap-1"
          layout
        >
          <AnimatePresence mode="popLayout">
            {windows.map((window) => (
              <TaskbarItem key={window.id} window={window} />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-muted transition-colors duration-200"
            onClick={toggleSystemTray}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
              </svg>
            </motion.div>
            <span className="sr-only">System Tray</span>
          </Button>
        </motion.div>
      </div>

      <SystemTray />
    </motion.div>
  )
}



