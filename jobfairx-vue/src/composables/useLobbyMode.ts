/**
 * useLobbyMode
 *
 * Singleton composable that holds the dev-only lobby mode toggle
 * (active / empty / live). Mirrors the `setLobbyMode()` switch in the
 * HTML prototype's lobby.html dev panel.
 *
 * Exposed as a module-level ref so every component shares the same
 * instance — there's only ever one "current mode" per app session.
 *
 * In production, delete this composable and have components read
 * directly from a real data source.
 */

import { computed, ref } from 'vue'
import type { LobbyMode } from '@/types/lobby'
import { LOBBY_DATA } from '@/data/lobby-mock'

const mode = ref<LobbyMode>('active')

export function useLobbyMode() {
  const setMode = (next: LobbyMode): void => {
    mode.value = next
  }

  const dataset = computed(() => LOBBY_DATA[mode.value])

  return {
    mode,
    setMode,
    dataset,
  }
}
