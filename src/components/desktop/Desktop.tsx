import { useAppsStore } from '@/store/apps'
import { useWindowsStore } from '@/store/windows'
import { useSystemStore } from '@/store/system'
import { Window } from '@/components/window/Window'
import { StartMenu } from '@/components/start-menu/StartMenu'
import { Taskbar } from '@/components/taskbar/Taskbar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Desktop() {
  const { apps } = useAppsStore()
  const { windows } = useWindowsStore()
  const { settings } = useSystemStore()

  const handleAppClick = (app: typeof apps[number]) => {
    useWindowsStore.getState().addWindow({
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
  }

  return (
    <div
      className={cn(
        "relative h-screen w-screen overflow-hidden",
        settings.wallpaper ? "bg-cover bg-center bg-no-repeat" : "bg-background"
      )}
      style={settings.wallpaper ? { backgroundImage: `url(${settings.wallpaper})` } : undefined}
    >
      {/* Semi-transparent overlay for better icon visibility */}
      {settings.wallpaper && (
        <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px]" />
      )}

      <div className="relative grid h-[calc(100vh-48px)] w-full grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[repeat(auto-fill,minmax(100px,1fr))] gap-1 p-2">
        {apps.map((app) => (
          <Button
            key={app.id}
            variant="ghost"
            className={cn(
              'group relative flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-lg p-2',
              'hover:bg-background/20 hover:backdrop-blur-md',
              'focus:bg-background/30 focus:outline-none focus:ring-2 focus:ring-ring',
              'active:scale-95 active:bg-background/40'
            )}
            onClick={() => handleAppClick(app)}
          >
            <div className="relative h-12 w-12">
              <img
                src={app.icon}
                alt={app.name}
                className="h-full w-full object-contain drop-shadow-md"
              />
            </div>
            <span className={cn(
              "text-center text-xs font-medium leading-tight",
              "text-foreground/90 group-hover:text-foreground",
              settings.wallpaper && "drop-shadow-md"
            )}>
              {app.name}
            </span>
          </Button>
        ))}
      </div>

      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}

      <StartMenu />
      <Taskbar />
    </div>
  )
}
