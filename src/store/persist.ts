import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppData {
  [appId: string]: {
    [key: string]: unknown
  }
}

interface PersistStore {
  appData: AppData
  setAppData: (appId: string, key: string, value: unknown) => void
  getAppData: <T>(appId: string, key: string) => T | undefined
  clearAppData: (appId: string) => void
}

export const usePersistStore = create<PersistStore>()(
  persist(
    (set, get) => ({
      appData: {},

      setAppData: (appId, key, value) => {
        set((state) => ({
          appData: {
            ...state.appData,
            [appId]: {
              ...state.appData[appId],
              [key]: value,
            },
          },
        }))
      },

      getAppData: <T,>(appId: string, key: string): T | undefined => {
        const value = get().appData[appId]?.[key]
        return value as T | undefined
      },

      clearAppData: (appId) => {
        set((state) => {
          const newAppData = { ...state.appData }
          delete newAppData[appId]
          return { appData: newAppData }
        })
      },
    }),
    {
      name: 'linyos-persist-storage',
    }
  )
)
