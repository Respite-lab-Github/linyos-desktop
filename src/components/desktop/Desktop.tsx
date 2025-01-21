import { useAppsStore } from '@/store/apps'
import { useWindowsStore } from '@/store/windows'
import { Window } from '@/components/window/Window'
import { StartMenu } from '@/components/start-menu/StartMenu'
import { cn } from '@/lib/utils'

export function Desktop() {
  const { apps } = useAppsStore()
  const { windows } = useWindowsStore()

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
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <div className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[repeat(auto-fill,minmax(100px,1fr))] gap-1 p-2">
        {apps.map((app) => (
          <button
            key={app.id}
            className={cn(
              'flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-lg p-2 hover:bg-accent'
            )}
            onClick={() => handleAppClick(app)}
          >
            <img
              src={app.icon}
              alt={app.name}
              className="h-12 w-12 object-contain"
            />
            <span className="text-center text-xs font-medium leading-tight">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}

      <StartMenu />
    </div>
  )
}
