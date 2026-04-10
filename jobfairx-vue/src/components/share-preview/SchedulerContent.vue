<!--
  SchedulerContent
  -----------------
  Main scheduler UI showing job picker, time slots, and submit button.
  Conditionally shows dropdown (multi-job) or static label (single-job).
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import JobPicker from './JobPicker.vue'
import TimeSlots from './TimeSlots.vue'
import type { SharePreviewEvent, Job } from '@/types/share'

interface Props {
  event: SharePreviewEvent
  selectedJob?: Job | null
  selectedSlotIdx?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedJob: null,
  selectedSlotIdx: null,
})

defineEmits<{
  selectSlot: [slotIdx: number]
  clear: []
  submit: []
}>()

const dropdownValue = ref<string>('')

// Update dropdown when job changes externally
watch(
  () => props.selectedJob?.id,
  (newId) => {
    if (newId) dropdownValue.value = newId
  },
)

const handleDropdownChange = (jobId: string): void => {
  dropdownValue.value = jobId
}

const canSubmit = computed<boolean>(() => {
  return props.selectedJob !== null && props.selectedSlotIdx !== null
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-black text-text-primary mb-3">Request your interview</h2>

    <div class="flex items-center gap-2 text-sm text-text-secondary mb-4">
      <svg class="w-4.5 h-4.5 text-text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="M22 8l-6 4 6 4V8z" />
      </svg>
      <span>This will be a virtual interview on JobFairX</span>
    </div>

    <div class="border-b border-border-default my-5"></div>

    <!-- Job picker -->
    <JobPicker
      :event="event"
      :selected-job="selectedJob"
      @change="handleDropdownChange"
      @clear="$emit('clear')"
    />

    <!-- Time slots (shown only when job selected) -->
    <TimeSlots
      v-if="selectedJob"
      :event="event"
      :job="selectedJob"
      :selected-slot-idx="selectedSlotIdx"
      @select-slot="$emit('selectSlot', $event)"
    />

    <!-- Submit button -->
    <BaseButton
      v-if="selectedJob"
      variant="primary"
      size="lg"
      class="w-full mt-4"
      :disabled="!canSubmit"
      @click="$emit('submit')"
    >
      Request interview
    </BaseButton>
  </div>
</template>
