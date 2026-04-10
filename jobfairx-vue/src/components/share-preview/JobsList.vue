<!--
  JobsList
  --------
  Left panel showing the list of jobs available at the event.
  Each job can be expanded to show its full description.
  Clicking a job selects it and reveals the scheduler on the right.
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import StatusCard from '@/components/base/StatusCard.vue'
import JobRow from './JobRow.vue'
import type { SharePreviewEvent, Job } from '@/types/share'

interface Props {
  event: SharePreviewEvent
  selectedJob?: Job | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedJob: null,
})

const emit = defineEmits<{
  select: [job: Job]
}>()

const expandedJobId = ref<string | null>(null)

const isSingleJob = computed<boolean>(() => {
  return props.event.jobs.length === 1
})

// Auto-expand first job if single job event
const initExpandedJob = (): void => {
  if (isSingleJob.value && props.event.jobs.length > 0) {
    expandedJobId.value = props.event.jobs[0]?.id ?? null
  }
}

// Reset expanded state when event changes
const onEventChange = (): void => {
  expandedJobId.value = null
  initExpandedJob()
}

watch(() => props.event.title, onEventChange)

// Initialize on mount
initExpandedJob()

const handleJobClick = (job: Job): void => {
  emit('select', job)

  // Toggle expand for multi-job events; expand is set by default for single-job
  if (!isSingleJob.value) {
    expandedJobId.value = expandedJobId.value === job.id ? null : job.id
  }
}
</script>

<template>
  <StatusCard>
    <div class="p-8">
      <h1 class="text-3xl font-black text-text-primary mb-1">{{ event.title }}</h1>
      <p class="text-sm text-text-tertiary mb-6">{{ event.sub }}</p>

      <div class="border-b border-border-default mb-2"></div>

      <div class="space-y-px">
        <JobRow
          v-for="job in event.jobs"
          :key="job.id"
          :job="job"
          :expanded="expandedJobId === job.id"
          :selected="selectedJob?.id === job.id"
          :single-job="isSingleJob"
          @click="handleJobClick(job)"
        />
      </div>
    </div>
  </StatusCard>
</template>
