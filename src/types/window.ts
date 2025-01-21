import type { renderApi } from '@/lib/render'
import type { useSystemStore } from '@/store/system'
import type { useAppsStore } from '@/store/apps'
import type { useWindowsStore } from '@/store/windows'
import type { usePersistStore } from '@/store/persist'

export interface Window {
  linyos: {
    useSystemStore: typeof useSystemStore
    useAppsStore: typeof useAppsStore
    useWindowsStore: typeof useWindowsStore
    usePersistStore: typeof usePersistStore
    renderApi: typeof renderApi
  }
}
