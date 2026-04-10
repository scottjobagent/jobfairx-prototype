<!--
  DevModeToggle
  -------------
  Tiny floating control matching the dev panel in lobby.html. Lets you
  swap between active / empty / live demo data without touching code.
  Delete this component (and the useLobbyMode mode-switching) once a
  real backend is wired up.
-->
<script setup lang="ts">
import { useLobbyMode } from '@/composables/useLobbyMode'
import type { LobbyMode } from '@/types/lobby'

const { mode, setMode } = useLobbyMode()

const modes: { key: LobbyMode; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'empty', label: 'Empty' },
  { key: 'live', label: 'Live' },
]
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-40 bg-surface-raised border border-border-strong rounded-lg shadow-menu p-2 flex items-center gap-1"
  >
    <span class="text-xs font-semibold text-text-tertiary px-2">DEMO</span>
    <button
      v-for="m in modes"
      :key="m.key"
      type="button"
      :class="[
        'px-3 py-1 text-sm font-medium rounded transition-colors',
        mode === m.key
          ? 'bg-brand-blue text-text-inverse'
          : 'text-text-secondary hover:bg-border-subtle',
      ]"
      @click="setMode(m.key)"
    >
      {{ m.label }}
    </button>
  </div>
</template>
