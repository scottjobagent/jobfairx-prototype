<!--
  JobPicker
  ---------
  Shows either a dropdown (multi-job) or static label (single-job).
  Emits changes when user selects a different job from dropdown.
-->
<script setup lang="ts">
import { computed } from 'vue'
import type { SharePreviewEvent, Job } from '@/types/share'

interface Props {
  event: SharePreviewEvent
  selectedJob?: Job | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedJob: null,
})

defineEmits<{
  change: [jobId: string]
  clear: []
}>()

const isSingleJob = computed<boolean>(() => props.event.jobs.length === 1)
const selectedJobId = computed<string>(() => props.selectedJob?.id ?? '')
</script>

<template>
  <div class="mb-5">
    <!-- Single job: static label -->
    <template v-if="isSingleJob && event.jobs[0]">
      <label class="block text-sm font-semibold text-text-primary mb-2">Job</label>
      <p class="text-base font-bold text-text-primary">{{ event.jobs[0].title }}</p>
      <p class="text-xs text-text-tertiary mt-0.5 font-medium">
        {{ event.jobs[0].company }} · {{ event.jobs[0].location }}
      </p>
    </template>

    <!-- Multi-job: dropdown -->
    <template v-else>
      <label for="jobSelect" class="block text-sm font-semibold text-text-primary mb-1.5">
        Job title
        <span class="text-status-danger">*</span>
      </label>
      <select
        id="jobSelect"
        :value="selectedJobId"
        class="w-full px-3.5 py-3 text-sm font-medium bg-surface-raised border border-border-strong rounded-lg text-text-primary focus:outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer"
        @change="(e) => {
          const val = (e.target as HTMLSelectElement).value;
          if (val) $emit('change', val);
          else $emit('clear');
        }"
      >
        <option value="">Please select a job...</option>
        <option v-for="job in event.jobs" :key="job.id" :value="job.id">
          {{ job.title }} — {{ job.company }}
        </option>
      </select>
    </template>
  </div>
</template>
