import { create } from 'zustand'

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

export interface Window {
  id: string
  title: string
  appId: string
  isActive: boolean
  isMinimized: boolean
  isMaximized: boolean
  isClosing: boolean
  position: Position
  size: Size
  zIndex: number
  originalState?: {
    position: Position
    size: Size
    isMaximized: boolean
  }
}

interface WindowsState {
  windows: Window[]
  nextZIndex: number
  addWindow: (window: Omit<Window, 'id' | 'zIndex' | 'isClosing' | 'originalState'>) => void
  removeWindow: (id: string) => void
  setClosing: (id: string, isClosing: boolean) => void
  activateWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  resizeWindow: (id: string, size: Size) => void
  moveWindow: (id: string, position: Position) => void
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
          isClosing: false,
        },
      ],
      nextZIndex: state.nextZIndex + 1,
    })),

  removeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  setClosing: (id, isClosing) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isClosing,
            }
          : w
      ),
    })),

  activateWindow: (id) =>
    set((state) => {
      const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex))
      return {
        windows: state.windows.map((w) => ({
          ...w,
          isActive: w.id === id,
          zIndex: w.id === id ? maxZIndex + 1 : w.zIndex,
        })),
        nextZIndex: maxZIndex + 2,
      }
    }),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMinimized: true,
              isActive: false,
            }
          : w
      ),
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: true,
              isMinimized: false,
              originalState: {
                position: w.position,
                size: w.size,
                isMaximized: false
              },
              position: { x: 0, y: 0 },
              size: {
                width: globalThis.window.innerWidth,
                height: globalThis.window.innerHeight - 48,
              },
            }
          : w
      ),
    })),

  restoreWindow: (id) =>
    set((state) => {
      const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex))
      return {
        windows: state.windows.map((w) => {
          if (w.id !== id) return w

          const restored = {
            ...w,
            isMinimized: false,
            isActive: true,
            zIndex: maxZIndex + 1,
          }

          if (w.originalState) {
            restored.position = w.originalState.position
            restored.size = w.originalState.size
            restored.isMaximized = false
            restored.originalState = undefined
          }

          return restored
        }),
        nextZIndex: maxZIndex + 2,
      }
    }),

  resizeWindow: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              size,
            }
          : w
      ),
    })),

  moveWindow: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              position,
            }
          : w
      ),
    })),
}))
