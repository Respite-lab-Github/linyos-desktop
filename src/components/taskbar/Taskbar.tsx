import { Button } from '@/components/ui/button'
import { useWindowsStore } from '@/store/windows'
import { useAppsStore } from '@/store/apps'
import { useSystemStore } from '@/store/system'
import { SystemTray } from './SystemTray'
import { cn } from '@/lib/utils'
import { Grid, Bell } from 'lucide-react'

export function Taskbar() {
  const { windows, activateWindow } = useWindowsStore()
  const { apps } = useAppsStore()
  const { toggleStartMenu, toggleSystemTray } = useSystemStore()

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-12 items-center gap-1 bg-background/80 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={toggleStartMenu}
        >
          <Grid className="h-6 w-6" />
        </Button>

        <div className="flex flex-1 items-center gap-1 overflow-x-auto px-1">
          {windows.map((window) => {
            const app = apps.find((app) => app.id === window.appId)
            if (!app) return null

            return (
              <Button
                key={window.id}
                variant="ghost"
                className={cn(
                  'h-10 gap-2',
                  window.isActive && 'bg-accent',
                  window.isMinimized && 'opacity-60'
                )}
                onClick={() => {
                  if (window.isMinimized) {
                    useWindowsStore.getState().restoreWindow(window.id)
                    activateWindow(window.id)
                  } else if (!window.isActive) {
                    activateWindow(window.id)
                  } else {
                    useWindowsStore.getState().minimizeWindow(window.id)
                  }
                }}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  className="h-5 w-5 object-contain"
                />
                <span className="text-sm">{window.title}</span>
              </Button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={toggleSystemTray}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <SystemTray />
    </>
  )
}



