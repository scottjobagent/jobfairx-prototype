<!--
  EmptyJobsState
  ---------------
  Branded empty state for when no jobs are added (jobsIncomplete=true).
  This is the ONLY place the "Create a new job" CTA should appear when incomplete.
  Uses a blue-light background circle, matches lobby EmptyState pattern.
-->
<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
</script>

<template>
  <div class="jobs-empty-state">
    <div class="jobs-empty-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="3" y1="13" x2="21" y2="13" />
      </svg>
    </div>
    <div class="jobs-empty-title">No jobs added yet</div>
    <div class="jobs-empty-sub">Add your first job so candidates can apply and request interviews.</div>
    <div class="jobs-empty-actions">
      <BaseButton variant="primary">Create a new job</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.jobs-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 44px 24px;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  margin-bottom: 4px;
}

.jobs-empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f0f5ff;
  color: #0044b3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.jobs-empty-icon svg {
  width: 26px;
  height: 26px;
}

.jobs-empty-title {
  font-size: 17px;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 6px;
}

.jobs-empty-sub {
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
  max-width: 380px;
  margin-bottom: 18px;
}

.jobs-empty-actions {
  display: flex;
  justify-content: center;
}
</style>
