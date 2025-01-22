import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { baseColors } from '@/lib/base-colors'

interface Settings {
  wallpaper: string
  theme: string
}

interface SettingsState extends Settings {
  setWallpaper: (wallpaper: string) => void
  setTheme: (theme: string) => void
  applySettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      wallpaper: '',
      theme: 'blue',

      setWallpaper: (wallpaper: string) => set({ wallpaper }),

      setTheme: (theme: string) => {
        set({ theme })
        const state = get()
        applyTheme(state.theme)
      },

      applySettings: () => {
        const state = get()
        applyTheme(state.theme)
      }
    }),
    {
      name: 'settings'
    }
  )
)

// Helper function to apply theme
function applyTheme(themeName: string) {
  const scheme = baseColors.find((c) => c.name === themeName)
  if (!scheme) return

  const root = document.documentElement
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const vars = isDark ? scheme.cssVars.dark : scheme.cssVars.light

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}

// Hook for components to use
export function useSettings() {
  const settings = useSettingsStore()
  return settings
}
