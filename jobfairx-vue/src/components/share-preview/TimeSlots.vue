<!--
  TimeSlots
  ---------
  Shows available time slots for the selected job.
  Displays timezone, date, and a list of clickable slots.
  Slots with zero remaining are disabled.
-->
<script setup lang="ts">
import { computed } from 'vue'
import type { SharePreviewEvent, Job } from '@/types/share'

interface Props {
  event: SharePreviewEvent
  job: Job
  selectedSlotIdx?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedSlotIdx: null,
})

defineEmits<{
  selectSlot: [slotIdx: number]
}>()

// Extract timezone abbreviation from "Central Time (CDT)" → "CDT"
const tzAbbr = computed<string>(() => {
  const match = props.event.tz.match(/\(([^)]+)\)/)
  return match?.[1] ?? props.event.tz
})

const pluralizeSpots = (count: number): string => {
  return count === 1 ? 'spot' : 'spots'
}
</script>

<template>
  <div class="mt-5">
    <label class="block text-sm font-semibold text-text-primary mb-2">Select a time</label>

    <div class="flex items-center gap-1.5 text-xs text-text-tertiary mb-3">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{{ event.tz }}</span>
    </div>

    <p class="text-sm font-bold text-text-primary mb-4">{{ event.date }}</p>

    <div class="border border-border-strong rounded-lg overflow-hidden mb-4">
      <button
        v-for="(slot, idx) in job.slots"
        :key="idx"
        type="button"
        :disabled="slot.remaining === 0"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3.5 text-sm border-b border-border-strong last:border-b-0',
          'transition-colors',
          slot.remaining === 0
            ? 'bg-surface-raised cursor-not-allowed opacity-50'
            : selectedSlotIdx === idx
              ? 'bg-brand-blue-light'
              : 'bg-surface-raised hover:bg-surface-sunken cursor-pointer',
        ]"
        @click="!slot.remaining || $emit('selectSlot', idx)"
      >
        <!-- Radio button -->
        <div
          :class="[
            'w-4.5 h-4.5 rounded-full border-2 flex-shrink-0',
            selectedSlotIdx === idx
              ? 'border-brand-blue bg-brand-blue'
              : 'border-border-strong bg-surface-raised',
          ]"
        >
          <div
            v-if="selectedSlotIdx === idx"
            class="w-full h-full flex items-center justify-center"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-surface-raised"></div>
          </div>
        </div>

        <!-- Time + timezone abbr -->
        <div class="font-bold text-text-primary">
          {{ slot.time }}
          <span class="text-xs text-text-secondary font-medium ml-1.5">{{ tzAbbr }}</span>
        </div>

        <!-- Remaining spots -->
        <div class="text-xs text-text-tertiary ml-auto">
          {{ slot.remaining }} {{ pluralizeSpots(slot.remaining) }} remaining
        </div>
      </button>
    </div>
  </div>
</template>
