<!--
  SchedulerPanel
  ---------------
  Right sticky panel for interview scheduling.
  Shows job picker, time slots, and submit button.
  Displays success state after submission.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import StatusCard from '@/components/base/StatusCard.vue'
import SchedulerContent from './SchedulerContent.vue'
import SchedulerSuccess from './SchedulerSuccess.vue'
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

const emit = defineEmits<{
  selectSlot: [slotIdx: number]
  clear: []
}>()

const isSuccess = ref<boolean>(false)
const successJobTitle = ref<string>('')
const successSlotTime = ref<string>('')

const canSubmit = computed<boolean>(() => {
  return props.selectedJob !== null && props.selectedSlotIdx !== null
})

const handleSubmit = (): void => {
  if (!canSubmit.value || !props.selectedJob) return

  const slotIdx = props.selectedSlotIdx ?? -1
  if (slotIdx < 0) return

  const slot = props.selectedJob.slots[slotIdx]
  if (!slot) return

  successJobTitle.value = props.selectedJob.title
  successSlotTime.value = slot.time
  isSuccess.value = true
}

const handleReset = (): void => {
  isSuccess.value = false
  emit('clear')
}

const onSelectSlot = (slotIdx: number): void => emit('selectSlot', slotIdx)
const onClear = (): void => emit('clear')
</script>

<template>
  <StatusCard>
    <div class="p-7">
      <SchedulerSuccess
        v-if="isSuccess"
        :job-title="successJobTitle"
        :slot-time="successSlotTime"
        @reset="handleReset"
      />

      <SchedulerContent
        v-else
        :event="event"
        :selected-job="selectedJob"
        :selected-slot-idx="selectedSlotIdx"
        @select-slot="onSelectSlot"
        @clear="onClear"
        @submit="handleSubmit"
      />
    </div>
  </StatusCard>
</template>
