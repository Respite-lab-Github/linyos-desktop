import { create } from 'zustand'
import { useAppsStore } from './apps'
import { useWindowsStore } from './windows'
import { usePersistStore } from './persist'
import { renderApi } from '@/lib/render'

export interface AppMetadata {
  id: string
  name: string
  icon: string
  description: string
  version: string
}

interface AppModule {
  metadata: AppMetadata
  render: (container: HTMLElement) => void
  destroy?: () => void
}

interface SystemState {
  isInitialized: boolean
  isStartMenuOpen: boolean
  isSystemTrayOpen: boolean
  initialize: () => Promise<void>
  toggleStartMenu: () => void
  toggleSystemTray: () => void
}

export interface SystemStore {
  // System state
  isInitialized: boolean
  installedModules: Map<string, AppModule>

  // Actions
  initialize: () => Promise<void>
  fetchAppList: () => Promise<string[]>
  installApp: (appId: string) => Promise<void>
  uninstallApp: (appId: string) => Promise<void>
  renderApp: (appId: string, container: HTMLElement) => void
  destroyApp: (appId: string, container: HTMLElement) => void
}

export const useSystemStore = create<SystemState>((set) => ({
  isInitialized: false,
  isStartMenuOpen: false,
  isSystemTrayOpen: false,

  initialize: async () => {
    try {
      await useAppsStore.getState().loadApps()
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize system:', error)
    }
  },

  toggleStartMenu: () =>
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  toggleSystemTray: () =>
    set((state) => ({ isSystemTrayOpen: !state.isSystemTrayOpen })),
}))

// Expose stores to window for external access
declare global {
  interface Window {
    linyos: {
      useSystemStore: typeof useSystemStore
      useAppsStore: typeof useAppsStore
      useWindowsStore: typeof useWindowsStore
      usePersistStore: typeof usePersistStore
      renderApi: typeof renderApi
    }
  }
}

if (typeof window !== 'undefined') {
  window.linyos = {
    useSystemStore,
    useAppsStore,
    useWindowsStore,
    usePersistStore,
    renderApi,
  }
}
