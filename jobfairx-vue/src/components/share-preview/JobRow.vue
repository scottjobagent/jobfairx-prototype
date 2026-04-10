<!--
  JobRow
  ------
  Single job row in the jobs list. Shows title, company, pay, location,
  and expands to show full description. Can be selected (highlight background).
-->
<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '@/types/share'

interface Props {
  job: Job
  expanded?: boolean
  selected?: boolean
  singleJob?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
  selected: false,
  singleJob: false,
})

defineEmits<{
  click: []
}>()

const chevronRotate = computed<string>(() => {
  return `transform transition-transform duration-200 ${props.expanded ? 'rotate-180' : ''}`
})
</script>

<template>
  <div
    :class="[
      'border-b border-border-default py-4.5 px-1 cursor-pointer transition-colors',
      selected && !singleJob ? 'bg-brand-blue-light' : 'hover:bg-surface-gray',
    ]"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3
          :class="[
            'text-lg font-bold mb-1',
            selected && !singleJob ? 'text-brand-blue-dark' : 'text-brand-blue underline',
          ]"
        >
          {{ job.title }}
        </h3>
        <p class="text-sm text-text-secondary mb-0.5">{{ job.company }}</p>
        <p class="text-sm text-text-secondary mb-0.5">{{ job.pay }}</p>
        <p class="text-sm text-text-secondary">{{ job.location }}</p>
      </div>

      <svg
        v-if="!singleJob"
        :class="chevronRotate"
        class="w-6 h-6 text-text-secondary flex-shrink-0 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>

    <!-- Expanded description -->
    <div v-if="expanded" class="mt-3.5 pt-3.5 border-t border-border-default space-y-2.5">
      <p v-for="(paragraph, idx) in job.desc" :key="idx" class="text-sm text-text-secondary leading-relaxed">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>
