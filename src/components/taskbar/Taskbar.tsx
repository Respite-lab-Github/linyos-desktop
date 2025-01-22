import { Button } from '@/components/ui/button'
import { useWindowsStore } from '@/store/windows'
import { useAppsStore } from '@/store/apps'
import { useSystemStore } from '@/store/system'
import { SystemTray } from './SystemTray'
import { cn } from '@/lib/utils'
import { Bell } from 'lucide-react'

export function Taskbar() {
  const { windows, activateWindow } = useWindowsStore()
  const { apps } = useAppsStore()
  const { toggleStartMenu, toggleSystemTray } = useSystemStore()

  return (
    <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-between px-4 bg-background rounded-3xl rounded-b-none">
      {/* 内容 */}
      <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={toggleStartMenu}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md',
              'bg-transparent text-sm font-medium opacity-70 ring-offset-background',
              'transition-opacity hover:opacity-100',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          >
            <span className="sr-only">Open start menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </button>
        </div>

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
    </div>
  )
}



