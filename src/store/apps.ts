import { create } from 'zustand'
import type { AppMetadata } from './system'
import { getAvailableApps, loadAppModule } from '@/lib/app-loader'

interface AppsState {
  apps: AppMetadata[]
  loadedModules: Record<string, any>
  isLoading: boolean
  loadApps: () => Promise<void>
  getAppModule: (appId: string) => Promise<any>
}

export const useAppsStore = create<AppsState>((set, get) => ({
  apps: [],
  loadedModules: {},
  isLoading: false,

  loadApps: async () => {
    set({ isLoading: true })
    try {
      const apps = await getAvailableApps()
      set({ apps })
    } catch (error) {
      console.error('Failed to load apps:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  getAppModule: async (appId: string) => {
    const { loadedModules } = get()

    if (loadedModules[appId]) {
      return loadedModules[appId]
    }

    try {
      const module = await loadAppModule(appId)
      set((state) => ({
        loadedModules: { ...state.loadedModules, [appId]: module }
      }))
      return module
    } catch (error) {
      console.error(`Failed to load app module ${appId}:`, error)
      throw error
    }
  }
}))
