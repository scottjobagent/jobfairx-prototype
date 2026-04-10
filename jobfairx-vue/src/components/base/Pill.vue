<!--
  Pill
  ----
  Small rounded label, used for tab counts and status badges in the lobby.
  Tone variants map to the prototype's color treatments.
-->
<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'

interface Props {
  tone?: Tone
}

const props = withDefaults(defineProps<Props>(), { tone: 'neutral' })

const toneClass = computed<string>(() => {
  const map: Record<Tone, string> = {
    neutral: 'bg-border-subtle text-text-secondary',
    brand: 'bg-brand-blue-light text-brand-blue',
    success: 'bg-green-50 text-status-success-dark',
    warning: 'bg-yellow-50 text-status-warning',
    danger: 'bg-status-danger-bg text-status-danger',
  }
  return map[props.tone]
})
</script>

<template>
  <span
    :class="['inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full', toneClass]"
  >
    <slot />
  </span>
</template>
