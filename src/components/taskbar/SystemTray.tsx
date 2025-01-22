import { useSystemStore } from '@/store/system'
import { Volume2, Wifi, Battery, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'

export function SystemTray() {
  const { isSystemTrayOpen } = useSystemStore()

  return (
    <AnimatePresence>
      {isSystemTrayOpen && (
        <motion.div
          className="fixed bottom-14 right-2 z-50 w-80 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Volume2 className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Volume</span>
                  <span className="text-xs text-muted-foreground">50%</span>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Wifi className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Wi-Fi</span>
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Battery className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Battery</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Sun className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Brightness</span>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Night Light</span>
              <div className="h-4 w-8 rounded-full bg-primary/20" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Battery Saver</span>
              <div className="h-4 w-8 rounded-full bg-primary/20" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Focus Assist</span>
              <div className="h-4 w-8 rounded-full bg-primary/20" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
