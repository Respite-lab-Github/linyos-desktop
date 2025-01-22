import { useEffect } from 'react'
import { useAppsStore } from '@/store/apps'
import { useSystemStore } from '@/store/system'
import { Button } from '@/components/ui/button'
import { Settings, Power } from 'lucide-react'
import { useWindowsStore } from '@/store/windows'
import { cn } from '@/lib/utils'

export function StartMenu() {
  const { apps, loadApps, getAppModule, isLoading } = useAppsStore()
  const { isStartMenuOpen, toggleStartMenu } = useSystemStore()

  useEffect(() => {
    loadApps()
  }, [loadApps])

  const handleAppClick = async (app: typeof apps[number]) => {
    try {
      const module = await getAppModule(app.id)
      useWindowsStore.getState().addWindow({
        title: module.metadata.name,
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
    } catch (error) {
      console.error(`Failed to launch app ${app.id}:`, error)
    }
  }

  if (!isStartMenuOpen) return null

  return (
    <>
      {/* Menu */}
      <div className="absolute bottom-14 left-4 z-50 w-80 rounded-xl border bg-background/95 p-4 shadow-lg">
        <div className="grid grid-cols-4 gap-2">
          {isLoading ? (
            <div className="col-span-4 text-center">Loading apps...</div>
          ) : (
            apps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-lg p-2',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none'
                )}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-center text-xs font-medium leading-none">
                  {app.name}
                </span>
              </button>
            ))
          )}
        </div>

        {/* System Controls */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => handleAppClick(apps.find((app) => app.id === 'settings')!)}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-destructive"
          >
            <Power className="h-4 w-4" />
            <span>Shut Down</span>
          </Button>
        </div>
      </div>
    </>
  )
}
