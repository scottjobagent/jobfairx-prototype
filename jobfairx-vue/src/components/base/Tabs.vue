<!--
  Tabs
  ----
  Horizontal tab strip matching the lobby's tab UI: text label + count pill,
  underline on the active tab. v-model:active two-way binds the active key.
-->
<script setup lang="ts" generic="K extends string">
import Pill from './Pill.vue'

defineProps<{
  tabs: readonly { key: K; label: string; count: number }[]
  active: K
}>()

const emit = defineEmits<{
  'update:active': [key: K]
}>()

const select = (key: K): void => {
  emit('update:active', key)
}
</script>

<template>
  <div class="flex gap-1 border-b border-border-default" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      role="tab"
      :aria-selected="tab.key === active"
      :class="[
        'px-4 py-3 text-base font-medium transition-colors flex items-center gap-2 -mb-px border-b-2',
        tab.key === active
          ? 'text-brand-blue border-brand-blue'
          : 'text-text-secondary border-transparent hover:text-text-primary',
      ]"
      @click="select(tab.key)"
    >
      {{ tab.label }}
      <Pill :tone="tab.key === active ? 'brand' : 'neutral'">{{ tab.count }}</Pill>
    </button>
  </div>
</template>
