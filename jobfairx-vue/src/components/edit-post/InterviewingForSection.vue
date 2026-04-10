<!--
  InterviewingForSection
  ----------------------
  The "Interviewing For" section containing job list, package usage cap,
  empty state, and add-job row. Implements the critical bug fix: when
  jobsIncomplete=true, hide the add-job-row and show the empty state
  with the CTA.
-->
<script setup lang="ts">
import { computed } from 'vue'
import StatusCard from '@/components/base/StatusCard.vue'
import JobRow from './JobRow.vue'
import AddJobRow from './AddJobRow.vue'
import EmptyJobsState from './EmptyJobsState.vue'
import PackageUsageCap from './PackageUsageCap.vue'
import type { Job } from '@/types/job-post'

interface Props {
  jobs: readonly Job[]
  packageTier: string
  jobsUsed: number
  jobsLimit: number
  jobsIncomplete: boolean
}

const props = defineProps<Props>()

const hasJobs = computed<boolean>(() => props.jobs.length > 0)
</script>

<template>
  <StatusCard>
    <div class="section-body">
      <!-- Package usage cap (hidden when incomplete) -->
      <PackageUsageCap
        v-if="!jobsIncomplete"
        :tier="packageTier"
        :jobs-used="jobsUsed"
        :jobs-limit="jobsLimit"
      />

      <!-- Job list or empty state -->
      <div v-if="hasJobs && !jobsIncomplete" class="jobs-list">
        <JobRow v-for="job in jobs" :key="job.id" :job="job" />
      </div>

      <EmptyJobsState v-if="jobsIncomplete" />

      <!-- Add job row (hidden when incomplete) -->
      <AddJobRow :hidden="jobsIncomplete" />
    </div>
  </StatusCard>
</template>

<style scoped>
.section-body {
  padding: 26px 36px 32px;
}

.jobs-list {
  /* Jobs render as individual JobRow components with built-in borders */
}
</style>
