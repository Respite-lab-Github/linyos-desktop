import type { AppMetadata } from '@/store/system'

// 动态导入应用模块
const appModules = import.meta.glob<{
  metadata: AppMetadata
  render: (container: HTMLElement) => void
  destroy: (container: HTMLElement) => void
}>('/src/apps/*/index.tsx', { eager: false })

// 获取所有可用的应用
export async function getAvailableApps(): Promise<AppMetadata[]> {
  const apps: AppMetadata[] = []

  for (const path in appModules) {
    try {
      const module = await appModules[path]()
      apps.push(module.metadata)
    } catch (error) {
      console.error(`Failed to load app from ${path}:`, error)
    }
  }

  return apps
}

// 加载单个应用模块
export async function loadAppModule(appId: string) {
  const modulePath = `/src/apps/${appId}/index.tsx`
  const importFn = appModules[modulePath]

  if (!importFn) {
    throw new Error(`App module not found: ${modulePath}`)
  }

  return importFn()
}

// 获取应用的元数据
export async function getAppMetadata(appId: string): Promise<AppMetadata> {
  const module = await loadAppModule(appId)
  return module.metadata
}
