import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useSystemStore } from '@/store/system'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { initialize, isInitialized } = useSystemStore()

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [initialize, isInitialized])

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Outlet />
    </div>
  )
}
