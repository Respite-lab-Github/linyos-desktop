import { create } from 'zustand'

export interface Window {
  id: string
  title: string
  appId: string
  isActive: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

interface WindowsState {
  windows: Window[]
  nextZIndex: number
  addWindow: (window: Omit<Window, 'id' | 'zIndex'>) => void
  removeWindow: (id: string) => void
  activateWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
  resizeWindow: (id: string, size: { width: number; height: number }) => void
}

export const useWindowsStore = create<WindowsState>((set) => ({
  windows: [],
  nextZIndex: 1,

  addWindow: (window) =>
    set((state) => ({
      windows: [
        ...state.windows,
        {
          ...window,
          id: crypto.randomUUID(),
          zIndex: state.nextZIndex,
        },
      ],
      nextZIndex: state.nextZIndex + 1,
    })),

  removeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  activateWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => ({
        ...w,
        isActive: w.id === id,
        zIndex: w.id === id ? state.nextZIndex : w.zIndex,
      })),
      nextZIndex: state.nextZIndex + 1,
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true, isActive: false } : w
      ),
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true } : w
      ),
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w
      ),
    })),

  moveWindow: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    })),

  resizeWindow: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    })),
}))
