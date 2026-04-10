<!--
  DeviceCompatibilityCard
  -------
  Shows either supported or incompatible devices/browsers with a colored
  left border indicating status.
-->
<script setup lang="ts">
import { computed } from 'vue'
import type { DeviceCard } from '@/types/troubleshooting'

const props = defineProps<{
  card: DeviceCard
}>()

const borderColor = computed<string>(() =>
  props.card.type === 'supported' ? 'border-l-status-success' : 'border-l-status-danger',
)

const titleColor = computed<string>(() =>
  props.card.type === 'supported' ? 'text-status-success' : 'text-status-danger',
)
</script>

<template>
  <div :class="['bg-surface-gray rounded-md p-5 md:p-6 border-l-4', borderColor]">
    <div :class="['text-sm font-semibold mb-3', titleColor]">{{ card.title }}</div>
    <ul class="space-y-2">
      <li v-for="(item, idx) in card.items" :key="idx" class="text-sm text-text-primary">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
