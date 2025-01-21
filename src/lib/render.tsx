import React from 'react'
import { createRoot, type Root } from 'react-dom/client'

const roots = new Map<HTMLElement, Root>()

export const renderApi = {
  render: (container: HTMLElement, content: React.ReactNode) => {
    let root = roots.get(container)
    if (!root) {
      root = createRoot(container)
      roots.set(container, root)
    }
    root.render(
      <React.StrictMode>
        <div className="h-full w-full">{content}</div>
      </React.StrictMode>
    )
  },

  destroy: (container: HTMLElement) => {
    const root = roots.get(container)
    if (root) {
      root.unmount()
      roots.delete(container)
    }
  },
}
