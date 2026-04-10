<!--
  EventHeader
  -----------
  Title row above the lobby tabs. Shows the event name, the time window,
  and a "live" indicator dot. Mirrors the .event-header block from
  lobby.html.
-->
<script setup lang="ts">
import type { LobbyEvent } from '@/types/lobby'

defineProps<{
  event: LobbyEvent
}>()
</script>

<template>
  <div class="flex items-end justify-between mb-4">
    <div>
      <h1 class="text-3xl font-bold text-text-primary">{{ event.title }}</h1>
      <p class="mt-1 text-base text-text-secondary">{{ event.displayWindow }}</p>
    </div>
    <div class="flex items-center gap-2 text-sm text-status-success-dark font-medium">
      <span class="relative flex h-2.5 w-2.5">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-success"></span>
      </span>
      Live now
    </div>
  </div>
</template>
