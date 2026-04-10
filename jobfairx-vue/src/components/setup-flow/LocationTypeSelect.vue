<!--
  LocationTypeSelect
  ------------------
  Custom dropdown for location type (in-person, remote, hybrid, on-the-road).
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LocationType } from '@/types/setup-flow'

interface Props {
  modelValue: LocationType
}

interface Emits {
  (e: 'update:modelValue', value: LocationType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)

const options: Array<{ value: LocationType; label: string }> = [
  { value: 'in-person', label: 'In person' },
  { value: 'remote', label: 'Fully remote: no on-site work required' },
  { value: 'hybrid', label: 'Hybrid: some on-site work required' },
  { value: 'on-the-road', label: 'On the road' },
]

const selectedLabel = computed(() => {
  return options.find(o => o.value === props.modelValue)?.label ?? 'Select'
})

const select = (value: LocationType): void => {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-lg font-semibold text-text-primary">Job location type <span class="text-status-danger">*</span></label>
    <div class="relative">
      <button
        type="button"
        class="w-full rounded-lg border-2 border-text-tertiary px-5 py-3 text-left flex items-center justify-between hover:border-text-primary focus:outline-none focus:border-brand-blue"
        @click="isOpen = !isOpen"
      >
        <span>{{ selectedLabel }}</span>
        <svg class="w-5 h-5 text-text-tertiary transition-transform" :style="{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div v-if="isOpen" class="absolute top-full left-0 right-0 mt-1 z-20 bg-surface-raised border border-border-default rounded-lg shadow-menu">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          class="w-full text-left px-5 py-3 hover:bg-border-subtle transition-colors flex items-center gap-3"
          :class="{ 'bg-border-subtle': opt.value === modelValue }"
          @click="select(opt.value)"
        >
          <svg v-if="opt.value === modelValue" class="w-5 h-5 text-text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else class="w-5 h-5 text-transparent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>
