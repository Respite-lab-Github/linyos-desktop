import { useEffect } from 'react'
import { useAppsStore } from '@/store/apps'
import { useSystemStore } from '@/store/system'
import { Button } from '@/components/ui/button'
import { Settings, Power } from 'lucide-react'
import { useWindowsStore } from '@/store/windows'

export function StartMenu() {
  const { apps, loadApps, getAppModule, isLoading } = useAppsStore()
  const { isStartMenuOpen, toggleStartMenu } = useSystemStore()

  useEffect(() => {
    loadApps()
  }, [loadApps])

  if (!isStartMenuOpen) return null

  const handleAppClick = async (appId: string) => {
    try {
      const module = await getAppModule(appId)
      useWindowsStore.getState().addWindow({
        title: module.metadata.name,
        appId,
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
      console.error(`Failed to launch app ${appId}:`, error)
    }
  }

  return (
    <div className="fixed bottom-12 left-0 z-50 w-80 rounded-t-lg bg-background/95 p-4 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-4">
        {/* Apps List */}
        <div className="grid grid-cols-3 gap-2">
          {isLoading ? (
            <div className="col-span-3 text-center">Loading apps...</div>
          ) : (
            apps.map((app) => (
              <Button
                key={app.id}
                variant="ghost"
                className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg p-2"
                onClick={() => handleAppClick(app.id)}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  className="h-12 w-12 object-contain"
                />
                <span className="text-center text-xs font-medium">
                  {app.name}
                </span>
              </Button>
            ))
          )}
        </div>

        {/* System Controls */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => handleAppClick('settings')}
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
    </div>
  )
}
