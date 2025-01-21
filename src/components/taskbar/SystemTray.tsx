import { useSystemStore } from '@/store/system'
import { Volume2, Wifi, Battery } from 'lucide-react'

export function SystemTray() {
  const { isSystemTrayOpen } = useSystemStore()

  if (!isSystemTrayOpen) return null

  return (
    <div className="fixed bottom-12 right-0 z-50 w-80 rounded-t-lg bg-background/95 p-4 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-4">
        {/* Quick Settings */}
        <div className="grid grid-cols-3 gap-2">
          <button
            className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg p-2"
          >
            <Volume2 className="h-8 w-8" />
            <span className="text-xs">Volume</span>
          </button>
          <button
            className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg p-2"
          >
            <Wifi className="h-8 w-8" />
            <span className="text-xs">Wi-Fi</span>
          </button>
          <button
            className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg p-2"
          >
            <Battery className="h-8 w-8" />
            <span className="text-xs">Battery</span>
          </button>
        </div>

        {/* System Info */}
        <div className="flex flex-col gap-2 border-t pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Battery</span>
            <span>100%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Wi-Fi</span>
            <span>Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Volume</span>
            <span>50%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
