<!--
  JobRow
  ------
  A single job card showing title, salary, description, and Edit button.
  Used inside the jobs list in EditPostPage.
-->
<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useModal } from '@/composables/useModal'
import type { Job } from '@/types/job-post'

defineProps<{
  job: Job
}>()

const { open } = useModal()

const onEdit = (jobId: string): void => {
  // TODO(dev): wire to edit-job workflow. For now, just log.
  // eslint-disable-next-line no-console
  console.log('[JobRow] edit job:', jobId)
  open('editJob', { jobId })
}
</script>

<template>
  <div class="job-card">
    <div class="job-card-top">
      <div class="job-card-left">
        <div class="job-name">{{ job.title }}</div>
        <div class="job-pay">
          ${{ job.salaryMin.toLocaleString() }} – ${{ job.salaryMax.toLocaleString() }} /
          {{ job.salaryPeriod }}, {{ job.employmentType }}
        </div>
      </div>
      <div class="job-card-actions">
        <BaseButton variant="secondary" size="sm" @click="onEdit(job.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
          Edit
        </BaseButton>
      </div>
    </div>
    <div class="job-desc">
      {{ job.description }}
    </div>
  </div>
</template>

<style scoped>
.job-card {
  padding: 26px 0;
  border-top: 1px solid #ebebeb;
}

.job-card:first-child {
  border-top: none;
}

.job-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.job-card-left {
  flex: 1;
}

.job-name {
  font-size: 18px;
  font-weight: 700;
  color: #2d2d2d;
}

.job-pay {
  font-size: 14px;
  color: #0044b3;
  text-decoration: underline;
  margin-top: 5px;
}

.job-desc {
  font-size: 14px;
  color: #767676;
  margin-top: 14px;
  line-height: 1.7;
}

.job-card-actions {
  flex-shrink: 0;
  margin-left: 16px;
}

.job-card-actions :deep(button) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.job-card-actions svg {
  width: 16px;
  height: 16px;
}
</style>
