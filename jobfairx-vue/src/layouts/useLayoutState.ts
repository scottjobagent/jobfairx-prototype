/**
 * Shared layout state — sidebar collapse + dev view toggle.
 *
 * Mirrors visual.html:
 *   - `toggleSidebar()` adds/removes `.collapsed` on <body> and the sidebar.
 *   - `setDevMode('active'|'empty'|'live', btn)` switches which view of the
 *     dashboard table is rendered. In the Vue port the dev toggle lives on
 *     the topbar; the dashboard page reads `devMode` from this composable.
 */
import { ref } from 'vue'

export type DevMode = 'active' | 'empty' | 'live'

// Module-level refs so all consumers share the same state.
const sidebarCollapsed = ref(false)
const devMode = ref<DevMode>('active')

export function useLayoutState() {
  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  const setDevMode = (mode: DevMode): void => {
    devMode.value = mode
  }
  return {
    sidebarCollapsed,
    devMode,
    toggleSidebar,
    setDevMode,
  }
}
