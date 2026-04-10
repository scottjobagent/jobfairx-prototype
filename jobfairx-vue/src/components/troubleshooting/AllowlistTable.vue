<!--
  AllowlistTable
  -------
  Displays network allowlist entries in a table format showing domain,
  protocol, and ports for IT teams.
-->
<script setup lang="ts">
import type { AllowlistEntry } from '@/types/troubleshooting'

defineProps<{
  entries: AllowlistEntry[]
}>()
</script>

<template>
  <div class="bg-surface-raised border border-border-default rounded overflow-hidden">
    <!-- Header -->
    <div class="grid grid-cols-3 bg-surface-sunken px-5 py-3 border-b border-border-default">
      <div class="text-xs font-bold text-text-secondary uppercase tracking-wider">Domain</div>
      <div class="text-xs font-bold text-text-secondary uppercase tracking-wider">Protocol</div>
      <div class="text-xs font-bold text-text-secondary uppercase tracking-wider">Ports</div>
    </div>

    <!-- Rows -->
    <div
      v-for="(entry, idx) in entries"
      :key="idx"
      :class="[
        'grid grid-cols-3 px-5 py-3 text-sm',
        idx < entries.length - 1 ? 'border-b border-border-default' : '',
      ]"
    >
      <div class="font-semibold text-brand-blue font-mono">{{ entry.domain }}</div>
      <div class="text-text-primary">{{ entry.protocol }}</div>
      <div class="text-text-primary">{{ entry.ports }}</div>
    </div>
  </div>
</template>
