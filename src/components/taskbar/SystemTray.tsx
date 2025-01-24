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
            stiffness: 400,
            damping: 30,
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <motion.div
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
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Volume2 className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">音量</span>
                  <span className="text-xs text-muted-foreground">50%</span>
                </div>
              </Button>
            </motion.div>

            <motion.div
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
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Wifi className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Wi-Fi 互联网</span>
                  <span className="text-xs text-muted-foreground">已连接</span>
                </div>
              </Button>
            </motion.div>

            <motion.div
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
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Battery className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">电池</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </Button>
            </motion.div>

            <motion.div
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
                className="h-24 w-full flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent"
              >
                <Sun className="h-8 w-8" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">亮度</span>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">夜间模式</span>
              <div className="h-4 w-8 rounded-full bg-primary/20" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">低电量模式</span>
              <div className="h-4 w-8 rounded-full bg-primary/20" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">专注助手</span>
              <div className="h-4 w-8 rounded-full bg-primary/20" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
