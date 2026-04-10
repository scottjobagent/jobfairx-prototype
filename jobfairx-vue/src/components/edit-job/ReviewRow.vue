<!--
  ReviewRow
  ---------
  Single row in the job details review table. Supports:
  - Locked rows (title, location) with lock icon + tooltip
  - Editable rows with pencil icon and edit handler
  - Multi-line value display (for description preview)
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string
  isLocked?: boolean
  isMultiline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLocked: false,
  isMultiline: false,
})

const emit = defineEmits<{
  edit: []
}>()

const displayValue = computed<string>(() => {
  return props.value || '(not set)'
})
</script>

<template>
  <tr :class="['border-b border-border-default py-4', isLocked ? 'opacity-60' : '']">
    <!-- Label -->
    <td class="w-44 pr-6 py-4 text-md font-semibold text-text-primary align-top whitespace-nowrap">
      {{ label }}
    </td>

    <!-- Value -->
    <td class="py-4 pr-4 text-md text-text-primary align-top break-words">
      <div
        v-if="isMultiline"
        class="whitespace-pre-wrap text-text-secondary text-sm leading-relaxed"
      >
        {{ displayValue }}
      </div>
      <div v-else class="text-text-secondary">{{ displayValue }}</div>
    </td>

    <!-- Action: lock or edit -->
    <td class="py-4 pl-4 w-10 text-right align-top">
      <template v-if="isLocked">
        <div
          class="group relative inline-flex items-center justify-center w-8 h-8 rounded text-text-tertiary hover:text-text-secondary transition-colors"
          role="img"
          aria-label="Locked"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <!-- Tooltip: appears on hover -->
          <div class="absolute right-full mr-2 bottom-1/2 translate-y-1/2 hidden group-hover:block bg-text-primary text-text-inverse text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap pointer-events-none z-10">
            Can't change after posting
          </div>
        </div>
      </template>
      <template v-else>
        <button
          type="button"
          class="inline-flex items-center justify-center w-8 h-8 rounded text-brand-blue hover:bg-border-subtle transition-colors"
          aria-label="Edit"
          @click="emit('edit')"
        >
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </template>
    </td>
  </tr>
</template>
