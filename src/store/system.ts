import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAppsStore } from './apps'
import { useWindowsStore } from './windows'
import { usePersistStore } from './persist'
import { renderApi } from '@/lib/render'
import { baseColors } from '@/lib/base-colors'

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

interface SystemSettings {
  wallpaper: string
  theme: string
  colorScheme: 'light' | 'dark'
}

interface SystemState {
  // System state
  isStartMenuOpen: boolean
  isSystemTrayOpen: boolean
  settings: SystemSettings

  // Actions
  toggleStartMenu: () => void
  toggleSystemTray: () => void
  setWallpaper: (wallpaper: string) => void
  setTheme: (theme: string) => void
  setColorScheme: (scheme: 'light' | 'dark') => void
  toggleColorScheme: () => void
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

// Helper function to apply theme
function applyTheme(themeName: string, colorScheme: 'light' | 'dark') {
  const scheme = baseColors.find((c) => c.name === themeName)
  if (!scheme) return

  const root = document.documentElement
  const vars = colorScheme === 'dark' ? scheme.cssVars.dark : scheme.cssVars.light

  // 设置颜色方案
  root.classList.remove('light', 'dark')
  root.classList.add(colorScheme)

  // 应用主题变量
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set, get) => ({
      isStartMenuOpen: false,
      isSystemTrayOpen: false,
      settings: {
        wallpaper: '',
        theme: 'zinc',
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      },

      toggleStartMenu: () =>
        set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),

      toggleSystemTray: () =>
        set((state) => ({ isSystemTrayOpen: !state.isSystemTrayOpen })),

      setWallpaper: (wallpaper: string) =>
        set((state) => ({
          settings: { ...state.settings, wallpaper }
        })),

      setTheme: (theme: string) => {
        const { colorScheme } = get().settings
        set((state) => ({
          settings: { ...state.settings, theme }
        }))
        applyTheme(theme, colorScheme)
      },

      setColorScheme: (colorScheme: 'light' | 'dark') => {
        const { theme } = get().settings
        set((state) => ({
          settings: { ...state.settings, colorScheme }
        }))
        applyTheme(theme, colorScheme)
      },

      toggleColorScheme: () => {
        const { colorScheme, theme } = get().settings
        const newScheme = colorScheme === 'light' ? 'dark' : 'light'
        set((state) => ({
          settings: { ...state.settings, colorScheme: newScheme }
        }))
        applyTheme(theme, newScheme)
      },
    }),
    {
      name: 'linyos-persist-storage/system-data',
      onRehydrateStorage: () => (state) => {
        // 加载应用
        useAppsStore.getState().loadApps()

        // 应用系统设置
        if (state) {
          const { theme, colorScheme } = state.settings
          applyTheme(theme, colorScheme)

          // 监听系统颜色方案变化
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newScheme = e.matches ? 'dark' : 'light'
            state.setColorScheme(newScheme)
          })
        }
      }
    }
  )
)

if (typeof window !== 'undefined') {
  window.linyos = {
    useSystemStore,
    useAppsStore,
    useWindowsStore,
    usePersistStore,
    renderApi,
  }
}
